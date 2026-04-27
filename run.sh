#!/usr/bin/env bash
set -e

# ─────────────────────────────────────────
#   Angaza Dryland – Developer Task Runner
# ─────────────────────────────────────────

# ── Dev ──────────────────────────────────

dev() {
    _check_env
    echo "Starting PostgreSQL..."
    docker compose -f docker-compose.dev.yaml up postgres -d
    echo ""
    echo "Starting API (port 3003) and Web (port 3000)..."
    echo "  Web → http://localhost:3000"
    echo "  API → http://localhost:3003"
    echo "  Docs → http://localhost:3003/api/docs"
    echo ""
    trap _stop_dev SIGINT SIGTERM
    pnpm --filter angaza-dryland-api start:dev &
    API_PID=$!
    pnpm --filter angaza-dryland-web dev &
    WEB_PID=$!
    wait $API_PID $WEB_PID
}

dev:api() {
    _check_env
    docker compose -f docker-compose.dev.yaml up postgres -d
    pnpm --filter angaza-dryland-api start:dev
}

dev:web() {
    pnpm --filter angaza-dryland-web dev
}

dev:stop() {
    echo "Stopping Angaza dev services..."
    docker compose -f docker-compose.dev.yaml down
    pkill -f "nest start" 2>/dev/null || true
    pkill -f "nuxi dev" 2>/dev/null || true
    echo "Done."
}

# ── Database ─────────────────────────────

db:shell() {
    docker exec -it angaza-dryland-postgres-1 psql -U angaza -d angaza
}

db:seed() {
    echo "Seeding database..."
    cd api && pnpm ts-node -r tsconfig-paths/register src/seed.ts
}

# ── Install ───────────────────────────────

install() {
    echo "Installing all dependencies..."
    pnpm install
}

# ── Help ──────────────────────────────────

help() {
    echo ""
    echo "Angaza Dryland – available commands:"
    echo ""
    echo "  ./run.sh dev          Start postgres + API + web (all-in-one)"
    echo "  ./run.sh dev:api      Start postgres + API only"
    echo "  ./run.sh dev:web      Start web only"
    echo "  ./run.sh dev:stop     Stop all dev services"
    echo "  ./run.sh install      Install all pnpm dependencies"
    echo "  ./run.sh db:shell     Open PostgreSQL shell"
    echo "  ./run.sh db:seed      Seed the database with sample data"
    echo "  ./run.sh help         Show this message"
    echo ""
}

# ── Internal ─────────────────────────────

_check_env() {
    if [ ! -f ".env" ]; then
        echo "No .env found — copying from .env.example"
        cp .env.example .env
    fi
    if [ ! -f "api/.env" ]; then
        cp api/.env.example api/.env 2>/dev/null || cp .env api/.env
    fi
}

_stop_dev() {
    echo ""
    echo "Shutting down..."
    kill $API_PID $WEB_PID 2>/dev/null || true
    exit 0
}

# ── Dispatcher ───────────────────────────

if [ $# -eq 0 ]; then
    help
    exit 0
fi

CMD="${1//:/_}"   # replace : with _ so dev:api → dev_api

# Try exact match first, then colon-style alias
if declare -F "$1" > /dev/null 2>&1; then
    func="$1"
elif declare -F "$CMD" > /dev/null 2>&1; then
    func="$CMD"
else
    echo ""
    echo "Error: '$1' is not a valid command."
    echo ""
    help
    exit 1
fi

shift
"$func" "$@"
