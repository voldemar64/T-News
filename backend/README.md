# T-News Backend

Backend приложение на NestJS с Prisma ORM и PostgreSQL.

## Установка

1. Установите зависимости:

```bash
npm install
```

2. Настройте базу данных:

```bash
npx prisma migrate dev
```

3. Сгенерируйте Prisma Client:

```bash
npx prisma generate
```

## Запуск

```bash
# Разработка
npm run start:dev

# Продакшн
npm run build
npm run start:prod
```

## API

API доступно по адресу: `http://localhost:3000/api`

Все эндпоинты описаны в `openapi.yaml` в корне проекта.

## Структура проекта

- `src/prisma/` - Prisma Service и Module
- `src/auth/` - Аутентификация (JWT)
- `src/users/` - Модуль пользователей
- `src/posts/` - Модуль постов
- `src/comments/` - Модуль комментариев
- `src/likes/` - Модуль лайков
- `src/follows/` - Модуль подписок
- `src/feed/` - Модуль ленты
- `src/search/` - Модуль поиска
- `src/common/` - Общие модули (filters, guards, interfaces)

## Docker

### Запуск с Docker Compose

1. Создайте файл `.env` в корне проекта на основе `.env.example`:

```env
POSTGRES_USER=tnews_user
POSTGRES_PASSWORD=tnews_password
POSTGRES_DB=tnews
POSTGRES_PORT=5432

BACKEND_PORT=3000
JWT_SECRET=super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:5173

DATABASE_URL=postgresql://tnews_user:tnews_password@localhost:5432/tnews?schema=public
```

2. Запустите все сервисы:

```bash
docker-compose up -d
```

3. Выполните миграции (если нужно):

```bash
docker-compose exec backend npx prisma migrate deploy
```

4. Остановка сервисов:

```bash
docker-compose down
```

5. Остановка с удалением данных БД:

```bash
docker-compose down -v
```

## Архитектура

Трехслойная архитектура:

- **Controller** - обработка HTTP запросов
- **Service** - бизнес-логика
- **Repository** - работа с БД через Prisma
