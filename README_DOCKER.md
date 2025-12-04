# Docker (React + Vite) — quick run

## Production image (nginx)

Build & run:
1. docker-compose build
2. docker-compose up -d
3. Open: http://localhost:3000

Manual build & run:
1. docker build -t local/frontend:latest .
2. docker run --rm -p 3000:80 local/frontend:latest

Export image to tar (to share):
1. docker save -o frontend-latest.tar local/frontend:latest
2. Send frontend-latest.tar to reviewer (they run: `docker load -i frontend-latest.tar` then `docker run --rm -p 3000:80 local/frontend:latest`)

## Dev (hot-reload in Docker)
1. docker compose -f docker-compose.dev.yml up
2. Open: http://localhost:5173
