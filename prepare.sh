#!/usr/bin/env bash
cp .env.example .env
cp tests/.env.example tests/.env
(cd tests && npm install)
docker-compose up --build -d
