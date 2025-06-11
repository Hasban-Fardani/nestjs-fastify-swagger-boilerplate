#!/bin/sh

set -e

echo "Waiting for Postgres to be ready..."
until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USERNAME; do
  echo "Postgres is unavailable - sleeping"
  sleep 2
done

echo "Postgres is up - running migrations"
npm run migrate

echo "Starting NestJS app"

if [ "$NODE_ENV" = "production" ]; then
  exec npm run start:prod
else
  exec npm run start:dev
fi
