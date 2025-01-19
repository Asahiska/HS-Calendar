# Use the official Node.js image as the base image
# Nutze ein leichtgewichtiges Basis-Image
FROM node:18-alpine
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .
# Expose the port the app runs on
EXPOSE 8080

# Define the command to run the app
CMD ["node", "server.js"]


