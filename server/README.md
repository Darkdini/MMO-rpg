# СРЕДНЕВЕКОВЬЕ — Война Королей

## Скачать и запустить через Termux (одна команда)

Первый раз или обновление — скачать проект в папку `proekt`:
```bash
cd ~/storage/downloads && rm -rf proekt mmo-rpg-main proekt.zip && curl -L https://github.com/darkdini/mmo-rpg/archive/refs/heads/main.zip -o proekt.zip && unzip proekt.zip && mv mmo-rpg-main proekt && rm proekt.zip && echo "✓ Готово!"
```

Запустить сервер:
```bash
cd ~/storage/downloads/proekt/server && bash start.sh
```

## Первая установка (если ещё не настроен Termux)
```bash
pkg install nodejs curl unzip -y && termux-setup-storage
```

## Адреса
- Этот телефон: `http://localhost:7777`
- Другие устройства в Wi-Fi: смотри в консоли при старте
- Внешний IP: нужен проброс порта 7777

## Структура проекта
```
server/
  server.js      — HTTP + WebSocket сервер
  game.js        — игровая логика
  ws.js          — WebSocket протокол
  start.sh       — скрипт запуска
  admins.txt     — список администраторов (один ник на строку)
  public/
    index.html   — клиент игры
    build/       — картинки зданий
    units/       — картинки юнитов
    smallunits/  — миниатюры юнитов
    res/          — иконки ресурсов
    ground/      — текстуры карты
```

## Администратор
Открой `server/admins.txt`, добавь свой ник (один на строку), перезапусти сервер.
Панель администратора появится в профиле игрока (👑).

## Сброс прогресса
```bash
rm ~/storage/downloads/proekt/server/state.json
```
