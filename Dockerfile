FROM node:22-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install frontend deps and build
WORKDIR /app/frontend
RUN npm install --include=dev
RUN npm run build

# Copy frontend dist into backend
RUN cp -r dist /app/backend/public/frontend

# Install backend deps
WORKDIR /app/backend
RUN npm install

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
