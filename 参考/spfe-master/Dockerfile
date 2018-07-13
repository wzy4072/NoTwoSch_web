FROM nginx:alpine
EXPOSE 80

COPY dist /usr/share/nginx/html
COPY /scripts/entrypoint.sh /
RUN chmod a+x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]