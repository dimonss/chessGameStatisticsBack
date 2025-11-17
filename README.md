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

3. Создайте файл `.env` (опционально, есть значения по умолчанию):
```bash
PORT=3001
NODE_ENV=development
DATABASE_PATH=./chess_statistics.db
```

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

## API Endpoints

### Players (Игроки)

- `GET /api/players` - Получить всех игроков
- `GET /api/players/:id` - Получить игрока по ID
- `POST /api/players` - Создать нового игрока
- `PUT /api/players/:id` - Обновить игрока
- `DELETE /api/players/:id` - Удалить игрока

### Games (Игры)

- `GET /api/games` - Получить все игры (опциональный query параметр `?playerId=...`)
- `GET /api/games/:id` - Получить игру по ID
- `GET /api/games/player/:playerId` - Получить все игры игрока
- `GET /api/games/player/:playerId/statistics` - Получить статистику игрока
- `POST /api/games` - Создать новую игру
- `PUT /api/games/:id` - Обновить игру
- `DELETE /api/games/:id` - Удалить игру

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

### Создать игрока
```bash
curl -X POST http://localhost:3001/api/players \
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

### Создать игру
```bash
curl -X POST http://localhost:3001/api/games \
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

