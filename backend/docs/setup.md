# Setup and Operations

## Environment

Create `backend/.env` when overriding defaults:

```env
NODE_ENV=development
PORT=3000
DATABASE_PATH=./data/pesa_cup.sqlite
UPLOAD_DIR=./uploads
APP_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:5173
ADMIN_API_KEY=replace-this-for-admin-routes
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | HTTP server port |
| `NODE_ENV` | — | `development` uses `pesa_cup_dev.sqlite`; anything else uses `DATABASE_PATH` |
| `DATABASE_PATH` | `./pesa_cup_prod.sqlite` | SQLite file path (non-development only) |
| `UPLOAD_DIR` | `./uploads` | Root directory for all uploaded files. Subdirectories `receipts/`, `gallery/`, and `misc/` are created automatically on startup. |
| `APP_URL` | derived from request | Base URL prepended to upload paths in API responses when an absolute URL is needed. |
| `ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:5173` | Comma-separated list of allowed CORS origins. Set to `*` to allow all. |
| `ADMIN_API_KEY` | — | Bearer token required for all admin routes and the `/uploads/receipts` static path. |

## Upload Directory Layout

```
$UPLOAD_DIR/          (default: ./uploads)
├── receipts/         payment receipt screenshots (admin-read-only)
├── gallery/          tournament photos and media (public)
└── misc/             catch-all (public)
```

All subdirectories are created by `src/utils/local-storage.ts` at server startup. They do not need to be created manually.

## Database

The server applies Drizzle migrations before listening. Run these commands from `backend/`:

```bash
bun run db:generate   # generate a new migration from schema changes
bun run db:migrate    # apply pending migrations
bun run db:studio     # open Drizzle Studio (browser-based DB viewer)
bun run db:seed       # clear and re-seed development data
```

Seeding clears existing records in foreign-key order and inserts development fixtures, standings, scorers, gallery categories, and one sample pending registration. Do not run it against production data.

## Testing and Build

```bash
bun test        # run unit tests
bun run build   # bundle to ./dist
```

Tests are isolated unit tests. They do not start the server or use the development database.

## Docker

```bash
docker build -t pesa-cup-backend .
docker run -p 3000:3000 --env-file .env pesa-cup-backend
```

Mount persistent storage for the SQLite database and uploads when running beyond local development:

```bash
docker run -p 3000:3000 \
  --env-file .env \
  -v /data/pesa_cup:/data \
  -v /data/uploads:/uploads \
  pesa-cup-backend
```
