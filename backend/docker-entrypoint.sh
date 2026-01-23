#!/bin/sh
set -e

echo "Waiting for database to be ready..."
sleep 3

echo "Running database setup..."

# Check if migrations folder exists and has migrations
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  echo "Found migrations, running migrate deploy..."
  npx prisma migrate deploy
else
  echo "No migrations found. Using db push to create tables..."
  npx prisma db push --accept-data-loss
fi

echo "Database setup completed"
echo "Starting application..."
exec "$@"
