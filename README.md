# 🚲 Bike House

Повноцінний веб-додаток для каталогу велосипедів з JWT-аутентифікацією, REST API та сучасним темним інтерфейсом.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/zakkfor/API-project)

---

## 🌍 Деплой в інтернет (безкоштовно)

> Проект готовий до деплою «з коробки» на Railway та Render — конфіг-файли вже є в репозиторії.

### 🚂 Варіант A — Railway (найпростіший, рекомендовано)

**Railway** — безкоштовна хмарна платформа, автоматично будує Docker-образ і видає публічний URL за хвилину.

1. Зайдіть на **[railway.app](https://railway.app/)** → Sign in with GitHub
2. Натисніть **"New Project"** → **"Deploy from GitHub repo"**
3. Оберіть репозиторій `API-project`
4. Railway автоматично знайде `Dockerfile` та `railway.toml`
5. Перейдіть у **Settings → Environment** та додайте змінні:

   | Змінна | Значення |
   |--------|----------|
   | `SECRET_KEY` | будь-який випадковий рядок (наприклад: `openssl rand -hex 32`) |
   | `DATABASE_URL` | `sqlite:///./app.db` |
   | `SEED_USER_PASSWORD` | ваш пароль для тестового користувача |

6. Натисніть **"Deploy"** — через ~2 хвилини отримаєте посилання виду `https://your-app.up.railway.app` 🎉

> **Безкоштовний план:** $5 кредитів на місяць — вистачає для пет-проекту.

---

### 🎨 Варіант B — Render

**Render** — альтернатива з безкоштовним tier (сплячий режим після 15 хв неактивності).

1. Зайдіть на **[render.com](https://render.com/)** → Sign in with GitHub
2. Натисніть **"New"** → **"Blueprint"**
3. Підключіть репозиторій — Render знайде `render.yaml` автоматично
4. Оберіть ім'я сервісу та натисніть **"Apply"**
5. Перейдіть в **Environment → Add Secret** та встановіть `SECRET_KEY`
6. URL з'явиться у вигляді `https://bike-house.onrender.com` 🎉

> **Безкоштовний план:** сплить після 15 хв без трафіку, перший запит займає ~30 сек.

---

### 🔺 Варіант C — Netlify (тільки frontend) + Railway/Render (backend)

> Netlify хостить лише **статичні файли**, тому backend (FastAPI) потрібно задеплоїти окремо.

**Крок 1 — задеплойте backend на Railway або Render** (варіант A або B вище)  
Отримайте публічний URL, наприклад `https://your-backend.up.railway.app`

**Крок 2 — задеплойте frontend на Netlify:**

1. Зайдіть на **[netlify.com](https://app.netlify.com/)** → **"Add new site"** → **"Import an existing project"**
2. Підключіть GitHub → оберіть репозиторій `API-project`
3. Netlify автоматично знайде `netlify.toml` і налаштує збірку ✅
4. Перейдіть в **Site configuration → Environment variables** → натисніть **"Add a variable"**

   | Ім'я змінної | Значення |
   |--------------|----------|
   | `VITE_API_URL` | `https://your-backend.up.railway.app` |

5. Натисніть **"Deploy site"** — через ~2 хвилини отримаєте посилання виду `https://bike-house.netlify.app` 🎉

> **Безкоштовний план:** необмежений трафік для статичних сайтів.

---

### ☁️ Варіант D — Fly.io (продвинутий, найшвидший)

```bash
# Встановіть flyctl
curl -L https://fly.io/install.sh | sh

# Авторизація
fly auth login

# Деплой (з директорії проекту)
fly launch          # автоматично знайде Dockerfile, запитає налаштування
fly secrets set SECRET_KEY=$(openssl rand -hex 32)
fly deploy
```

Отримаєте URL виду `https://bike-house.fly.dev` 🎉

---

## 🚀 Швидкий старт (локально)

### 🌐 Варіант 1 — GitHub Codespaces (прямо в браузері, без встановлення)

> Натисніть кнопку — і проект відкриється прямо у браузері через VS Code в хмарі GitHub.  
> Нічого встановлювати не потрібно!

1. Натисніть кнопку **"Open in GitHub Codespaces"** вгорі
2. Зачекайте ~1-2 хвилини поки все встановиться
3. Браузер автоматично відкриє сайт на порту **8000**

---

### 🐳 Варіант 2 — Docker (найпростіший локальний запуск)

> Потрібен встановлений [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
git clone https://github.com/zakkfor/API-project.git
cd API-project
docker compose up
```

Відкрийте **http://localhost:8000** у браузері. Готово! 🎉

---

### ⚡ Варіант 3 — Скрипт одним кліком

**Linux / macOS:**
```bash
git clone https://github.com/zakkfor/API-project.git
cd API-project
bash start.sh
```

**Windows** — двічі клікніть на файл `start.bat` або:
```
start.bat
```

Скрипт автоматично створить virtualenv, встановить залежності та запустить сервер.

---

### 🔧 Варіант 4 — Вручну (повний контроль)



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
| Фронтенд | **React + Vite** (SPA) |

---

## 🚀 Запуск проекту (детальна інструкція)

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
│   ├── index.html                 # Bike House SPA
│   └── bikes/                     # SVG-ілюстрації велосипедів
├── frontend/                      # React + Vite джерело
├── .devcontainer/
│   └── devcontainer.json          # GitHub Codespaces конфігурація
├── Dockerfile                     # Docker образ
├── docker-compose.yml             # Docker Compose (один командний запуск)
├── railway.toml                   # Railway deployment config
├── render.yaml                    # Render deployment config
├── netlify.toml                   # Netlify deployment config (тільки frontend)
├── start.sh                       # Скрипт запуску Linux/macOS
├── start.bat                      # Скрипт запуску Windows
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

## 🚀 Запуск проекту (детальна інструкція)

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
│   ├── index.html                 # Bike House SPA (HTML + CSS + JS)
│   └── bikes/                     # SVG-ілюстрації велосипедів
├── .devcontainer/
│   └── devcontainer.json          # GitHub Codespaces конфігурація
├── Dockerfile                     # Docker образ
├── docker-compose.yml             # Docker Compose (один командний запуск)
├── start.sh                       # Скрипт запуску Linux/macOS
├── start.bat                      # Скрипт запуску Windows
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
