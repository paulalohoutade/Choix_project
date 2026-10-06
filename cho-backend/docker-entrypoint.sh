#!/bin/sh
set -e

# Render injecte PORT (10000 par défaut). Apache doit écouter dessus,
# sinon le health check échoue et le service semble « down ».
PORT="${PORT:-10000}"

sed -i -E "s/^Listen .*/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i -E "s/<VirtualHost \*:[0-9]+>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

echo "==== BOOT ===="
echo "PORT=$PORT"
echo "DB_CONNECTION=${DB_CONNECTION:-unset}"
echo "DB_HOST=${DB_HOST:-unset}"
echo "DB_PORT=${DB_PORT:-unset}"
echo "DB_DATABASE=${DB_DATABASE:-unset}"
echo "APP_ENV=${APP_ENV:-unset}"
echo "APP_KEY set?=$([ -n "$APP_KEY" ] && echo yes || echo NO)"

php artisan config:clear
php artisan cache:clear
php artisan migrate --force
# Admin uniquement (firstOrCreate) — ne touche pas aux données existantes
php artisan db:seed --class=AdminUserSeeder --force

echo "==== MIGRATE+SEED OK, starting apache on :$PORT ===="
exec "$@"
