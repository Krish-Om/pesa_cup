# Pesa Cup — Backend

REST API for the Pesa Cup tournament platform. Built with Bun, TypeScript, and Express 5.

## Tech Stack

| Tool | Purpose |
|------|---------|
| Bun | Runtime & package manager |
| TypeScript | Language |
| Express 5 | HTTP framework |
| bun:sqlite | Embedded SQLite database |
| Zod | Request validation |
| Pino | Structured logging |
| dotenv | Environment config |

## Project Structure

```
src/
├── config/
│   └── database.ts       # SQLite connection & DbSession interface
├── db/
│   ├── schema.ts         # Table definitions (auto-created on startup)
│   └── seed.ts           # Initial data seeding
├── middlewares/
│   └── error-handler.ts  # 404 & global error handlers
├── modules/              # Feature modules (routes + logic)
│   ├── fixtures/
│   ├── standings/
│   ├── scorers/
│   ├── gallery/
│   ├── contact/
│   └── tournament/
├── app.ts                # Express app setup, CORS, route mounting
└── server.ts             # Entry point — schema init, seed, listen
```

## API Endpoints

Base path: `/api/v1`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| * | `/fixtures` | Match fixtures |
| * | `/standings` | League standings |
| * | `/scorers` | Top scorers |
| * | `/gallery` | Gallery categories & photos |
| * | `/contacts` | Contact form messages |
| * | `/tournament` | Tournament info |

## Database Schema

Six tables are auto-created on startup:

- `fixtures` — match details, scores, status
- `standings` — group stage table per team
- `scorers` — goals & assists per player
- `gallery_categories` — photo album categories
- `gallery_photos` — individual photos linked to categories
- `contact_messages` — submitted contact form entries

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) ≥ 1.0

### Install & Run

```bash
bun install

# Development (watch mode)
bun run dev

# Production
bun run start
```

The server starts at **http://localhost:3000**.

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
NODE_ENV=development          # uses pesa_cup_dev.sqlite
DATABASE_PATH=./pesa_cup_prod.sqlite  # used in production
ALLOWED_ORIGINS=http://localhost:5173
```

> In `development` mode the database file is `pesa_cup_dev.sqlite`.  
> In any other environment it uses `DATABASE_PATH` (defaults to `pesa_cup_prod.sqlite`).

### Other Commands

```bash
bun run build    # Bundle to ./dist
```

## Docker

```bash
docker build -t pesa-cup-backend .
docker run -p 3000:3000 --env-file .env pesa-cup-backend
```
