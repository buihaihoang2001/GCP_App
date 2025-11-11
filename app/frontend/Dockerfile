# --- Build stage ---
FROM node:18 AS build

WORKDIR /app

# Copy package.json và lockfile để cache install
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code
COPY . .

# Build React app
RUN npm run build

# --- Serve stage ---
FROM nginx:alpine

# Copy file build vào nginx serve directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy cấu hình Nginx tuỳ chỉnh
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]