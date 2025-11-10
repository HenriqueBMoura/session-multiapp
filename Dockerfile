# Multi-stage Docker setup with maximum security - Alternative approach
# Uses scratch/distroless images for minimal attack surface

# Backend build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS backend-build

# Security: Update packages and create user
RUN apk update && apk upgrade --no-cache && \
    addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

USER appuser
WORKDIR /src

# Copy and restore dependencies
COPY --chown=appuser:appgroup backend-dotnet/*.csproj ./
RUN dotnet restore --no-cache --locked-mode

# Copy source and build for production
COPY --chown=appuser:appgroup backend-dotnet/ ./
RUN dotnet publish -c Release -o /app \
    --no-restore \
    --self-contained true \
    --runtime linux-musl-x64 \
    /p:PublishTrimmed=true \
    /p:PublishSingleFile=true

# Static file generation stage (no runtime needed)
FROM node:20.12.2-alpine3.20 AS static-build

# Security hardening
RUN apk update && apk upgrade --no-cache && \
    addgroup -g 1001 -S nodegroup && \
    adduser -S nodeuser -u 1001 -G nodegroup

USER nodeuser
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9.12.0 --prefix /tmp/pnpm && \
    ln -s /tmp/pnpm/bin/pnpm /usr/local/bin/pnpm

# Build Next.js as static export
COPY --chown=nodeuser:nodegroup frontend-nextjs/package.json frontend-nextjs/pnpm-lock.yaml ./nextjs/
WORKDIR /app/nextjs
RUN pnpm install --frozen-lockfile --production=false --ignore-scripts
COPY --chown=nodeuser:nodegroup frontend-nextjs/ ./
RUN pnpm build && \
    rm -rf node_modules .env* .git

# Build Angular User App
WORKDIR /app/angular1  
COPY --chown=nodeuser:nodegroup frontend-angular1/package.json frontend-angular1/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --production=false --ignore-scripts
COPY --chown=nodeuser:nodegroup frontend-angular1/ ./
RUN pnpm ng build --configuration production --output-hashing=all && \
    rm -rf node_modules .env* .git

# Build Angular Admin App
WORKDIR /app/angular2
COPY --chown=nodeuser:nodegroup frontend-angular2/package.json frontend-angular2/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --production=false --ignore-scripts
COPY --chown=nodeuser:nodegroup frontend-angular2/ ./
RUN pnpm ng build --configuration production --output-hashing=all && \
    rm -rf node_modules .env* .git

# Backend runtime - Distroless for ultimate security
FROM gcr.io/distroless/dotnet:8 AS backend-runtime

# Copy only the self-contained executable
COPY --from=backend-build /app/Backend /app/Backend
COPY --from=backend-build /app/*.dll /app/
COPY --from=backend-build /app/*.json /app/

WORKDIR /app
EXPOSE 5000

# Distroless doesn't have shell, so use exec form only
ENTRYPOINT ["/app/Backend", "--urls", "http://*:5000"]

# Static file server - Use minimal web server
FROM busybox:1.36.1 AS frontend-runtime

# Create non-root user
RUN addgroup -g 1001 appgroup && \
    adduser -D -u 1001 -G appgroup appuser

# Copy static files
COPY --from=static-build --chown=appuser:appgroup /app/nextjs/out /var/www/html/
COPY --from=static-build --chown=appuser:appgroup /app/angular1/dist/frontend-angular1 /var/www/html/user/
COPY --from=static-build --chown=appuser:appgroup /app/angular2/dist/frontend-angular2 /var/www/html/admin/

USER appuser
WORKDIR /var/www/html
EXPOSE 8080

# Simple HTTP server for static files
ENTRYPOINT ["httpd"]
CMD ["-f", "-v", "-p", "8080", "-h", "/var/www/html"]