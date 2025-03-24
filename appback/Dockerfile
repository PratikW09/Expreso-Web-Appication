# Step 1: Use official Node.js LTS image
FROM node:20-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install 

# Step 5: Copy application code to container
COPY . .

# Step 6: Expose the port your app runs on
EXPOSE 5050

# # Step 7: Define environment variable (optional but useful)
# ENV NODE_ENV=production

# Step 8: Run the application
CMD ["node", "index.js"]
