#!/usr/bin/env bash

docker compose exec goapi go test ./... -v
