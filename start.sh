#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Bike House — one-click startup script (Linux / macOS)
# Usage:  bash start.sh
# ─────────────────────────────────────────────────────────
set -e

PYTHON=${PYTHON:-python3}
PORT=${PORT:-8000}

echo "🚲  Bike House — запуск..."

# 1. Virtual environment
if [ ! -d "venv" ]; then
  echo "📦  Створення venv..."
  $PYTHON -m venv venv
fi
source venv/bin/activate

# 2. Install Python dependencies
echo "📦  Встановлення залежностей Python..."
pip install -q -r requirements.txt

# 3. Build frontend (if Node is available and dist not yet built)
if command -v npm &>/dev/null; then
  if ! ls static/assets/index-*.js 1>/dev/null 2>&1; then
    echo "🏗️   Збірка фронтенду..."
    cd frontend && npm install --silent && npm run build --silent && cd ..
  fi
fi

# 4. Copy .env if missing
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "📝  Створено .env (з .env.example)"
fi

# 5. Start server
echo ""
echo "✅  Сайт доступний за адресою: http://127.0.0.1:${PORT}"
echo "📄  Swagger API docs:          http://127.0.0.1:${PORT}/docs"
echo ""
uvicorn app.main:app --host 0.0.0.0 --port "$PORT" --reload
