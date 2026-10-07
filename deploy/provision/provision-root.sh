#!/usr/bin/env bash
#
# provision-root.sh — ONE-TIME production provisioning for
# Mosa-TBT/SadatUpgradeWebsite on the SadatUpgrade VPS (145.79.8.231).
#
# MUST be run as root (or with sudo) by the server operator.
#   sudo bash provision-root.sh /path/to/repo-checkout
#
# It is idempotent and ONLY touches SadaatUpgrade-related resources:
#   /var/www/sadat-upgrade, /etc/apache2/sites-available/sadaatupgrade.com*.conf,
#   /etc/systemd/system/sadatupgrade-*.service, /etc/sudoers.d/sadatupgrade-deploy,
#   /var/backups/sadat-upgrade (backups of configuration that this script adds to).
#
# It does NOT modify other vhosts, databases, users, SSH keys, or the firewall.
set -euo pipefail

REPO="${1:?usage: sudo provision-root.sh /path/to/repo-checkout}"
BASE=/var/www/sadat-upgrade
RELEASES="$BASE/releases"
SHARED="$BASE/shared"
HTTPD=/etc/apache2
BACKUP=/var/backups/sadat-upgrade
DOMAIN=SadaatUpgrade.com
DOMAIN_LOW=sadaatupgrade.com

if [ "$(id -u)" -ne 0 ]; then
  echo "ERROR: run as root: sudo provision-root.sh <repo>" >&2
  exit 1
fi

echo "==> Step 1: backup the Apache configuration we may add to"
mkdir -p "$BACKUP"
BACKUP_FILE="$BACKUP/apache-snap-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$BACKUP_FILE" -C /etc "$(basename "$HTTPD")/sites-available" "$(basename "$HTTPD")/apache2.conf" "$(basename "$HTTPD")/ports.conf" 2>/dev/null || true
echo "    backup created: $BACKUP_FILE"

echo "==> Step 2: application directory layout (deploy-owned)"
mkdir -p "$RELEASES" "$SHARED/acme-challenge" "$BASE/deploy/bin"
chown -R deploy:deploy "$BASE"
chmod -R 755 "$BASE"
chmod 750 "$SHARED/acme-challenge"
echo "    $BASE ready"

echo "==> Step 3: copy deployment scripts"
install -o deploy -g deploy -m 0755 -d "$BASE/deploy/bin"
install -o deploy -g deploy -m 0755 "$REPO/deploy/bin/deploy.sh"     "$BASE/deploy/bin/deploy.sh"
install -o deploy -g deploy -m 0755 "$REPO/deploy/bin/rollback.sh"    "$BASE/deploy/bin/rollback.sh"
install -o deploy -g deploy -m 0755 "$REPO/deploy/bin/healthcheck.sh" "$BASE/deploy/bin/healthcheck.sh"

echo "==> Step 4: production .env (edit values by hand, then it is deploy-owned)"
if [ ! -f "$SHARED/.env" ]; then
  install -o deploy -g deploy -m 0600 /dev/null "$SHARED/.env"
  cat > "$SHARED/.env" <<EOF
# Production environment for SadaatUpgrade.com Next.js frontend.
# NEXT_PUBLIC_* values are inlined at BUILD time — CI rebuilds on every deploy.
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
NEXT_PUBLIC_API_URL=https://$DOMAIN/api
# Place any non-public runtime secrets below (never commit these to Git):
# NEXT_PRIVATE_ANALYTICS_KEY=
NEXT_TELEMETRY_DISABLED=1
EOF
  chown deploy:deploy "$SHARED/.env"
  chmod 600 "$SHARED/.env"
  echo "    created $SHARED/.env — EDIT IT to fill real secrets"
else
  echo "    $SHARED/.env already exists (kept as-is)"
fi

