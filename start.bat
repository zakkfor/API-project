@echo off
REM ─────────────────────────────────────────────────────────
REM Bike House — one-click startup script (Windows)
REM Double-click start.bat or run: start.bat
REM ─────────────────────────────────────────────────────────

echo 🚲  Bike House — запуск...

REM 1. Virtual environment
if not exist venv (
    echo 📦  Створення venv...
    python -m venv venv
)
call venv\Scripts\activate.bat

REM 2. Install Python dependencies
echo 📦  Встановлення залежностей Python...
pip install -q -r requirements.txt

REM 3. Copy .env if missing
if not exist .env (
    copy .env.example .env
    echo 📝  Створено .env (з .env.example)
)

REM 4. Start server
echo.
echo ✅  Сайт буде доступний за адресою: http://127.0.0.1:8000
echo 📄  Swagger API docs:          http://127.0.0.1:8000/docs
echo.
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
