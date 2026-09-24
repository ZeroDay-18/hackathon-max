#!/usr/bin/env bash

set -e

cd "$(dirname "$0")"

echo "==> Проверяем репозиторий..."

if [ ! -d ".git" ]; then
    echo "Ошибка: репозиторий не инициализирован."
    exit 1
fi

git fetch origin main

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "==> Найдены обновления, загружаем..."
    git pull --ff-only origin main
else
    echo "==> Обновлений нет."
fi

echo "==> Запускаем Docker..."

docker compose up -d --build --remove-orphans

echo "==> Готово."
docker compose ps