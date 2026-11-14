
FROM oven/bun:1

WORKDIR /app

# Copy dependency files first for better layer caching
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy application source
COPY . .

# Expose application port
EXPOSE 10000

# Start the application
CMD ["bun", "run", "src/index.ts"]
