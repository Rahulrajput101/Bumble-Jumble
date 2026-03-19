FROM node:22-alpine

WORKDIR /app

# Copy all project files
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY package.json ./

# Install frontend deps (including dev for vite) and build
WORKDIR /app/frontend
RUN npm install --include=dev
RUN npm run build

# Copy built frontend into backend/public/frontend
RUN mkdir -p /app/backend/public/frontend
RUN cp -r /app/frontend/dist/* /app/backend/public/frontend/

# Install backend deps
WORKDIR /app/backend
RUN npm install --production

# Verify files exist
RUN echo "=== Checking files ===" && \
    ls -la /app/backend/public/frontend/ && \
    wc -c /app/backend/server.js && \
    grep -c "requireAuth" /app/backend/routes/admin.js && \
    ls /app/backend/views/admin-login.ejs && \
    echo "=== All checks passed ==="

EXPOSE 5000

CMD ["node", "server.js"]
