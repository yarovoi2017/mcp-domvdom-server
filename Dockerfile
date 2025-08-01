FROM node:18-alpine

WORKDIR /app

# Оптимизация для ограниченных ресурсов
ENV NODE_OPTIONS="--max-old-space-size=512"

RUN apk add --no-cache curl

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=60s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]
