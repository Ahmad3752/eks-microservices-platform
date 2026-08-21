# ── Stage 1: Build ─────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency manifests first (layer cache optimization)
COPY package.json package-lock.json ./

# Install all dependencies (dev deps needed for Vite build)
RUN npm ci

# Copy source files
COPY index.html ./
COPY vite.config.js ./
COPY src/ ./src/

# Build production bundle
# VITE_API_URL can be overridden at build time via --build-arg
ARG VITE_API_URL=http://localhost:4000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Stage 2: Serve ─────────────────────────────────────────────────────────────
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Add custom nginx config that listens on port 3000
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
