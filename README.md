# 🚲 Bike House

Повноцінний веб-додаток для каталогу велосипедів з JWT-аутентифікацією, REST API та сучасним темним інтерфейсом.

---

## 🖼️ Вигляд сайту

### Hero — початкова сторінка
![Hero](https://github.com/user-attachments/assets/0abc6868-1049-456f-986d-ff536e3cfa66)

### Секція «Чому Bike House?» + типи велосипедів
![Features & Types](https://github.com/user-attachments/assets/2ea4ed5a-af54-4f55-9f1c-f14a19bd49ed)

### Форма додавання велосипеда з upload фото
![Додати велосипед](https://github.com/user-attachments/assets/f8bf6c14-bc6d-4868-b1c4-fd24cd70698e)

---

## ⚡ Технології

| Компонент | Технологія |
|-----------|-----------|
| Веб-фреймворк | **FastAPI** |
| ORM / База даних | **SQLAlchemy** + SQLite |
| Валідація даних | **Pydantic v2** |
| Аутентифікація | **JWT** (python-jose) |
| Хешування паролів | **bcrypt** (passlib) |
| Фронтенд | Vanilla HTML / CSS / JS (SPA) |

---

## 🚀 Запуск проекту

### 1. Клонування репозиторію

```bash
git clone https://github.com/zakkfor/API-project.git
cd API-project
```

### 2. Створення віртуального середовища

```bash
# Linux / macOS
python -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Встановлення залежностей

```bash
pip install -r requirements.txt
```

### 4. Налаштування змінних середовища

```bash
cp .env.example .env
```

Відкрийте `.env` та змініть `SECRET_KEY` на будь-який випадковий рядок:

```
PROJECT_NAME=Bike House
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=my-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 5. Запуск сервера

```bash
uvicorn app.main:app --reload
```

> Або без автоматичного перезавантаження:
> ```bash
> uvicorn app.main:app
> ```

### 6. Відкрийте сайт у браузері

| Адреса | Опис |
|--------|------|
| **http://127.0.0.1:8000** | 🚲 Bike House — веб-інтерфейс |
| http://127.0.0.1:8000/docs | 📄 Swagger UI (інтерактивна документація API) |
| http://127.0.0.1:8000/redoc | 📑 ReDoc |
| http://127.0.0.1:8000/health | ✅ Перевірка стану сервісу |

---

## 🗂️ Структура проекту

```
API-project/
├── app/
│   ├── main.py                    # Точка входу FastAPI
│   ├── config.py                  # Налаштування (Settings)
│   ├── database.py                # SQLAlchemy з'єднання + get_db()
│   ├── models/
│   │   ├── user.py                # Модель User
│   │   └── bicycle.py             # Модель Bicycle
│   ├── schemas/
│   │   ├── user.py                # Pydantic схеми користувача
│   │   ├── bicycle.py             # Pydantic схеми велосипеда
│   │   └── token.py               # Схеми JWT токена
│   ├── crud/
│   │   ├── user.py                # CRUD для User
│   │   └── bicycle.py             # CRUD для Bicycle
│   ├── core/
│   │   └── security.py            # JWT, хешування паролів, dependencies
│   └── api/v1/
│       ├── router.py              # Головний роутер v1
│       └── endpoints/
│           ├── auth.py            # /register, /login, /me
│           ├── users.py           # /users/
│           └── bicycles.py        # /bicycles/
├── static/
│   └── index.html                 # Bike House SPA (HTML + CSS + JS)
├── docs/
│   └── screenshots/               # Скріншоти інтерфейсу
├── requirements.txt
├── .env.example
└── README.md
```

---

## 🔌 API Ендпоінти

### Аутентифікація

| Метод | URL | Опис | Auth |
|-------|-----|------|------|
| `POST` | `/api/v1/register` | Реєстрація нового користувача | — |
| `POST` | `/api/v1/login` | Отримання JWT токена (form data) | — |
| `GET`  | `/api/v1/me` | Дані поточного авторизованого користувача | ✅ |

### Велосипеди

| Метод | URL | Опис | Auth |
|-------|-----|------|------|
| `GET`    | `/api/v1/bicycles/` | Список велосипедів (з фільтрами) | — |
| `POST`   | `/api/v1/bicycles/` | Додати велосипед | ✅ |
| `GET`    | `/api/v1/bicycles/{id}` | Деталі велосипеда за ID | — |
| `PUT`    | `/api/v1/bicycles/{id}` | Оновити велосипед | ✅ власник |
| `DELETE` | `/api/v1/bicycles/{id}` | Видалити велосипед | ✅ власник |

#### Параметри фільтрації (`GET /api/v1/bicycles/`)

| Параметр | Тип | Опис | Приклад |
|----------|-----|------|---------|
| `type` | string | Тип велосипеда | `mountain`, `city`, `road`, `bmx`, `electric` |
| `available_only` | bool | Тільки доступні | `true` |
| `skip` | int | Пропустити N записів | `0` |
| `limit` | int | Максимум записів | `100` |

### Користувачі

| Метод | URL | Опис | Auth |
|-------|-----|------|------|
| `GET`    | `/api/v1/users/` | Список користувачів | ✅ superuser |
| `GET`    | `/api/v1/users/{id}` | Користувач за ID | ✅ |
| `PUT`    | `/api/v1/users/{id}` | Оновити користувача | ✅ |
| `DELETE` | `/api/v1/users/{id}` | Видалити користувача | ✅ |

---

## 📋 Приклади запитів (curl)

### Реєстрація

```bash
curl -X POST http://localhost:8000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"email":"rider@example.com","username":"rider1","password":"bikepass"}'
```

Відповідь:
```json
{
  "id": 1,
  "email": "rider@example.com",
  "username": "rider1",
  "is_active": true,
  "is_superuser": false,
  "created_at": "2026-02-26T12:00:00"
}
```

### Вхід (отримання токена)

```bash
curl -X POST http://localhost:8000/api/v1/login \
  -d "username=rider1&password=bikepass"
```

Відповідь:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Додати велосипед (потрібен токен)

```bash
curl -X POST http://localhost:8000/api/v1/bicycles/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "name": "Trek FX 3 Disc",
    "brand": "Trek",
    "model": "FX 3 Disc",
    "type": "city",
    "price_per_hour": 45.0,
    "description": "Комфортний міський велосипед",
    "is_available": true
  }'
```

### Отримати список велосипедів

```bash
# Всі велосипеди
curl http://localhost:8000/api/v1/bicycles/

# Тільки гірські
curl "http://localhost:8000/api/v1/bicycles/?type=mountain"

# Тільки доступні
curl "http://localhost:8000/api/v1/bicycles/?available_only=true"

# Гірські + доступні
curl "http://localhost:8000/api/v1/bicycles/?type=mountain&available_only=true"
```

### Профіль поточного користувача

```bash
curl http://localhost:8000/api/v1/me \
  -H "Authorization: Bearer <your_token>"
```

---

## 🌐 Веб-інтерфейс — як користуватись

1. **Відкрийте** `http://127.0.0.1:8000` у браузері
2. **Перегляньте каталог** — доступний без реєстрації
3. **Зареєструйтесь** — натисніть «Увійти / Реєстрація» → вкладка «Реєстрація»
4. **Увійдіть** — введіть username і пароль
5. **Додайте велосипед** — після входу з'явиться кнопка «+ Додати велосипед»
6. **Фільтруйте** — натискайте кнопки типів (Гірські / Міські / Шосейні / BMX / Електричні)
7. **Деталі** — натисніть «Деталі» на будь-якій картці
8. **Редагуйте / Видаляйте** — власник бачить кнопки ✏️ і 🗑️ на своїх велосипедах

---

## 🔒 Безпека

- Паролі хешуються алгоритмом **bcrypt**
- Аутентифікація через **JWT Bearer токени**
- Токен зберігається у `localStorage` браузера
- Запити на запис вимагають валідний токен
- Редагування/видалення доступне тільки власнику або superuser
- Валідація полів: тип велосипеда, ціна > 0, обов'язкові поля

---

## 📝 Ліцензія

MIT License — використовуйте вільно.
