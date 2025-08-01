# 🔗 Настройка подключения к Smithery.io

## 📋 Пошаговая инструкция

### 1. Создание GitHub репозитория

1. **Перейдите на GitHub**: https://github.com
2. **Создайте новый репозиторий**:
   - Название: `mcp-domvdom-server`
   - Описание: `MCP Server for domvdom.com services management`
   - Публичный или приватный (на ваш выбор)
   - НЕ инициализируйте с README (у нас уже есть)

### 2. Подключение локального репозитория к GitHub

```bash
# В директории /root/projects/mcp-smithery
git remote add origin https://github.com/YOUR_USERNAME/mcp-domvdom-server.git
git push -u origin main
```

### 3. Настройка Smithery.io

1. **Перейдите на Smithery.io**: https://smithery.io
2. **Войдите в аккаунт** или создайте новый
3. **Добавьте новый MCP сервер**:
   - Название: `Domvdom MCP Server`
   - GitHub репозиторий: `YOUR_USERNAME/mcp-domvdom-server`
   - MCP Endpoint: `https://api.domvdom.com/mcp/`
   - API Key: `3c3934d6877a96aadb6d0bd20c7ac0804a6ffcfd17f3a08ee72dde2a1a4b7256`

### 4. Проверка подключения

После настройки Smithery.io должен:
- ✅ Подключиться к вашему GitHub репозиторию
- ✅ Получить доступ к MCP серверу
- ✅ Отобразить доступные инструменты

## 🔧 Доступные инструменты MCP

### Docker Management
- `list_containers` - список всех контейнеров
- `container_status` - статус конкретного контейнера
- `start_container` - запуск контейнера
- `stop_container` - остановка контейнера
- `restart_container` - перезапуск контейнера

### Service Monitoring
- `service_status` - статус всех сервисов
- `service_logs` - логи сервиса
- `service_metrics` - метрики сервиса

### Database Access
- `postgres_query` - выполнение SQL запросов
- `postgres_backup` - создание бэкапа
- `postgres_restore` - восстановление из бэкапа

### System Management
- `system_info` - информация о системе
- `network_status` - статус сетей
- `volume_info` - информация о volumes

## 🌐 Доступные URL

- **MCP Server**: https://mcp.domvdom.com
- **API Gateway**: https://api.domvdom.com/mcp/
- **GitHub**: https://github.com/YOUR_USERNAME/mcp-domvdom-server

## 🔐 Безопасность

- **API Key**: Обязателен для всех API запросов
- **HTTPS**: Все соединения защищены SSL/TLS
- **CORS**: Настроен для безопасных доменов
- **Rate Limiting**: Ограничение запросов

## 📊 Мониторинг

Smithery.io сможет:
- Отслеживать статус всех сервисов
- Показывать метрики производительности
- Отображать логи в реальном времени
- Управлять контейнерами через веб-интерфейс

## 🚀 Использование

После подключения вы сможете:
1. **Управлять сервисами** через Smithery.io интерфейс
2. **Мониторить производительность** всех контейнеров
3. **Просматривать логи** в удобном формате
4. **Выполнять команды** через AI ассистента
5. **Автоматизировать задачи** с помощью MCP инструментов

## 🔄 Обновления

Для обновления MCP сервера:
```bash
# В директории /root/projects/mcp-smithery
git add .
git commit -m "Update MCP server"
git push origin main
```

Smithery.io автоматически получит обновления из GitHub.

## 📞 Поддержка

При проблемах с подключением:
1. Проверьте доступность MCP сервера
2. Убедитесь в правильности API ключа
3. Проверьте GitHub репозиторий
4. Обратитесь в поддержку Smithery.io 