#!/usr/bin/env bash
#
# deploy-web-dist.sh — deploy a CI-built Vite `dist` release and atomically
# switch ONLY the `current-web` symlink. No build and no package installation
# happen on the server, so no pnpm/corepack is required here.
#
# Usage: deploy-web-dist.sh <release-id>
#
# Guarantees:
#   * Never reads or writes /var/www/sadat-upgrade/current (Next.js + Laravel).
#   * Never overwrites an existing *valid* release directory.
#   * Inspects the archive (rejects absolute / ".." paths) and validates
#     index.html + every referenced local asset BEFORE activation.
#   * Activates with an atomic rename (`mv -T`); there is no delete-then-create
#     window. Rollback uses the same atomic method.
#   * On any pre-activation failure, `current-web` is left untouched and only
#     the incomplete new release directory is removed.
#
set -euo pipefail

BASE="${SADAT_BASE:-/var/www/sadat-upgrade}"
RELEASES="$BASE/releases"
SHARED="$BASE/shared"
CURRENT_WEB="$BASE/current-web"

TS="${1:?usage: deploy-web-dist.sh <release-id>}"
TAR="$RELEASES/sadat-web-$TS-dist.tar.gz"
REL_DIR="$RELEASES/$TS"
DIST="$REL_DIR/dist"
TMP_LINK="$BASE/current-web.tmp"

CREATED=0
ACTIVATED=0

cleanup() {
  rc=$?
  trap - EXIT
  # Remove a stray temp symlink if one is left behind.
  [ -L "$TMP_LINK" ] && rm -f -- "$TMP_LINK" || true
  # Clean up ONLY an incomplete new release, and only before activation.
  if [ "$rc" -ne 0 ] && [ "$CREATED" -eq 1 ] && [ "$ACTIVATED" -eq 0 ]; then
    echo "==> deploy failed; removing incomplete release: $REL_DIR" >&2
    rm -rf -- "$REL_DIR"
  fi
  exit "$rc"
}
trap cleanup EXIT

echo "==> deploy-web-dist.sh: release $TS"

[ -d "$BASE" ] || { echo "ERROR: app base missing: $BASE" >&2; exit 1; }
[ -f "$TAR" ]  || { echo "ERROR: dist archive missing: $TAR" >&2; exit 1; }

# --- 0. Idempotency guard: never overwrite an existing valid release ---
if [ -e "$REL_DIR" ]; then
  if [ -f "$DIST/index.html" ]; then
    echo "ERROR: release $TS already exists and looks valid; refusing to overwrite." >&2
    exit 1
  fi
  echo "WARN: release $TS exists but is incomplete; replacing it." >&2
  rm -rf -- "$REL_DIR"
fi

# --- 1. Inspect the archive safely BEFORE extracting anything ---
listing="$(tar -tzf "$TAR" 2>/dev/null)" || { echo "ERROR: cannot read archive: $TAR" >&2; exit 1; }
[ -n "$listing" ] || { echo "ERROR: archive is empty: $TAR" >&2; exit 1; }

# Reject absolute paths and any ".." path component.
if printf '%s\n' "$listing" | grep -Eq '(^/)|(^|/)\.\.(/|$)'; then
  echo "ERROR: archive contains absolute or parent-traversal paths; refusing to extract." >&2
  exit 1
fi

# Reject unexpected entry types: only regular files ('-') and directories ('d').
if tar -tvzf "$TAR" 2>/dev/null | cut -c1 | grep -qvE '^[-d]$'; then
  echo "ERROR: archive contains an unexpected entry type (symlink/hardlink/special); refusing." >&2
  exit 1
fi

if ! printf '%s\n' "$listing" | grep -Eq '^(\./)?index\.html$'; then
  echo "ERROR: archive does not contain index.html at its root." >&2
  exit 1
fi

# --- 2. Extract into a fresh release dir (only this dir is created) ---
mkdir -p -- "$REL_DIR" "$DIST"
CREATED=1
tar -xzf "$TAR" -C "$DIST"
rm -f -- "$TAR"

# --- 3. Validate BEFORE activation ---
[ -f "$DIST/index.html" ] || { echo "ERROR: dist/index.html missing after extract." >&2; exit 1; }

miss=0
refs="$(grep -oE '(src|href)="/[^"]+"' "$DIST/index.html" | sed -E 's/^[^=]*="\/?([^"]+)"/\1/' || true)"
for ref in $refs; do
  case "$ref" in
    //*) continue ;;   # protocol-relative / external URLs
  esac
  [ -f "$DIST/$ref" ] && continue
  # Bundled JS/CSS and anything under assets/ must exist (hard fail).
  # Other referenced files (e.g. a favicon) only warn, so a pre-existing
  # 404 cannot block activation of an otherwise valid bundle.
  case "$ref" in
    *.js|*.css|assets/*) echo "ERROR: referenced asset missing: /$ref" >&2; miss=1 ;;
    *) echo "WARN: referenced file missing (non-critical, ignored): /$ref" >&2 ;;
  esac
done
[ "$miss" -eq 0 ] || exit 1
[ -d "$DIST/assets" ] && [ -n "$(ls -A "$DIST/assets")" ] || { echo "ERROR: dist/assets missing or empty." >&2; exit 1; }

# --- 4. Record the previous release id for rollback (dir name, not 'dist') ---
PREV=""
if [ -L "$CURRENT_WEB" ]; then
  PREV="$(realpath -- "$CURRENT_WEB" | awk -F/ '{print $(NF-1)}')"
fi
printf '%s\n' "$PREV" > "$SHARED/last-web-release" 2>/dev/null || true

# --- 5. Atomic activation: temp symlink beside current-web, then `mv -T` ---
ln -sfn -- "$DIST" "$TMP_LINK"
mv -T -- "$TMP_LINK" "$CURRENT_WEB"
ACTIVATED=1
echo "--> current-web -> $DIST"

# --- 6. Post-activation sanity check; roll back atomically if broken ---
if [ ! -f "$CURRENT_WEB/index.html" ]; then
  echo "==> post-activation check failed; rolling back to '${PREV:-<none>}'" >&2
  if [ -n "$PREV" ] && [ -d "$RELEASES/$PREV/dist" ]; then
    ln -sfn -- "$RELEASES/$PREV/dist" "$TMP_LINK"
    mv -T -- "$TMP_LINK" "$CURRENT_WEB"
    echo "==> restored release $PREV" >&2
  fi
  exit 1
fi

echo "==> OK: release $TS activated (current-web -> $TS)"