echo "==> Step 5: scoped sudo for the deploy user (restart ONLY the two app services)"
SUDOFILE=/etc/sudoers.d/sadatupgrade-deploy
cat > "$SUDOFILE" <<EOF
# Allow the deploy user to restart ONLY the SadaatUpgrade services (no general root).
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl start sadatupgrade-frontend.service, /usr/bin/systemctl restart sadatupgrade-frontend.service, /usr/bin/systemctl stop sadatupgrade-frontend.service, /usr/bin/systemctl status sadatupgrade-frontend.service, /usr/bin/systemctl start sadatupgrade-backend.service, /usr/bin/systemctl restart sadatupgrade-backend.service, /usr/bin/systemctl stop sadatupgrade-backend.service, /usr/bin/systemctl status sadatupgrade-backend.service
EOF
chmod 440 "$SUDOFILE"
visudo -c -f "$SUDOFILE"

echo "==> Step 6: systemd units (enabled, NOT started until first deploy)"
install -o root -g root -m 0644 "$REPO/deploy/systemd/sadatupgrade-frontend.service" /etc/systemd/system/sadatupgrade-frontend.service
if [ -f "$REPO/deploy/systemd/sadatupgrade-backend.service" ]; then
  install -o root -g root -m 0644 "$REPO/deploy/systemd/sadatupgrade-backend.service" /etc/systemd/system/sadatupgrade-backend.service
fi
systemctl daemon-reload
systemctl enable sadatupgrade-frontend.service
systemctl is-enabled sadatupgrade-frontend.service
[ -f /etc/systemd/system/sadatupgrade-backend.service ] && systemctl enable sadatupgrade-backend.service || true

echo "==> Step 7: Apache vhost (HTTP first: redirect + ACME challenge path)"
install -o root -g root -m 0644 "$REPO/deploy/apache/$DOMAIN_LOW.conf" "$HTTPD/sites-available/$DOMAIN_LOW.conf"
a2ensite "$DOMAIN_LOW.conf"
# Certbot challenges must be reachable over HTTP.
mkdir -p "$SHARED/acme-challenge"
apache2ctl configtest
systemctl reload apache2
echo "    HTTP vhost enabled (redirects to HTTPS once the certificate exists)"

echo "==> Step 8: TLS certificate (run only after DNS confirms: dig $DOMAIN = 145.79.8.231)"
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  certbot certonly --webroot -w "$SHARED/acme-challenge" \
    -d "$DOMAIN" -d "www.$DOMAIN" \
    --non-interactive --agree-tos --email webmaster@"$DOMAIN" --redirect

  # Install the HTTPS vhost placed earlier under deploy/apache/.
  install -o root -g root -m 0644 "$REPO/deploy/apache/$DOMAIN_LOW-le-ssl.conf" "$HTTPD/sites-available/$DOMAIN_LOW-le-ssl.conf"
  a2ensite "$DOMAIN_LOW-le-ssl.conf"
  apache2ctl configtest
  systemctl reload apache2
  echo "    HTTPS vhost enabled."
else
  echo "    certificate already present for $DOMAIN — verifying renewal"
  certbot renew --dry-run || true
fi

echo
echo "==> Provisioning complete. Remaining manual steps:"
echo "  1. Edit $SHARED/.env with real secrets."
echo "  2. Ensure DNS:  $DOMAIN and www.$DOMAIN -> 145.79.8.231 (verified: yes)."
echo "  3. Run the first CI deployment from the 'main' branch; the workflow will"
echo "     create the first release, provider/start the service, and health-check."
echo "  4. If mysql is required for the Laravel backend, run:"
echo "       mysql -e \"CREATE DATABASE sadatupgrade CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\""
echo "       mysql -e \"CREATE USER 'sadatupgrade'@'localhost' IDENTIFIED BY '<strong-password>';\""
echo "       mysql -e \"GRANT ALL PRIVILEGES ON sadatupgrade.* TO 'sadatupgrade'@'localhost';\""
echo "     then create backend/.env with DB_* values and set the API secrets."