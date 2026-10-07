# Production Deployment Runbook — SadaatUpgrade.com

Target VPS: `145.79.8.231` (Ubuntu 24.04, Apache 2.4.58, Node 22, PHP 8.4, MySQL 8.0)
Deploy user: `deploy` (no general sudo; scoped sudo for app service restarts only)

Repository: `github.com/Mosa-TBT/SadatUpgradeWebsite` — **private repo; this package was
authored from a local copy of the project. Verify the repo matches before the first deploy.**

---

## 1) Pre-flight (operator, read-only)

```bash
# From your machine:
dig SadaatUpgrade.com       # must return 145.79.8.231
dig www.SadaatUpgrade.com   # must return 145.79.8.231  (verified on 2026-10-07)

# On the VPS (root):
ssh deploy@145.79.8.231 'cat /etc/os-release; apache2 -v; node -v; php -v; systemctl is-active apache2 mysql nginx'
```

## 2) One-time provisioning (root)

```bash
git clone --depth 1 https://github.com/Mosa-TBT/SadatUpgradeWebsite.git /tmp/sadat-repo   # any machine with repo access
scp -r /tmp/sadat-repo/deploy /tmp/sadat-repo/.github root@145.79.8.231:/tmp/sadat-deploy/  # or use the repo checkout itself
ssh root@145.79.8.231
cd /tmp/sadat-deploy && sudo bash deploy/provision/provision-root.sh /tmp/sadat-deploy
```

What this does (idempotent):
1. Backs up the Apache config we add to → `/var/backups/sadat-upgrade/`.
2. Creates `/var/www/sadat-upgrade/{releases,shared,deploy}` owned by `deploy`.
3. Installs `deploy/bin/*.sh`.
4. Creates `/var/www/sadat-upgrade/shared/.env` (chmod 600, deploy-owned) — **edit secrets**.
5. Adds scoped sudoers so `deploy` can restart only the two app services.
6. Installs + enables `sadatupgrade-frontend.service` (and backend if shipped).
7. Installs the HTTP Apache vhost + ACME alias and reloads Apache.
8. Requests the Let's Encrypt cert for `SadaatUpgrade.com` + `www.SadaatUpgrade.com`
   (webroot), installs the HTTPS vhost, verifies `certbot renew --dry-run`.

Optional (Laravel backend requiring MySQL), run on the VPS as root:
```bash
mysql -e "CREATE DATABASE IF NOT EXISTS sadatupgrade CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER IF NOT EXISTS 'sadatupgrade'@'localhost' IDENTIFIED BY '<STRONG_PASSWORD>';"
mysql -e "GRANT ALL PRIVILEGES ON sadatupgrade.* TO 'sadatupgrade'@'localhost'; FLUSH PRIVILEGES;"
```
Then fill all secrets in `/var/www/sadat-upgrade/shared/.env` and (backends only) `backend/.env`.

## 3) First deployment

Push to the repository's **`main`** branch. GitHub Actions:
- CI: `npm ci` → `npm run lint` → `npm run build` (fail fast).
- CD (push to `main` only): uploads the source, runs `deploy/bin/deploy.sh` on the VPS
  (npm ci + build inside a new release dir, symlink swap, `systemctl restart`, health check),
  then hits `https://SadaatUpgrade.com/`.
- On failure: automatically runs `deploy/bin/rollback.sh` (previous release restored).

Manual first deploy (alternative to CI), as `deploy`:
```bash
ssh deploy@145.79.8.231
cd /var/www/sadat-upgrade/releases
mkdir -p 1
tar -xzf sadat-src-1.tar.gz -C 1        # from the CI upload, or tar of a checkout
cd 1 && ln -sfn ../shared/.env .env.local && npm ci && npm run build
ln -sfn /var/www/sadat-upgrade/releases/1 /var/www/sadat-upgrade/current
sudo systemctl restart sadatupgrade-frontend.service
```

## 4) Rollback

```bash
ssh deploy@145.79.8.231
/var/www/sadat-upgrade/deploy/bin/rollback.sh https://SadaatUpgrade.com/
```
Switches `current` to the previously-live release and restarts the service. The previous
release is never destroyed.

## 5) SSL renewal

- Certificate auto-renews via the standard systemd timer (`certbot.timer`).
- Verify safely any time: `sudo certbot renew --dry-run`.
- Both vhosts are unchanged on renewal (files are read from the live/ dir).

## 6) Health checks / logs

```bash
systemctl status sadatupgrade-frontend.service   # as root/scoped sudo
journalctl -u sadatupgrade-frontend.service -n 100
curl -sI https://SadaatUpgrade.com/              # expect HTTP/1.1 200
tail -f /var/log/apache2/sadaatupgrade_error.log
```

## 7) Security notes already applied

- Apache binds only; the app binds `127.0.0.1:3180` (frontend) / `127.0.0.1:8009` (backend) — not exposed publicly.
- `deploy` has no general sudo; only app-restart commands.
- `.env`/secrets never committed; `shared/.env` is 0600 deploy-owned; environments are `production`, debug off, source maps server-side only.
- HSTS + baseline security headers on the HTTPS vhost.
- The existing `sadatupgrade.com.conf` vhost (a different, unrelated domain/IP proxy) was **not** touched.