# Use a Node.js base image
FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY src/ ./src

# Expose the app port
EXPOSE 3000

# Run the app
CMD ["node", "src/app.js"]
