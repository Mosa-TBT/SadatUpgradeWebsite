#!/usr/bin/env bash
#
# deploy.sh — remote deployment of a release, executed by CI as the `deploy`
# user on the production VPS.
#
# Usage: deploy.sh <release-timestamp>
#
# The GitHub Actions workflow first uploads:
#   /var/www/sadat-upgrade/releases/sadat-src-<TS>.tar.gz
# containing the current `main` source (no node_modules/.next/.git).
#
# This script:
#   1. extracts it into a new release dir
#   2. links the shared production env
#   3. installs exact dependencies and builds the production bundle
#   4. switches `current` to the new release (symlink swap)
#   5. restarts the frontend service (scoped sudo)
#   6. health-checks; on failure rolls back to the previous release
#
set -euo pipefail

# Overridable for tests; production default is /var/www/sadat-upgrade.
BASE="${SADAT_BASE:-/var/www/sadat-upgrade}"
RELEASES="$BASE/releases"
SHARED="$BASE/shared"
CURRENT="$BASE/current"

if [ $# -ne 1 ]; then
  echo "usage: $0 <release-timestamp>" >&2
  exit 2
fi

TS="$1"
RELEASE_DIR="$RELEASES/$TS"
SRC_TAR="$RELEASES/sadat-src-$TS.tar.gz"
HEALTH_URL="http://127.0.0.1:3180/"

echo "==> deploy.sh: release $TS"

[ -f "$SRC_TAR" ] || { echo "ERROR: tarball missing: $SRC_TAR" >&2; exit 1; }
[ -d "$BASE" ] || { echo "ERROR: app base missing: $BASE" >&2; exit 1; }

# 1. Extract release
test -d "$RELEASE_DIR" && rm -rf "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR"
echo "--> extracting source"
tar -xzf "$SRC_TAR" -C "$RELEASE_DIR"
rm -f "$SRC_TAR"

cd "$RELEASE_DIR"

# 2. Production env (NEXT_PUBLIC_* are inlined at build time, so link BEFORE build)
if [ -f "$SHARED/.env" ]; then
  ln -sfn "$SHARED/.env" "$RELEASE_DIR/.env.local"
  echo "--> linked shared/.env"
else
  echo "WARNING: $SHARED/.env not found; using default env" >&2
fi

# 3. Install + build
echo "--> npm ci"
npm ci --no-audit --no-fund
echo "--> npm run build (this can take a few minutes)"
npm run build

# Backend (Laravel) release prep, if the backend is present in the repo.
if [ -d "$RELEASE_DIR/backend" ] && [ -f "$RELEASE_DIR/backend/artisan" ]; then
  ln -sfn "$SHARED/backend.env" "$RELEASE_DIR/backend/.env" 2>/dev/null || true
  # Durable storage: keep Laravel storage in the shared dir across releases.
  mkdir -p "$SHARED/laravel-storage/app/public/uploads/team" \
           "$SHARED/laravel-storage/framework/sessions" \
           "$SHARED/laravel-storage/framework/cache" \
           "$SHARED/laravel-storage/framework/views" \
           "$SHARED/laravel-storage/logs"
  chmod 750 "$SHARED/laravel-storage" "$SHARED/laravel-storage/framework" "$SHARED/laravel-storage/logs" 2>/dev/null || true
  rm -rf "$RELEASE_DIR/backend/public/storage"
  ln -sfn "$SHARED/laravel-storage" "$RELEASE_DIR/backend/storage"
  ln -sfn "../storage/app/public" "$RELEASE_DIR/backend/public/storage"
  echo "--> composer install (backend)"
  (cd "$RELEASE_DIR/backend" && composer install --no-dev --optimize-autoloader --no-interaction --no-progress) \
    || echo "WARN: backend composer install failed" >&2
fi
mkdir -p "$SHARED"
PREV=""
if [ -L "$CURRENT" ]; then
  PREV="$(realpath "$CURRENT" | sed 's#.*/##')"
fi
echo "$PREV" > "$SHARED/last-release"

ln -sfn "$RELEASE_DIR" "$CURRENT"
echo "--> current -> $RELEASE_DIR"

# 5. Restart service (operator granted scoped NOPASSWD sudo for exactly this)
if [ "${SADAT_SKIP_SERVICE:-0}" = "1" ]; then
  echo "--> service restart skipped (test mode)"
elif [ -n "$PREV" ] || systemctl is-active --quiet sadatupgrade-frontend.service 2>/dev/null; then
  sudo -n systemctl restart sadatupgrade-frontend.service
  echo "--> frontend service restarted"
else
  echo "WARNING: service not previously active; start it after first volume setup" >&2
  sudo -n systemctl start sadatupgrade-frontend.service || true
fi

# Restart the Laravel backend too (its unit runs `php artisan serve` from
# current/backend; without a restart+flush it keeps serving the previous
# release's code and cached public config).
if [ -d "$CURRENT/backend" ] && [ -f "$CURRENT/backend/artisan" ]; then
  ARTISAN="/usr/bin/php $CURRENT/backend/artisan"
  (cd "$CURRENT/backend" && /usr/bin/php artisan migrate --force) || echo "WARN: backend migrate step failed" >&2
  (cd "$CURRENT/backend" && /usr/bin/php artisan cache:clear) || echo "WARN: backend cache:clear failed" >&2
  (cd "$CURRENT/backend" && /usr/bin/php artisan config:clear) || echo "WARN: backend config:clear failed" >&2
  if systemctl list-unit-files | grep -q '^sadatupgrade-backend.service'; then
    sudo -n systemctl restart sadatupgrade-backend.service \
      && echo "--> backend service restarted" \
      || echo "WARN: backend service restart failed" >&2
  fi
fi

# 6. Health check with rollback
sleep 3
if "$BASE/deploy/bin/healthcheck.sh" "$HEALTH_URL"; then
  echo "==> OK: release $TS is live"
  exit 0
fi

echo "==> HEALTH CHECK FAILED, rolling back" >&2
"$BASE/deploy/bin/rollback.sh" "$HEALTH_URL" || true
exit 1