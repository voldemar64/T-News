CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

CREATE UNIQUE INDEX "Like_userId_postId_key" ON "Like"("userId", "postId");

CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");

CREATE INDEX "Post_userId_idx" ON "Post"("userId");

CREATE INDEX "Like_postId_idx" ON "Like"("postId");

CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");

CREATE INDEX "Follow_followerId_idx" ON "Follow"("followerId");

CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");

ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- ТЕСТОВЫЕ ДАННЫЕ
-- ============================================
-- 
-- Тестовые данные автоматически добавляются при выполнении миграции.
-- Если нужно добавить тестовые данные вручную, выполните SQL запросы ниже.
-- 
-- Все пароли захешированы с помощью bcrypt (стоимость 10).
-- Тестовый пароль для всех пользователей: "password123"
-- 
-- Структура тестовых данных:
-- - 5 пользователей (больше 3, как требуется)
-- - У пользователя "testuser" есть 4 подписки (больше 3, как требуется)
-- - У каждого пользователя 0-3 поста (как требуется)
-- - У каждого поста 0-2 комментария (как требуется)

INSERT INTO "User" ("id", "username", "password", "avatar", "bio", "createdAt", "updatedAt") VALUES
('00000000-0000-0000-0000-000000000001', 'testuser', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'Тестовый пользователь для проверки функциональности', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', 'alice', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'Пользователь Алиса', NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', 'bob', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'Пользователь Боб', NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', 'charlie', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'Пользователь Чарли', NOW(), NOW()),
('00000000-0000-0000-0000-000000000005', 'diana', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'Пользователь Диана', NOW(), NOW());

INSERT INTO "Post" ("id", "userId", "content", "createdAt", "updatedAt") VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Первый пост от testuser. Это тестовый контент для проверки функциональности ленты новостей.', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Второй пост от testuser. Здесь можно разместить более длинный текст для проверки отображения контента.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Третий пост от testuser. Проверка функциональности создания и отображения постов.', NOW(), NOW()),

('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Привет! Это пост от Алисы. Здесь можно поделиться своими мыслями.', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'Еще один пост от Алисы. Контент для тестирования.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'Пост от Боба. Минимальный контент для проверки.', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000005', 'Первый пост от Дианы. Тестовый контент.', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000005', 'Второй пост от Дианы. Еще немного контента.', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000005', 'Третий пост от Дианы. Максимальное количество постов для тестирования.', NOW(), NOW());

INSERT INTO "Follow" ("id", "followerId", "followingId", "createdAt") VALUES
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '5 days'),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '4 days'),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '3 days'),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '2 days');

INSERT INTO "Comment" ("id", "userId", "postId", "content", "createdAt") VALUES
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Отличный пост!', NOW() - INTERVAL '2 days'),
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Согласен с автором.', NOW() - INTERVAL '1 day'),

('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'Интересная мысль.', NOW() - INTERVAL '1 day'),

('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'Привет, Алиса!', NOW() - INTERVAL '3 days'),
('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', 'Хороший пост.', NOW() - INTERVAL '2 days'),

('30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006', 'Комментарий к посту Боба.', NOW() - INTERVAL '2 days'),

('30000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000008', 'Комментарий к посту Дианы.', NOW() - INTERVAL '2 days'),

('30000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000009', 'Отличный контент!', NOW() - INTERVAL '1 day'),
('30000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000009', 'Спасибо за пост.', NOW());

