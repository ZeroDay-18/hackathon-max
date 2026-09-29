# Локальный запуск
== Необходимо выполнить все действия по порядку ==

### PosgreSQL (Database, docker container)
- Старт контейнера с БД:
```bash
docker compose -f docker-compose.dev.yml up -d
```
- Проверить статус контейнера:
```bash
docker compose -f docker-compose.dev.yml ps
```

### ExpressJS (Backend)
```bash
cd ./backend; npm run dev; cd ../
```

### Вход без MAX для локальной разработки

1. Сначала зарегистрируйте тестового пользователя обычным способом, чтобы у него были группа и принятые условия.
2. В `backend/.env` добавьте его ID из таблицы `users`:

```env
DEV_USER_ID=1
```

`npm run dev` устанавливает `NODE_ENV=development`. Только в этом режиме API использует `DEV_USER_ID`, если запрос пришёл без Bearer-токена и без проверяемых MAX init data. В production переменная игнорируется.

### GigaChat для черновиков заданий

Добавьте в `backend/.env` выданный GigaChat Authorization Key:

```env
GIGACHAT_AUTHORIZATION_KEY=base64-client-id-and-client-secret
GIGACHAT_SCOPE=GIGACHAT_API_PERS
GIGACHAT_MODEL=GigaChat-2-Max
```

Ключ остаётся только на бэкенде: не добавляйте его в `VITE_*`-переменные и не коммитьте `.env`.

### VueJS (Frontend)
```bash
cd ./frontend; npm run dev; cd ../
```