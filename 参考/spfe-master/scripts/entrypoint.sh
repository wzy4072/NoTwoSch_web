#!/bin/sh
echo "Starting using Backend Endpoint: $APP_ENDPOINT $PASSPORT_ENDPOINT"
sed -i "s|__APP_ENDPOINT__|$APP_ENDPOINT|g" /usr/share/nginx/html/static/config/config.js
sed -i "s|__PASSPORT_ENDPOINT__|$PASSPORT_ENDPOINT|g" /usr/share/nginx/html/static/config/config.js
sed -i "s|__PASSPORT_URL__|$PASSPORT_URL|g" /usr/share/nginx/html/static/config/config.js
exec "$@"
