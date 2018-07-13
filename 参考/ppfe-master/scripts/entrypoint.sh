#!/bin/sh
echo "Starting using Backend Endpoint: $BACKEND_ENDPOINT"
sed -i "s|__BACKEND_ENDPOINT__|$BACKEND_ENDPOINT|g" /usr/share/nginx/html/static/config/config.js
sed -i "s|__BAIDU_ANALYTICS__|$BAIDU_ANALYTICS|g" /usr/share/nginx/html/static/config/config.js
sed -i "s|__OFFICIAL_WEBSITE__|$OFFICIAL_WEBSITE|g" /usr/share/nginx/html/static/config/config.js
sed -i "s|__EXPERIMENTAL__|$EXPERIMENTAL|g" /usr/share/nginx/html/static/config/config.js
exec "$@"