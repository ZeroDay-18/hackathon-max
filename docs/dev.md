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

### VueJS (Frontend)
```bash
cd ./frontend; npm run dev; cd ../
```