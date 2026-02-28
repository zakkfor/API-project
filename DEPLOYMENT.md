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

Це **саме той URL**, який треба вставити як `VITE_API_URL` на Netlify.

**Де його знайти в Railway:**

1. Відкрий [railway.app/dashboard](https://railway.app/dashboard) і зайди у свій проект.
2. Клікни на картку **сервісу** (вона називається `API-project` або схоже).
3. Перейди на вкладку **"Settings"** (у верхньому рядку вкладок сервісу).
4. Прокрути вниз до розділу **"Networking"** → підрозділ **"Public Networking"**.
5. Там буде поле **"Domain"** — якщо домену ще немає, натисни **"Generate Domain"**.
6. Після генерації з'явиться URL виду:
   ```
   https://api-project-production-xxxx.up.railway.app
   ```
7. **Скопіюй цей URL** — він і є `VITE_API_URL`.

> 💡 **Альтернативний спосіб:** Після успішного деплою Railway показує URL прямо на вкладці **"Deployments"** → клікни на останній деплой → у правому верхньому куті побачиш посилання на домен.

> ✅ **Перевірка:** Відкрий у браузері `https://ТУТ_ТВІЙ_URL/health` — має відповісти `{"status":"healthy"}`. Якщо так — бекенд працює і URL правильний.

---

## Крок 2 — Деплой фронтенду на Netlify

> **TL;DR:** Підключи GitHub-репо → вкажи одну змінну `VITE_API_URL` → натисни Deploy. Усе інше вже налаштовано автоматично через `netlify.toml`.

### 2.1 Створити акаунт і підключити репозиторій

1. Відкрий [app.netlify.com](https://app.netlify.com) і увійди через **GitHub**.
2. Натисни **"Add new site"** → **"Import an existing project"**.
3. Вибери **"Deploy with GitHub"** → авторизуй Netlify → у списку знайди і вибери **`zakkfor/API-project`**.
4. Вибери гілку **`main`** (або ту, яку хочеш деплоїти).

### 2.2 Налаштувати параметри білду

На сторінці **"Configure site and deploy"** Netlify **автоматично** зчитує `netlify.toml` з кореня репозиторію і підставляє правильні значення сам:

| Поле | Правильне значення | Де береться |
|---|---|---|
| **Base directory** | `frontend` | з `netlify.toml` автоматично |
| **Build command** | `npm ci && npm run build` | з `netlify.toml` автоматично |
| **Publish directory** | `dist` | з `netlify.toml` автоматично |

> ✅ Якщо ці поля вже заповнені правильно — нічого не чіпай і переходь одразу до кроку 2.3.
>
> ❌ Якщо поля порожні або неправильні — заповни їх вручну точно так, як у таблиці вище.

### 2.3 Додати змінну середовища VITE_API_URL ← **обов'язковий ручний крок**

Це **єдина річ, яку Netlify не може заповнити сам** — адреса твого бекенду на Railway.

**Спосіб A — під час першого деплою** (рекомендований):

На сторінці "Configure site and deploy" прокрути вниз до розділу **"Environment variables"** → натисни **"Add a variable"** і додай:

| Ім'я змінної | Значення |
|---|---|
| `VITE_API_URL` | URL бекенду з **Кроку 1.4** |

**Спосіб B — після деплою**:

**Site configuration** → **Environment variables** → **"Add a variable"** → додай `VITE_API_URL` → збережи → зроби **Deploys** → **"Trigger deploy"** → **"Deploy site"** (потрібен редеплой, щоб змінна підхопилась).

**Приклад правильного значення:**
```
https://api-project-production-xxxx.up.railway.app
```

> ⚠️ **Без косої риски в кінці!** Тобто `https://...railway.app` — а **не** `https://...railway.app/`

### 2.4 Задеплоїти

Натисни **"Deploy site"**. Netlify:
1. Клонує репо, перейде в папку `frontend`
2. Виконає `npm ci && npm run build`
3. Опублікує вміст `frontend/dist`

### 2.5 Перевірити деплой

1. Дочекайся зеленого статусу **"Published"** (зазвичай 1–2 хвилини).
2. Клікни на URL сайту — наприклад `https://randomname.netlify.app`.
3. ✅ Список велосипедів відображається → усе працює.
4. ❌ Список порожній → перевір, чи правильно вказано `VITE_API_URL` (крок 2.3) і чи бекенд на Railway відповідає на `/health`.

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
| Сайт відкривається на секунду, потім зникає (біла сторінка) | `VITE_API_URL` не встановлено → Netlify повертає HTML (200) замість JSON → React крашиться | Встанови `VITE_API_URL` (крок 2.3) і зроби **Trigger deploy**. Діагностика: F12 → Console — буде `TypeError`. |
| Порожній список велосипедів | `VITE_API_URL` не встановлено або неправильний | Перевір Variables на Netlify та зроби Redeploy |
| `CORS error` в консолі браузера | Домен Netlify не дозволений | Додай `ALLOWED_ORIGINS` на Railway |
| `404` на Netlify при refresh | SPA fallback не працює | Переконайся, що `netlify.toml` є в репозиторії |
| `401 Unauthorized` | Токен протермінований | Вийди і увійди знову |
