# ==========================================
# Hospital OS Multi-Stage Production Dockerfile
# Optimized for Ultra-Low Latency & High Concurrency
# ==========================================

# Stage 1: Build the optimized static bundle
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source code and configs
COPY . .

# Run production TypeScript verification & Vite build
RUN npm run build

# Stage 2: Production Lightweight NGINX Runtime
FROM nginx:1.25-alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built production assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy high-concurrency optimized nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose standard web traffic ports
EXPOSE 80 443

# Healthcheck to ensure container is responsive
HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start NGINX in foreground
CMD ["nginx", "-g", "daemon off;"]

