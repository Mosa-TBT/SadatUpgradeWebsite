#!/usr/bin/env bash
#
# rollback.sh — restore the previous release as `current` and restart.
# Runs as the `deploy` user (scoped sudo for the service restart only).
#
# Usage: rollback.sh [health-url]
set -euo pipefail

BASE="${SADAT_BASE:-/var/www/sadat-upgrade}"
RELEASES="$BASE/releases"
SHARED="$BASE/shared"
CURRENT="$BASE/current"
HEALTH_URL="${1:-http://127.0.0.1:3180/}"

if [ ! -L "$CURRENT" ]; then
  echo "ERROR: no current symlink; nothing to roll back" >&2
  exit 1
fi

BROKEN="$(basename "$(realpath "$CURRENT")")"
PREV="$(cat "$SHARED/last-release" 2>/dev/null || true)"

if [ -z "$PREV" ] || [ ! -d "$RELEASES/$PREV" ]; then
  echo "ERROR: previous release not found ($PREV)" >&2
  exit 1
fi

echo "==> rollback.sh: $BROKEN -> $PREV"

ln -sfn "$RELEASES/$PREV" "$CURRENT"
if [ "${SADAT_SKIP_SERVICE:-0}" = "1" ]; then
  echo "--> service restart skipped (test mode)"
else
  sudo -n systemctl restart sadatupgrade-frontend.service
fi
sleep 3

if "$BASE/deploy/bin/healthcheck.sh" "$HEALTH_URL"; then
  echo "==> OK: rolled back to $PREV"
  exit 0
fi

echo "==> ERROR: rollback target $PREV also failed health check (manual intervention required)" >&2
exit 1