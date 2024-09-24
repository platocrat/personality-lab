# Use an official Node.js image as a parent image
FROM --platform=linux/amd64 node:lts-bookworm-slim

# Set the working directory
WORKDIR /personality-lab-app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies, this step will be cached unless package*.json changes
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Build the Next.js application for production
RUN npx turbo build

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npx", "turbo", "start"]