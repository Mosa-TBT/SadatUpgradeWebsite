#!/usr/bin/env bash
#
# healthcheck.sh — verify an endpoint returns HTTP 200.
# Usage: healthcheck.sh <url> [attempts] [interval]
set -euo pipefail

URL="${1:?usage: healthcheck.sh <url> [attempts] [interval]}"
ATTEMPTS="${2:-5}"
INTERVAL="${3:-3}"

for i in $(seq 1 "$ATTEMPTS"); do
  code="$(curl -sS --max-time 10 -o /dev/null -w '%{http_code}' "$URL" || true)"
  if [ -n "$code" ] && [ "$code" -eq 200 ]; then
    echo "OK: $URL -> HTTP $code (attempt $i)"
    exit 0
  fi
  echo "wait: $URL -> $code (attempt $i/$ATTEMPTS)"
  [ "$i" -lt "$ATTEMPTS" ] && sleep "$INTERVAL"
done

echo "FAILED: $URL did not return HTTP 200 after $ATTEMPTS attempts" >&2
exit 1