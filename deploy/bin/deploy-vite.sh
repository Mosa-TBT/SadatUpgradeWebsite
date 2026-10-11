#!/usr/bin/env bash
#
# deploy-vite.sh — install and atomically switch the Vite (React) SPA release.
#
# Executed by CI on the VPS for a release name, e.g.:
#   deploy-vite.sh <release-timestamp>
#
# Assumptions (verify/adjust per server):
#   BASE             = /var/www/sadat-upgrade
#   RELEASES         = $BASE/releases        (release source extraction)
#   current-web      = $BASE/current-web     (symlink -> $RELEASES/<ts>/dist)
#   Web server docroot points at $BASE/current-web with SPA fallback to
#   index.html (see deploy/apache/sadatupgrade-vite.conf.example).
#
set -euo pipefail

BASE="${SADAT_BASE:-/var/www/sadat-upgrade}"
RELEASES="$BASE/releases"
SHARED="$BASE/shared"
CURRENT_WEB="$BASE/current-web"

TS="$1"
SRC_TAR="$RELEASES/sadat-web-$TS.tar.gz"

echo "==> deploy-vite.sh: web release $TS"
[ -f "$SRC_TAR" ] || { echo "ERROR: tarball missing: $SRC_TAR" >&2; exit 1; }
[ -d "$BASE" ] || { echo "ERROR: app base missing: $BASE" >&2; exit 1; }

# 1. Extract source into a fresh release dir
mkdir -p "$RELEASES/$TS"
if [ -n "$(ls -A "$RELEASES/$TS" 2>/dev/null)" ]; then
  rm -rf "$RELEASES/$TS"/*
fi
tar -xzf "$SRC_TAR" -C "$RELEASES/$TS"
rm -f "$SRC_TAR"

cd "$RELEASES/$TS"

# 2. Build the SPA (pnpm). Prefer the project's locked dependencies.
if command -v pnpm >/dev/null 2>&1; then
  pnpm install --frozen-lockfile --no-audit --no-fund
elif command -v corepack >/dev/null 2>&1; then
  corepack enable
  pnpm install --frozen-lockfile --no-audit --no-fund
else
  echo "WARN: neither pnpm nor corepack found; attempting npm" >&2
  npm install --no-audit --no-fund
  npm run build
  ln -sfn "$RELEASES/$TS/dist" "$CURRENT_WEB"
  echo "==> web release $TS live (npm path)"
  exit 0
fi
pnpm build

test -f "$RELEASES/$TS/dist/index.html" || { echo "ERROR: dist/index.html missing after build" >&2; exit 1; }

# 3. Remember previous web for rollback
PREV=""
if [ -L "$CURRENT_WEB" ]; then
  PREV="$(realpath "$CURRENT_WEB" | sed 's#.*/##')"
fi
echo "$PREV" > "$SHARED/last-web-release" 2>/dev/null || true

# 4. Atomic switch
mkdir -p "$(dirname "$CURRENT_WEB")"
ln -sfn "$RELEASES/$TS/dist" "$CURRENT_WEB.tmp"
[ -L "$CURRENT_WEB" ] && rm -f "$CURRENT_WEB"
mv "$CURRENT_WEB.tmp" "$CURRENT_WEB"
echo "--> current-web -> $CURRENT_WEB"

# 5. Reload the web server gracefully (owner-managed service name)
if [ "${SADAT_SKIP_SERVICE:-0}" != "1" ]; then
  sudo -n systemctl reload apache2 2>/dev/null || \
  sudo -n systemctl reload nginx 2>/dev/null || true
fi

# 6. Health check with rollback
sleep 2
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1/}"
if curl -fsS -o /dev/null "$HEALTH_URL"; then
  echo "==> OK: web release $TS is live"
  exit 0
fi

echo "==> HEALTH CHECK FAILED, rolling back" >&2
if [ -n "$PREV" ] && [ -d "$RELEASES/$PREV/dist" ]; then
  ln -sfn "$RELEASES/$PREV/dist" "$CURRENT_WEB"
  sudo -n systemctl reload apache2 2>/dev/null || true
  echo "==> restored web release $PREV" >&2
fi
exit 1