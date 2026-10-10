#!/usr/bin/env bash
# Run as ROOT once: sudo bash /var/www/sadat-upgrade/shared/apache-add-backend.sh
#
# Adds Laravel backend reverse-proxy (/api, /sanctum, /storage) to the
# SadaatUpgrade HTTPS vhost and ALWAYS reloads Apache so the change is live.
# The Next.js frontend proxy (/) is preserved. Idempotent + safe:
#   - only touches sites-available/sadaatupgrade.com-ssl.conf
#   - backs up the vhost before the first modification
#   - validates with `apache2ctl configtest` and reloads only if valid
set -euo pipefail

VHOST=/etc/apache2/sites-available/sadaatupgrade.com-ssl.conf
ANCHOR='ProxyPassReverse / http://127.0.0.1:3180/'
BLOCK=$(cat <<'EOB'
    ProxyPass /sanctum/ http://127.0.0.1:8009/sanctum/
    ProxyPassReverse /sanctum/ http://127.0.0.1:8009/sanctum/
    ProxyPass /api/ http://127.0.0.1:8009/api/
    ProxyPassReverse /api/ http://127.0.0.1:8009/api/
    ProxyPass /storage/ http://127.0.0.1:8009/storage/
    ProxyPassReverse /storage/ http://127.0.0.1:8009/storage/
EOB
)

if grep -qE '^\s*ProxyPass\s+/api/' "$VHOST"; then
  echo "vhost already contains the backend proxy"
else
  cp -a "$VHOST" "${VHOST}.bak-$(date +%Y%m%d-%H%M%S)"
  awk -v anchor="$ANCHOR" -v block="$BLOCK" '{ print } $0 ~ anchor { print block }' "$VHOST" > "$VHOST.new"
  if grep -q '/api/' "$VHOST.new"; then
    mv "$VHOST.new" "$VHOST"
    echo "vhost updated with Laravel backend proxy"
  else
    echo "anchor '$ANCHOR' not found; vhost left unchanged" >&2
    rm -f "$VHOST.new"
    exit 1
  fi
fi

# Always validate and reload so the running Apache picks up the config.
apache2ctl configtest
systemctl reload apache2
echo "OK: Apache reloaded; /api, /sanctum, /storage -> 127.0.0.1:8009"