# Dockerfile
# SHA256 hash for `linux/arm64/v6`
FROM node:current-alpine@sha256:d31cc09e76f49451e35d89343567145a0eadd1812d57c78f2e0da385a67a078b
# Set the working directory
WORKDIR /personality-lab-app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy the entire project to the working directory
COPY . .

# Build the Next.js application for production
RUN npx turbo build
# Set the environment variable to run the Next.js application in production mode
ENV NODE_ENV production
ENV PORT 3000

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
CMD ["npx", "turbo", "run", "start"]