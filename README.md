# Woxa — Institutional Broker Directory

A full-stack broker management application built for the Woxa Full Stack Developer Test.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack React Query v5 |
| Backend | Node.js, Express 4, TypeScript |
| ORM | Prisma 5 |
| Database | PostgreSQL 15 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | Zod (shared schemas on FE + BE) |
| Forms | React Hook Form + Zod resolver |
| HTTP Client | Axios (with JWT interceptor) |
| Containerisation | Docker + docker-compose |

## Why Express over NestJS?

The assignment recommends NestJS but permits any framework with justification. Express was chosen because:

1. **Scope-appropriate**: This project has exactly 5 API endpoints. NestJS's module/decorator system adds boilerplate that provides no value at this scale.
2. **Clean architecture without the framework**: The codebase is organised as `routes → controllers → services → prisma` — the same logical layering NestJS enforces, without decorator magic.
3. **Faster setup**: No CLI scaffolding, no decorators, more transparent code flow for reviewers.
4. **TypeScript-first**: Full TypeScript with strict mode, Zod validation, and Prisma type generation — same guarantees as NestJS without the overhead.

---

## Prerequisites

- Docker Desktop — required for both the one-command Docker setup and the manual database-only setup
- Node.js 20+ — required only for manual setup

---

## Quick Start — Docker (One Command)

From the `woxa/` directory, run:

```bash
docker compose up --build
```

This builds and starts all three services automatically:

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:4000 |
| Database | localhost:5432 |

Database migrations run automatically on API startup. Open http://localhost:3000 when all containers show `Started`.

To stop everything:

```bash
docker compose down
```

To stop and wipe the database volume:

```bash
docker compose down -v
```

---

## Setup & Running (Manual)

Open **3 separate terminals** and follow each step in order.

---

### Step 1 — Start the Database

In **Terminal 1**, run PostgreSQL in Docker:

**PowerShell (Windows):**
```powershell
docker run -d `
  --name woxa-db `
  -e POSTGRES_USER=woxa `
  -e POSTGRES_PASSWORD=woxa_pass `
  -e POSTGRES_DB=woxa_db `
  -p 5432:5432 `
  postgres:15-alpine
```

**bash / Git Bash / macOS / Linux:**
```bash
docker run -d \
  --name woxa-db \
  -e POSTGRES_USER=woxa \
  -e POSTGRES_PASSWORD=woxa_pass \
  -e POSTGRES_DB=woxa_db \
  -p 5432:5432 \
  postgres:15-alpine
```

Verify it is running:

```bash
docker ps
```

You should see `woxa-db` with status `Up`.

---

### Step 2 — Start the API

In **Terminal 2**:

```bash
cd apps/api
```

Install dependencies:

```bash
npm install
```

Generate the Prisma client and run database migrations (only needed on first run):

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Start the API server:

```bash
npm run dev
```

The API is now running at **http://localhost:4000**

---

### Step 3 — Start the Frontend

In **Terminal 3**:

```bash
cd apps/web
```

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Start the frontend dev server:

```bash
npm run dev
```

The app is now running at **http://localhost:3000**

---

### What you should see

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:4000 |

Open http://localhost:3000 in your browser to use the app.

---

## Environment Variables

Copy `.env.example` to create the required env files:

```bash
# API
cp .env.example apps/api/.env

# Frontend
cp .env.example apps/web/.env.local
```

**`apps/api/.env`** — required keys:

| Key | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Random secret string (min 32 chars) |
| `PORT` | API port (default: 4000) |
| `FRONTEND_URL` | Frontend origin for CORS |

**`apps/web/.env.local`** — required keys:

| Key | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | API URL for browser requests |
| `API_URL` | API URL for server-side requests (Docker internal) |

See `.env.example` at the repo root for reference values.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/register` | — | Create user account |
| POST | `/api/login` | — | Login, returns JWT |
| POST | `/api/brokers` | JWT | Create broker |
| GET | `/api/brokers` | — | List brokers (search + filter + pagination) |
| GET | `/api/brokers/:slug` | — | Get single broker |

### Query Parameters — `GET /api/brokers`

| Param | Type | Default | Description |
|---|---|---|---|
| `search` | string | — | Case-insensitive name search |
| `type` | string | — | Filter by type: `cfd`, `bond`, `stock`, `crypto` |
| `page` | number | 1 | Page number |
| `limit` | number | 12 | Items per page (max 50) |

---

## Running Tests

Requires the database to be running (Step 1 above).

```bash
cd apps/api
npm test
```

---

## Stopping the Project

**Docker setup:** run `docker compose down` from the `woxa/` directory.

**Manual setup:** stop the API and frontend with `Ctrl+C` in each terminal, then:

```bash
docker stop woxa-db
```

To start the database again later (no migration needed on subsequent runs):

```bash
docker start woxa-db
```
