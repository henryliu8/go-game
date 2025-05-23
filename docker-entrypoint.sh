#!/bin/sh

# 等待 PostgreSQL 启动
echo "Waiting for PostgreSQL to start..."
while ! pg_isready -h postgres -p 5432 -U postgres
do
  echo "Waiting for postgres..."
  sleep 2
done

# 运行数据库迁移
echo "Running database migrations..."
npx prisma migrate deploy

# 执行传入的命令
exec "$@" 