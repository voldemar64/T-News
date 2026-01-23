# T-News Frontend

Frontend приложение на TypeScript с использованием Vite, построенное по архитектуре MVC.

## Установка

1. Установите зависимости:

```bash
npm install
```

## Запуск

```bash
# Разработка (с hot-reload)
npm run dev

# Сборка для продакшена
npm run build
```

## Разработка

### Линтинг и форматирование

```bash
# Проверка кода линтером
npm run lint

# Автоматическое исправление ошибок линтера
npm run lint:fix

# Форматирование кода
npm run format

# Проверка форматирования
npm run format:check

# Проверка типов TypeScript
npm run typecheck
```

## Структура проекта

- `src/config/` - Конфигурация (API endpoints, константы)
- `src/types/` - TypeScript типы и интерфейсы
- `src/utils/` - Утилиты (DOM, валидация, форматирование, хранилище)
- `src/services/` - Сервисы для работы с API
- `src/views/` - Компоненты представления (View)
- `src/controllers/` - Контроллеры (Controller)
- `src/pages/` - Точки входа для страниц
- `css/` - Стили (переменные, базовые стили, блоки)
- `images/` - Статические изображения

## Архитектура

Приложение построено по паттерну MVC (Model-View-Controller):

- **Views** - Компоненты для отображения UI (безопасная работа с DOM)
- **Controllers** - Управление состоянием и обработка событий
- **Services** - Работа с API и бизнес-логика
- **Utils** - Вспомогательные функции

### Принципы

- Безопасная работа с DOM
- Разделение ответственности между слоями
- Переиспользуемые компоненты
- Типизация TypeScript

## Docker

### Запуск с Docker Compose

1. Запустите все сервисы из корня проекта:

```bash
docker-compose up -d
```

2. Фронтенд будет доступен по адресу: `http://localhost:8080`

3. Остановка сервисов:

```bash
docker-compose down
```

### Сборка Docker образа

```bash
docker build -t tnews-frontend .
```

## Конфигурация

### Переменные окружения

Для разработки настройте прокси в `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

### API конфигурация

Настройки API находятся в `src/config/api.ts`:

- `API_BASE_URL` - базовый URL API
- Endpoints для всех ресурсов

## Страницы

- `/` (index.html) - Лента новостей
- `/login.html` - Страница входа
- `/register.html` - Страница регистрации
- `/profile.html` - Профиль пользователя
- `/search.html` - Поиск пользователей и постов
