# СРЕДНЕВЕКОВЬЕ — Война Королей

---

## Установка Termux (один раз)

1. Установи **Termux** из [F-Droid](https://f-droid.org) (не из Play Store — там старая версия)
2. Открой Termux и выполни:

```bash
pkg update -y && pkg install nodejs curl unzip -y && termux-setup-storage
```

3. Появится запрос разрешения на доступ к файлам — нажми **Разрешить**

---

## Скачать / обновить проект

Выполни в Termux одной командой:

```bash
cd ~/storage/downloads && rm -rf proekt MMO-rpg-main MMO-rpg-main.zip && curl -L https://github.com/darkdini/mmo-rpg/archive/refs/heads/main.zip -o MMO-rpg-main.zip && unzip MMO-rpg-main.zip && mv MMO-rpg-main proekt && rm MMO-rpg-main.zip && echo "✓ Готово!"
```

---

## Запустить сервер

```bash
cd ~/storage/downloads/proekt/server && bash start.sh
```

После запуска в консоли появятся адреса для подключения.

- **На этом телефоне:** `http://localhost:7777`
- **Другие устройства (Wi-Fi):** адрес появится в консоли автоматически
- Останови сервер: **Ctrl+C**

---

## Настройка администратора

1. Открой файл `~/storage/downloads/proekt/server/admins.txt`
2. Добавь свой ник (один на строку), сохрани
3. Перезапусти сервер
4. Войди в игру → открой профиль 👑 → увидишь панель администратора

---

## Откат на предыдущую версию

Если обновление сломало что-то — скачай конкретную версию по её коду (SHA):

```bash
# Замени SHA на нужный из таблицы ниже
SHA=20ac8133f8e865a27314ec7609ed8cefef2e1109
cd ~/storage/downloads && rm -rf proekt MMO-rpg-main MMO-rpg-${SHA}.zip && curl -L https://github.com/darkdini/mmo-rpg/archive/${SHA}.zip -o MMO-rpg-${SHA}.zip && unzip MMO-rpg-${SHA}.zip && mv MMO-rpg-${SHA:0:7}* proekt && rm MMO-rpg-${SHA}.zip && echo "✓ Откат выполнен!"
```

### Таблица версий

| Версия | SHA | Что изменилось |
|--------|-----|----------------|
| **v1** | `20ac813` | Первая стабильная версия: технологии, система администратора, картинки в файлах |

> Когда выходит новая стабильная версия — SHA добавляется сюда.

---

## Сброс прогресса игры

```bash
rm ~/storage/downloads/proekt/server/state.json
```

---

## Структура проекта

```
server/
  server.js      — HTTP + WebSocket сервер
  game.js        — игровая логика (расы, здания, юниты, бой)
  ws.js          — WebSocket протокол
  start.sh       — скрипт запуска
  admins.txt     — список администраторов
  public/
    index.html   — клиент игры (браузер)
    build/       — картинки зданий
    units/       — картинки юнитов
    smallunits/  — миниатюры юнитов
    res/         — иконки ресурсов
    ground/      — текстуры карты
    border/      — элементы рамок UI
```
