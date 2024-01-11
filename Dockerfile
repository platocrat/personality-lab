# Dockerfile
# SHA256 hash for `linux/arm64`
FROM node:current-alpine@sha256:9b54d010b382f0ef176dc93cd829bd4f2a905092b260746b3999aa824c9b7121
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