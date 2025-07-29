FROM node:18-alpine

LABEL maintainer="your-email@example.com"
LABEL description="Production-ready Discord hosting bot with PteroStats integration"

# Install dependencies for better security and performance
RUN apk add --no-cache     ca-certificates     tzdata     && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S discord -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p data/logs data/backups logs
RUN chown -R discord:nodejs /app

# Switch to non-root user
USER discord

# Expose port for health checks
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3     CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["npm", "start"]
