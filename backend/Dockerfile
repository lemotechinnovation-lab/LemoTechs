# Multi-stage build for production
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (dev + prod) for building
# Use install instead of ci to avoid strict lockfile enforcement on CI
ENV NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_FUND=false
RUN npm install --no-audit --no-fund --legacy-peer-deps

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies to slim the final image
RUN npm prune --omit=dev

# Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S lemotech -u 1001

# Copy built application
COPY --from=builder --chown=lemotech:nodejs /app/dist ./dist
COPY --from=builder --chown=lemotech:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=lemotech:nodejs /app/package*.json ./

# Set env to production
ENV NODE_ENV=production

# Create uploads directory
RUN mkdir -p uploads && chown -R lemotech:nodejs uploads

# Switch to non-root user
USER lemotech

# Expose port
EXPOSE 3001

# Health check (respect dynamic PORT provided by platform)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=5 \
  CMD node -e "const http=require('http');const port=process.env.PORT||3001;http.get(`http://localhost:${port}/health`,res=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1));"

# Start application
CMD ["node", "dist/app.js"]
