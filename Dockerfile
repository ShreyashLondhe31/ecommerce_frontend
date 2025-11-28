FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5174
# Important: bind to 0.0.0.0 so Docker can expose it
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5174"]