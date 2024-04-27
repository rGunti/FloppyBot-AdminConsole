# === Base Images =========================================
# --- Node.js Build Base Image ----------------------------
# --- Nginx Base Image ------------------------------------
FROM nginx:1-alpine AS nginx-base
COPY ["nginx.conf", "/etc/nginx/conf.d/default.conf"]
RUN apk add gettext
COPY ["nginx.startup.sh", "/startup.sh"]

# === Publish Application =================================
FROM nginx-base AS publish
WORKDIR /usr/share/nginx/html
COPY ./dist/floppybot-admin-console/browser/ .
CMD ["sh", "/startup.sh"]
EXPOSE 80
