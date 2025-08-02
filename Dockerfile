FROM node:18-alpine

WORKDIR /app

COPY package-smithery.json ./package.json
RUN npm install

COPY server-simple.js ./

EXPOSE 3000

CMD ["node", "server-simple.js"]
