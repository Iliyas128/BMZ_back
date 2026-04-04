# BMZ Backend (`back`)

Node.js + Express + MongoDB backend with admin API for:
- categories
- subcategories
- products

## 1) Setup

```bash
cd back
cp .env.example .env
```

Fill `.env` values:
- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_BOOTSTRAP_KEY`
- `ADMIN_EMAIL`

Install dependencies:

```bash
npm install
```

## 2) Run

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Health check:
- `GET /api/health`

## 3) Admin bootstrap and login

Create first admin (one-time):

`POST /api/admin/auth/bootstrap`

```json
{
  "bootstrapKey": "from_env_ADMIN_BOOTSTRAP_KEY",
  "username": "admin",
  "email": "admin@example.com",
  "password": "strongPassword123"
}
```

Login:

`POST /api/admin/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "strongPassword123"
}
```

Use returned token as:

`Authorization: Bearer <token>`

### OTP login (recommended)

Request OTP (sends code to `ADMIN_EMAIL`):

`POST /api/admin/otp/request`

```json
{
  "email": "manager@company.kz",
  "fullName": "Имя Фамилия"
}
```

Verify OTP:

`POST /api/admin/otp/verify`

```json
{
  "requestId": "<from_request>",
  "code": "123456"
}
```

**Важно:** это **письмо на email** администратора (`ADMIN_EMAIL`), не SMS. На localhost без `SMTP_*` код только **пишется в консоль** сервера (`npm run dev`) — поэтому кажется, что «всё работает». На **Vercel** консоли под рукой нет: без настроенного SMTP письмо не уйдёт.

**Vercel → Project → Settings → Environment Variables** (для backend-проекта):

| Переменная | Пример |
|------------|--------|
| `MONGO_URI` | строка Atlas |
| `JWT_SECRET` | длинная случайная строка |
| `ADMIN_EMAIL` | почта, куда приходит код |
| `SMTP_HOST` | например `smtp.gmail.com` или хост Brevo/SendGrid |
| `SMTP_PORT` | `587` (STARTTLS) или `465` (SSL) |
| `SMTP_SECURE` | `false` для 587, **`true`** для 465 |
| `SMTP_USER` | логин SMTP |
| `SMTP_PASS` | пароль или **пароль приложения** (для Gmail) |
| `SMTP_FROM` | (опц.) адрес «От кого» |
| `CORS_ORIGIN` | `https://твой-фронт.vercel.app` (без слэша в конце) |

Убедись, что `VITE_API_BASE_URL` на фронте **без завершающего `/`**, иначе получится `//api/...` и ломаются запросы.

## 4) Public catalog endpoints

- `GET /api/catalog/categories`
- `GET /api/catalog/categories/:slug`
- `GET /api/catalog/subcategories/:slug`
- `GET /api/catalog/products?page=1&limit=12&search=...&category=<id>&subcategory=<id>`
- `GET /api/catalog/products/:slug`
- `GET /api/catalog/tree`

## 5) Admin CRUD endpoints

### Categories
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/:id`
- `DELETE /api/admin/categories/:id`

### Subcategories
- `GET /api/admin/subcategories`
- `POST /api/admin/subcategories`
- `PUT /api/admin/subcategories/:id`
- `DELETE /api/admin/subcategories/:id`

### Products
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/:id`
- `DELETE /api/admin/products/:id`

