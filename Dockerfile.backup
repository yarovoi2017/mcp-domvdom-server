FROM node:18-alpine

WORKDIR /app

COPY package-smithery.json ./package.json
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server-smithery.js"]
