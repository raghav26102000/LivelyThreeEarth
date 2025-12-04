# Dockerfile — Build with Node (Vite) and serve static output with nginx
#
# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
# Using glob patterns for package files
COPY package.json package-lock.json* yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci; elif [ -f yarn.lock ]; then yarn --frozen-lockfile; else npm install; fi

# Copy source and build
COPY . .
ENV NODE_ENV=production
RUN npm run build


# ----------------------------------------------------------------------
# Stage 2: serve with nginx (static files) - This is the final image
# ----------------------------------------------------------------------
FROM nginx:stable-alpine AS production

# Improvement 1: Ensure Nginx listens on Port 80
# The standard HTTP port is 80. This is usually more consistent with deployment 
# and makes the external port mapping easier (e.g., -p 8080:80).
EXPOSE 8000

# Clear default html dir
RUN rm -rf /usr/share/nginx/html/*

# Improvement 2: Consolidate Copy Operations
# This copies the necessary Nginx config and the compiled assets.
# The source path for static assets is confirmed: /app/dist/public
COPY --from=builder /app/dist/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]