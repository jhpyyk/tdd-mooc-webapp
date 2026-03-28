#!/usr/bin/env bash
set -euo pipefail

cleanup() {
  docker compose -f start_test_db.yaml down
}
trap cleanup EXIT

docker compose -f start_test_db.yaml up -d

echo "Waiting for test DB to become healthy..."
for i in {1..15}; do
  status=$(docker inspect -f '{{.State.Health.Status}}' item_store_test_db 2>/dev/null || echo "starting")
  if [ "$status" = "healthy" ]; then
    echo "DB is healthy"
    break
  fi
  sleep 1
done

status=$(docker inspect -f '{{.State.Health.Status}}' item_store_test_db)
if [ "$status" != "healthy" ]; then
  echo "DB did not become healthy"
  exit 1
fi

export INTEGRATION_TEST=true
export TEST_DATABASE_URL="postgres://user:password@localhost:5433/test_db?sslmode=disable"

go test -v
