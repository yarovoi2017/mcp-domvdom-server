# 🔗 Информация для Smithery.io

## GitHub репозиторий
- **URL**: https://github.com/yarovoi2017/mcp-domvdom-server
- **Ветка**: main
- **Статус**: ✅ Активен

## MCP Server
- **Endpoint**: https://api.domvdom.com/mcp/
- **API Key**: 3c3934d6877a96aadb6d0bd20c7ac0804a6ffcfd17f3a08ee72dde2a1a4b7256
- **Статус**: ✅ Работает

## Smithery.io токен
- **Token**: 4af4aa06-acfe-4137-872b-18446e35ff93
- **Статус**: ✅ Готов к использованию

## Настройка в Smithery.io

1. Перейдите на https://smithery.io
2. Добавьте новый MCP сервер:
   - **Название**: Domvdom MCP Server
   - **GitHub репозиторий**: yarovoi2017/mcp-domvdom-server
   - **MCP Endpoint**: https://api.domvdom.com/mcp/
   - **API Key**: 3c3934d6877a96aadb6d0bd20c7ac0804a6ffcfd17f3a08ee72dde2a1a4b7256
   - **Smithery Token**: 4af4aa06-acfe-4137-872b-18446e35ff93

## Доступные URL
- **MCP Server**: https://mcp.domvdom.com
- **API Gateway**: https://api.domvdom.com/mcp/
- **GitHub**: https://github.com/yarovoi2017/mcp-domvdom-server

## Проверка подключения
```bash
# Проверка MCP сервера
curl -H "X-API-Key: 3c3934d6877a96aadb6d0bd20c7ac0804a6ffcfd17f3a08ee72dde2a1a4b7256" https://api.domvdom.com/mcp/v1/status

# Проверка GitHub репозитория
curl https://api.github.com/repos/yarovoi2017/mcp-domvdom-server
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
