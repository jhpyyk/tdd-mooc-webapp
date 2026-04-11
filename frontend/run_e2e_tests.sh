#!/usr/bin/env bash
set -euo pipefail

cleanup() {
  docker compose -f ../docker-compose-test.yaml down
}
trap cleanup EXIT

docker compose -f ../docker-compose-test.yaml up -d

echo "Waiting for test DB to become healthy..."

for i in {1..15}; do
  status=$(docker inspect -f '{{.State.Health.Status}}' postgres_test 2>/dev/null || echo "starting")
  if [ "$status" = "healthy" ]; then
    echo "DB is healthy"
    break
  fi
  sleep 1
done

status=$(docker inspect -f '{{.State.Health.Status}}' postgres_test)
if [ "$status" != "healthy" ]; then
  echo "DB did not become healthy"
  exit 1
fi

export DATABASE_URL="postgres://user:password@localhost:5433/test_db?sslmode=disable"

npm run e2e
