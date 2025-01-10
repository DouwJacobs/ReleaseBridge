# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --network-timeout 1000000

# Copy application files
COPY . .

# Expose the app port
EXPOSE 3000

# Run the app
CMD ["yarn", "start"]
