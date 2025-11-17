# Chess Game Statistics Backend API

Backend API для приложения статистики шахматных игр, построенный на Node.js с Express и SQLite.

## Технологии

- **Node.js** v24
- **TypeScript** - для типобезопасности
- **Express** - веб-фреймворк
- **SQLite** (better-sqlite3) - база данных
- **CORS** - для кросс-доменных запросов
- **dotenv** - управление переменными окружения

## Установка

1. Убедитесь, что используете Node.js версии 24 через NVM:
```bash
nvm use 24
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` (можно использовать скрипт `npm run create-env`):
```bash
PORT=3001
NODE_ENV=development
DATABASE_PATH=./chess_statistics.db
AUTH_USERNAME=admin
AUTH_PASSWORD=changeme
```

**Важно:** Измените `AUTH_USERNAME` и `AUTH_PASSWORD` на безопасные значения в продакшн окружении!

4. Заполните базу данных начальными данными:
```bash
npm run seed
```

## Запуск

### Режим разработки
```bash
npm run dev
```

### Продакшн режим
```bash
npm run build
npm start
```

Сервер будет доступен по адресу `http://localhost:3001`

### Swagger / API Docs
- UI: `http://localhost:3001/api/docs`
- JSON: `http://localhost:3001/api/docs.json`

## Аутентификация

API использует **Basic Authentication** для защиты эндпоинтов, которые изменяют данные (POST, PUT, DELETE).

### Защищенные эндпоинты:
- `POST /api/players` - требует аутентификации
- `PUT /api/players/:id` - требует аутентификации
- `DELETE /api/players/:id` - требует аутентификации
- `POST /api/games` - требует аутентификации
- `PUT /api/games/:id` - требует аутентификации
- `DELETE /api/games/:id` - требует аутентификации

### Публичные эндпоинты (без аутентификации):
- Все GET запросы (чтение данных)

### Использование Basic Auth:

**В curl:**
```bash
curl -X POST http://localhost:3001/api/players \
  -u "admin:changeme" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

**В JavaScript/Fetch:**
```javascript
const credentials = btoa('admin:changeme');
fetch('http://localhost:3001/api/players', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({...})
});
```

**В Swagger UI:**
Нажмите кнопку "Authorize" в правом верхнем углу и введите учетные данные из `.env` файла.

## API Endpoints

### Players (Игроки)

- `GET /api/players` - Получить всех игроков (публичный)
- `GET /api/players/:id` - Получить игрока по ID (публичный)
- `POST /api/players` - Создать нового игрока 🔒
- `PUT /api/players/:id` - Обновить игрока 🔒
- `DELETE /api/players/:id` - Удалить игрока 🔒

### Games (Игры)

- `GET /api/games` - Получить все игры (опциональный query параметр `?playerId=...`) (публичный)
- `GET /api/games/:id` - Получить игру по ID (публичный)
- `GET /api/games/player/:playerId` - Получить все игры игрока (публичный)
- `GET /api/games/player/:playerId/statistics` - Получить статистику игрока (публичный)
- `POST /api/games` - Создать новую игру 🔒
- `PUT /api/games/:id` - Обновить игру 🔒
- `DELETE /api/games/:id` - Удалить игру 🔒

### Health Check

- `GET /health` - Проверка работоспособности API

## Структура проекта

```
src/
├── controllers/     # Контроллеры для обработки запросов
├── database/        # Работа с БД (миграции, seed)
├── routes/          # Маршруты API
├── services/        # Бизнес-логика
├── types/           # TypeScript типы
└── index.ts         # Точка входа
```

## Примеры запросов

### Создать игрока (требует аутентификации)
```bash
curl -X POST http://localhost:3001/api/players \
  -u "admin:changeme" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "rating": 2000
  }'
```

### Получить статистику игрока
```bash
curl http://localhost:3001/api/games/player/1/statistics
```

### Создать игру (требует аутентификации)
```bash
curl -X POST http://localhost:3001/api/games \
  -u "admin:changeme" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "playerId": "1",
    "opponentId": "2",
    "result": "win",
    "color": "white",
    "timeControl": "blitz",
    "moves": 45,
    "rating": {
      "before": 2000,
      "after": 2015,
      "change": 15
    },
    "opening": "Sicilian Defense"
  }'
```

## База данных

База данных SQLite создается автоматически при первом запуске. Файл базы данных находится в корне проекта (`chess_statistics.db`).

### Схема базы данных

**Таблица `players`:**
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT)
- `username` (TEXT, UNIQUE)
- `rating` (INTEGER)
- `avatar` (TEXT, опционально)

**Таблица `games`:**
- `id` (TEXT, PRIMARY KEY)
- `date` (TEXT)
- `playerId` (TEXT, FOREIGN KEY)
- `opponentId` (TEXT, FOREIGN KEY)
- `result` (TEXT: 'win', 'loss', 'draw')
- `color` (TEXT: 'white', 'black')
- `timeControl` (TEXT: 'bullet', 'blitz', 'rapid', 'classical')
- `moves` (INTEGER)
- `ratingBefore` (INTEGER)
- `ratingAfter` (INTEGER)
- `ratingChange` (INTEGER)
- `opening` (TEXT, опционально)
- `notes` (TEXT, опционально)

