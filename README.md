# Kassalapp — Shopping Price Tracker

Find the cheapest Norwegian supermarket for your weekly shop. Add items by search or barcode scan, compare basket totals across Kiwi, Rema 1000, Coop, and more — powered by the [Kassal API](https://kassal.app).

## Structure

```
server/   Express API — products, shopping lists, auth
web/      Next.js 14 frontend (App Router)
```

## Stack

| Layer | Tech |
|---|---|
| API | Node.js · Express · TypeScript |
| ORM | Sequelize |
| Database | PostgreSQL |
| Frontend | Next.js 14 (App Router) · React 18 · TypeScript |
| Styling | Tailwind CSS |
| Price data | Kassal API |

## Getting started

### 1. API server

```bash
cd server
cp .env.example .env       # fill in DATABASE_URL, KASSAL_API_KEY, JWT_SECRET
npm install
npm run db:sync            # create tables
npm run dev                # http://localhost:3001
```

### 2. Frontend

```bash
cd web
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:3001
npm install
npm run dev                         # http://localhost:3000
```

## API reference

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in, returns JWT |
| GET | `/api/products/search?q=` | Search products (min 3 chars) |
| GET | `/api/products/ean/:ean` | Lookup by barcode, returns all store prices |
| POST | `/api/products/bulk-prices` | Basket price comparison (up to 100 EANs) |
| GET | `/api/lists` | Get all lists for current user |
| POST | `/api/lists` | Create list |
| DELETE | `/api/lists/:id` | Delete list |
| POST | `/api/lists/:id/items` | Add item |
| PATCH | `/api/lists/:id/items/:itemId` | Update item (checked, substitutionSetting, quantity) |
| DELETE | `/api/lists/:id/items/:itemId` | Remove item |

All routes except auth require `Authorization: Bearer <token>`.

## Environment variables

**`server/.env`**

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `KASSAL_API_KEY` | API key from kassal.app |
| `JWT_SECRET` | Secret for signing JWTs (any random string) |
| `PORT` | API port (default: 3001) |
| `CORS_ORIGIN` | Allowed frontend origin (default: http://localhost:3000) |

**`web/.env.local`**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL of the Express API (default: http://localhost:3001) |
