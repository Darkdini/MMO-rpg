# СРЕДНЕВЕКОВЬЕ — Война Королей

## Запуск через Termux
  pkg install nodejs unzip -y && termux-setup-storage
  cp ~/storage/downloads/srednevekove.zip ~/
  unzip -o srednevekove.zip
  cd server && bash start.sh

## Прямой запуск
  cd server && node server.js

## Адреса
  Этот телефон: http://localhost:7777
  Другие в Wi-Fi: смотри в консоли при старте
  Внешний IP: 128.71.88.77:7777 (нужен проброс порта)

## Сброс прогресса
  rm ~/server/state.json
