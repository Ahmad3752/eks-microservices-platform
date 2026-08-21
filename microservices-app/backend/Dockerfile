# ── Stage: production ──────────────────────────────────────────────────────────
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency manifests first (layer cache optimization)
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application source
COPY src/ ./src/

# Expose API port
EXPOSE 4000

# Environment default (can be overridden at runtime)
ENV PORT=4000

# Start the server
CMD ["node", "src/index.js"]
