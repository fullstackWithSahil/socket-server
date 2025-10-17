# Use the official Bun image
FROM oven/bun:1 AS base

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose port 8080
EXPOSE 8080

# Run the Bun server
CMD ["bun", "run", "start"]
