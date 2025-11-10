# Multi-stage Docker setup for Session Multi-App

# Backend - .NET API
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS backend-runtime
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS backend-build
WORKDIR /src
COPY backend-dotnet/*.csproj ./
RUN dotnet restore
COPY backend-dotnet/ ./
RUN dotnet publish -c Release -o /app

# Frontend builds
FROM node:20-alpine AS frontend-build
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@9

# Next.js build
COPY frontend-nextjs/package.json frontend-nextjs/pnpm-lock.yaml ./nextjs/
WORKDIR /app/nextjs
RUN pnpm install
COPY frontend-nextjs/ ./
RUN pnpm build

# Angular User App build
WORKDIR /app/angular1
COPY frontend-angular1/package.json frontend-angular1/pnpm-lock.yaml ./
RUN pnpm install
COPY frontend-angular1/ ./
RUN pnpm ng build

# Angular Admin App build
WORKDIR /app/angular2
COPY frontend-angular2/package.json frontend-angular2/pnpm-lock.yaml ./
RUN pnpm install
COPY frontend-angular2/ ./
RUN pnpm ng build

# Final runtime stage
FROM nginx:alpine AS frontend-runtime

# Copy built frontends to nginx
COPY --from=frontend-build /app/nextjs/out /usr/share/nginx/html/
COPY --from=frontend-build /app/angular1/dist /usr/share/nginx/html/user
COPY --from=frontend-build /app/angular2/dist /usr/share/nginx/html/admin

# Backend runtime
FROM backend-runtime AS api-runtime
WORKDIR /app
COPY --from=backend-build /app .
EXPOSE 5000
ENTRYPOINT ["dotnet", "Backend.dll", "--urls", "http://*:5000"]

# Production reverse proxy configuration would be added here
# This Dockerfile demonstrates the build process for each component