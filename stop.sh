#!/usr/bin/env bash

echo "==> Останавливаем Docker..."

docker compose down 

echo "==> Готово."
docker compose ps