# 🔗 Информация для Smithery.io

## GitHub репозиторий
- **URL**: https://github.com/yarovoi2017/mcp-domvdom-server
- **Ветка**: main
- **Статус**: ✅ Активен

## MCP Server
- **Endpoint**: https://api.domvdom.com/mcp/
- **API Key**: [СКРЫТ - указан в переменных окружения]
- **Статус**: ✅ Работает

## Smithery.io токен
- **Token**: [СКРЫТ - указан в переменных окружения]
- **Статус**: ✅ Готов к использованию

## Настройка в Smithery.io

1. Перейдите на https://smithery.io
2. Добавьте новый MCP сервер:
   - **Название**: Domvdom MCP Server
   - **GitHub репозиторий**: yarovoi2017/mcp-domvdom-server
   - **MCP Endpoint**: https://api.domvdom.com/mcp/
   - **API Key**: [получить из переменных окружения]
   - **Smithery Token**: [получить из переменных окружения]

## Доступные URL
- **MCP Server**: https://mcp.domvdom.com
- **API Gateway**: https://api.domvdom.com/mcp/
- **GitHub**: https://github.com/yarovoi2017/mcp-domvdom-server

## Проверка подключения
```bash
# Проверка MCP сервера
curl -H "X-API-Key: [API_KEY]" https://api.domvdom.com/mcp/v1/status

# Проверка GitHub репозитория
curl https://api.github.com/repos/yarovoi2017/mcp-domvdom-server
```

## Переменные окружения
Для получения токенов используйте переменные окружения:
```bash
source /root/projects/env
echo "MCP API Key: $MCP_API_KEY"
echo "Smithery Token: $SMITHERY_TOKEN"
```

## Обновления
Для обновления MCP сервера:
```bash
cd /root/projects/mcp-smithery
git add .
git commit -m "Update MCP server"
git push origin main
```

Smithery.io автоматически получит обновления из GitHub.
