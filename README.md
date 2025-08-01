# MCP Domvdom Server

Model Context Protocol (MCP) сервер для интеграции с Smithery.io и управления сервисами domvdom.com

## 🚀 Возможности

- **Управление Docker контейнерами** - мониторинг и управление всеми сервисами
- **Интеграция с PostgreSQL** - доступ к базам данных
- **Мониторинг сервисов** - статус Traefik, Authentik, N8N, Portainer
- **API Gateway** - унифицированный доступ через api.domvdom.com/mcp/
- **SSL/TLS** - полная поддержка HTTPS

## 📋 Сервисы

- **Traefik** - обратный прокси с автоматическими SSL сертификатами
- **Authentik** - SSO система
- **PostgreSQL** - основная база данных
- **Redis** - кэширование
- **N8N** - автоматизация рабочих процессов
- **Portainer** - управление Docker
- **Mailhog** - тестирование email
- **Grafana** - мониторинг
- **Prometheus** - метрики
- **Loki** - логи

## 🔧 Установка

```bash
# Клонирование репозитория
git clone https://github.com/your-username/mcp-domvdom-server.git
cd mcp-domvdom-server

# Установка зависимостей
npm install

# Запуск
npm start
```

## 🐳 Docker

```bash
# Сборка образа
docker build -t mcp-domvdom-server .

# Запуск контейнера
docker run -d \
  --name mcp-server \
  --network traefik-network \
  -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  mcp-domvdom-server
```

## 🔌 API Endpoints

### Основные
- `GET /` - информация о сервере
- `GET /health` - проверка здоровья
- `GET /v1/status` - статус всех сервисов (требует API ключ)
- `GET /v1/services` - список сервисов (требует API ключ)

### MCP Protocol
- `GET /mcp/manifest` - MCP манифест
- `POST /mcp/tools/list` - список инструментов
- `POST /mcp/tools/call` - вызов инструментов

## 🔐 Безопасность

- **API Key** - обязательная авторизация для API endpoints
- **HTTPS** - все соединения через SSL/TLS
- **CORS** - настройки для безопасных доменов
- **Rate Limiting** - ограничение запросов

## 🌐 Доступ

- **Основной домен**: https://mcp.domvdom.com
- **API Gateway**: https://api.domvdom.com/mcp/
- **Локальная разработка**: http://127.0.0.1:3001

## 📊 Мониторинг

Сервер предоставляет информацию о:
- Статусе всех Docker контейнеров
- Использовании памяти и CPU
- Сетевых подключениях
- Логах сервисов

## 🔗 Интеграция с Smithery.io

Для подключения к Smithery.io используйте:
- **GitHub репозиторий**: https://github.com/your-username/mcp-domvdom-server
- **MCP Endpoint**: https://api.domvdom.com/mcp/
- **API Key**: (указан в переменных окружения)

## 📝 Переменные окружения

```env
MCP_API_KEY=your_api_key
NODE_ENV=production
MCP_SERVER_PORT=3000
MCP_SERVER_HOST=0.0.0.0
```

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch
3. Commit изменения
4. Push в branch
5. Создайте Pull Request

## 📄 Лицензия

MIT License 