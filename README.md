# My FastAPI Project

Повноцінний FastAPI проект з аутентифікацією JWT, CRUD операціями та базою даних SQLite.

## Технології

- **FastAPI** — сучасний веб-фреймворк для Python
- **SQLAlchemy** — ORM для роботи з базою даних SQLite
- **Pydantic v2** — валідація даних і схеми
- **python-jose** — JWT токени
- **passlib[bcrypt]** — хешування паролів

## Встановлення та запуск

### 1. Клонування репозиторію

```bash
git clone https://github.com/zakkfor/API-project.git
cd API-project
```

### 2. Створення віртуального середовища

```bash
python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows
```

### 3. Встановлення залежностей

```bash
pip install -r requirements.txt
```

### 4. Налаштування змінних середовища

```bash
cp .env.example .env
# Відредагуйте .env і змініть SECRET_KEY на випадковий рядок
```

### 5. Запуск сервера

```bash
uvicorn app.main:app --reload
```

Сервер буде доступний на `http://127.0.0.1:8000`

- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc
- **Web UI**: http://127.0.0.1:8000

## Структура проекту

```
API-project/
├── app/
│   ├── config.py          # Налаштування проекту
│   ├── main.py            # Точка входу FastAPI
│   ├── database.py        # SQLAlchemy з'єднання
│   ├── models/user.py     # Модель User
│   ├── schemas/           # Pydantic схеми
│   ├── crud/user.py       # CRUD операції
│   ├── core/security.py   # JWT, хешування паролів
│   └── api/v1/            # Ендпоінти API
├── static/index.html      # Веб-інтерфейс
├── requirements.txt
└── .env.example
```

## API Ендпоінти

### Аутентифікація

| Метод | URL | Опис |
|-------|-----|------|
| POST | `/api/v1/register` | Реєстрація нового користувача |
| POST | `/api/v1/login` | Отримання JWT токена (form data) |
| GET  | `/api/v1/me` | Дані поточного користувача |

### Користувачі

| Метод | URL | Опис |
|-------|-----|------|
| GET    | `/api/v1/users/` | Список всіх користувачів (superuser) |
| GET    | `/api/v1/users/{id}` | Отримання користувача за ID |
| PUT    | `/api/v1/users/{id}` | Оновлення користувача |
| DELETE | `/api/v1/users/{id}` | Видалення користувача |

### Системні

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/` | Веб-інтерфейс або привітання |
| GET | `/health` | Перевірка стану сервісу |

## Приклади запитів

### Реєстрація

```bash
curl -X POST http://localhost:8000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"johndoe","password":"secret123"}'
```

### Логін

```bash
curl -X POST http://localhost:8000/api/v1/login \
  -d "username=johndoe&password=secret123"
```

### Отримання профілю

```bash
curl http://localhost:8000/api/v1/me \
  -H "Authorization: Bearer <your_token>"
```
