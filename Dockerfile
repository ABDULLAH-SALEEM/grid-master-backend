# Use the official Node.js image as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

RUN yarn build

# Expose the port your application will run on
EXPOSE 8080

# Start the application
CMD ["yarn", "start"]
