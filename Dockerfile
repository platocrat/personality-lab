# Dockerfile
FROM --platform=linux/amd64 node:current-alpine
# Set the working directory
WORKDIR /personality-lab-app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy the entire project to the working directory
COPY . .

# Build the Next.js application for production
RUN npm run build

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]