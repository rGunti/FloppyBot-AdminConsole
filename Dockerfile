# === Base Images =========================================
# --- Node.js Build Base Image ----------------------------
FROM node:20-slim AS build-base
RUN npm install -g pnpm
#RUN apt-get update && apt-get install -y chromium
#ENV CHROME_BIN /usr/bin/chromium

# --- Nginx Base Image ------------------------------------
FROM nginx:1-alpine AS nginx-base
COPY ["nginx.conf", "/etc/nginx/conf.d/default.conf"]
RUN apk add gettext
COPY ["nginx.startup.sh", "/startup.sh"]

# === Build Application ===================================
FROM build-base AS build
USER node
WORKDIR /app

COPY --chown=node:node pnpm-lock.yaml ./
RUN pnpm fetch

COPY --chown=node:node . .
RUN pnpm install --offline
RUN npm run build
#RUN npm run test:ci

# === Publish Application =================================
FROM nginx-base AS publish
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist/floppybot-admin-console/browser/ .
#COPY ./dist/floppybot-admin-console/browser/ .
CMD ["sh", "/startup.sh"]
EXPOSE 80
