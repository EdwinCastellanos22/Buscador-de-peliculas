# Node js
FROM node:22-alpine AS builder
WORKDIR /searchMovie
ARG VITE_TOKEN
ENV VITE_TOKEN=${VITE_TOKEN}
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#Nginx
FROM nginx:alpine
COPY --from=builder /searchMovie/dist /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;"]