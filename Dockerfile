FROM node:18-alpine

WORKDIR /app

# Устанавливаем только необходимые пакеты
RUN apk add --no-cache curl

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install --omit=dev

# Копируем исходный код
COPY . .

# Открываем порт
EXPOSE 3000

# Простая команда запуска без healthcheck
CMD ["npm", "start"]
