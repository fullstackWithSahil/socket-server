
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application
COPY . .

# Expose Socket.IO port
EXPOSE 1000

# Start server
CMD ["node", "index.js"]
