# Інструкція по деплою

**Бекенд → Railway** | **Фронтенд → Netlify**

---

## Крок 1 — Деплой бекенду на Railway

### 1.1 Створити акаунт і новий проект

1. Відкрий [railway.app](https://railway.app) і увійди (GitHub / Google).
2. Натисни **"New Project"**.
3. Вибери **"Deploy from GitHub repo"**.
4. Авторизуй Railway для доступу до репозиторіїв, вибери **`zakkfor/API-project`** і натисни **"Deploy Now"**.

### 1.2 Налаштувати змінні середовища

Після деплою зліва вибери свій сервіс → вкладка **"Variables"** → **"New Variable"** і додай кожну змінну:

| Ім'я змінної | Значення |
|---|---|
| `SECRET_KEY` | будь-який довгий випадковий рядок (≥ 32 символи), наприклад згенерований на [randomkeygen.com](https://randomkeygen.com) |
| `SEED_USER_PASSWORD` | пароль для тестового адміна (наприклад `BikeHouse2025!`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |
| `DATABASE_URL` | *(не потрібно — SQLite за замовчуванням)* |

> ⚠️ **Ніколи не використовуй значення з `.env.example` в продакшені.** `SECRET_KEY` має бути унікальним.

### 1.3 Перевірити налаштування деплою

Railway автоматично зчитує `railway.toml` з кореня репозиторію. Файл вже налаштований правильно:

```toml
[deploy]
startCommand = "python run.py"
healthcheckPath = "/health"
healthcheckTimeout = 60
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

Нічого додатково налаштовувати **не потрібно**.

### 1.4 Отримати публічний URL бекенду

1. У Railway вибери свій сервіс → вкладка **"Settings"** → розділ **"Networking"**.
2. Натисни **"Generate Domain"** (якщо домену ще немає).
3. Скопіюй URL — він виглядає як `https://api-project-production-xxxx.up.railway.app`.

> Переконайся, що `https://YOUR_BACKEND_URL/health` відповідає `{"status":"healthy"}`.

---

## Крок 2 — Деплой фронтенду на Netlify

### 2.1 Створити акаунт і підключити репозиторій

1. Відкрий [netlify.com](https://netlify.com) і увійди (GitHub).
2. Натисни **"Add new site"** → **"Import an existing project"**.
3. Вибери **"Deploy with GitHub"** → авторизуй → вибери **`zakkfor/API-project`**.

### 2.2 Налаштувати параметри білду

На сторінці **"Configure site and deploy"** встанови такі значення:

| Поле | Значення |
|---|---|
| **Base directory** | `frontend` |
| **Build command** | `npm ci && npm run build` |
| **Publish directory** | `frontend/dist` |

> Netlify автоматично зчитує `netlify.toml` з кореня репозиторію — ці значення вже прописані там, тому поля мають заповнитися самостійно.

### 2.3 Додати змінну середовища VITE_API_URL

Це **найважливіший крок** — фронтенд повинен знати адресу твого бекенду на Railway.

1. На тій же сторінці (або пізніше: **Site configuration** → **Environment variables** → **Add a variable**).
2. Додай змінну:

| Ім'я | Значення |
|---|---|
| `VITE_API_URL` | URL бекенду з Кроку 1.4, наприклад `https://api-project-production-xxxx.up.railway.app` |

> ⚠️ **Без trailing slash!** Тобто `https://...railway.app`, а **не** `https://...railway.app/`

3. Натисни **"Deploy site"**.

### 2.4 Перевірити деплой

1. Дочекайся зеленого статусу **"Published"**.
2. Відкрий URL Netlify — наприклад `https://bike-house.netlify.app`.
3. Перевір що сайт завантажується і список велосипедів відображається.

---

## Крок 3 — Налаштувати CORS на бекенді (якщо потрібно)

Якщо браузер показує помилку **CORS**, потрібно додати URL Netlify до дозволених origins на Railway:

1. Railway → сервіс → **Variables** → додай:

| Ім'я | Значення |
|---|---|
| `ALLOWED_ORIGINS` | `https://YOUR_SITE.netlify.app` |

> За замовчуванням бекенд вже налаштований на `allow_origins=["*"]` (всі джерела), тому CORS-помилок не має бути.

---

## Схема зв'язку

```
Браузер користувача
       │
       ├──► https://bike-house.netlify.app   (Netlify — React SPA)
       │         │
       │         │  fetch /api/v1/bicycles
       │         ▼
       └──► https://xxx.up.railway.app       (Railway — FastAPI + SQLite)
                  │
                  └──► /health  ← Railway healthcheck (60s timeout)
```

---

## Повторний деплой після змін у коді

| Платформа | Що відбувається |
|---|---|
| **Railway** | Автоматично деплоїть при кожному `git push` у `main` |
| **Netlify** | Автоматично деплоїть при кожному `git push` у `main` |

Обидві платформи слідкують за гілкою **`main`** і деплоять автоматично.

---

## Часті помилки

| Симптом | Причина | Рішення |
|---|---|---|
| `Healthcheck failed` на Railway | Застосунок не стартує протягом 60с | Перевір Variables — чи є `SECRET_KEY` |
| Порожній список велосипедів | `VITE_API_URL` не встановлено або неправильний | Перевір Variables на Netlify та зроби Redeploy |
| `CORS error` в консолі браузера | Домен Netlify не дозволений | Додай `ALLOWED_ORIGINS` на Railway |
| `404` на Netlify при refresh | SPA fallback не працює | Переконайся, що `netlify.toml` є в репозиторії |
| `401 Unauthorized` | Токен протермінований | Вийди і увійди знову |
