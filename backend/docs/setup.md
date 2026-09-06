# Setup and Operations

## Environment

Create `backend/.env` when overriding defaults:

```env
NODE_ENV=development
PORT=3000
DATABASE_PATH=./data/pesa_cup.sqlite
UPLOAD_DIR=./uploads
ALLOWED_ORIGINS=http://localhost:5173
ADMIN_API_KEY=replace-this-for-admin-routes
ESEWA_ENV=sandbox
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_SECRET_KEY=replace-this-with-the-eSewa-secret
ESEWA_REGISTRATION_AMOUNT=1500
ESEWA_SUCCESS_URL=http://localhost:5173/payment/success
ESEWA_FAILURE_URL=http://localhost:5173/payment/failure
```

The development database defaults to `data/pesa_cup_futsal_dev.db`. In other environments, `DATABASE_PATH` controls the SQLite file. `PORT` defaults to `3000`; `UPLOAD_DIR` defaults to `uploads`.

`JWT_SECRET`, `JWT_KEY_EXPIRY`, and `DATABASE_URL` may appear in older environment examples, but they are not used by the current source code.

For payments, use `ESEWA_ENV=sandbox` during development. Never expose `ESEWA_SECRET_KEY` to the frontend. The registration amount is an integer in the configured currency unit and is always taken from `ESEWA_REGISTRATION_AMOUNT`.

## Database

The server applies migrations from `backend/drizzle` before listening. Use these commands from `backend/`:

```bash
bun run db:generate
bun run db:migrate
bun run db:studio
bun run db:seed
```

Seeding clears existing records in foreign-key order and inserts development data. Do not run it against production data.

## Testing and Build

```bash
bun test
bun run build
```

Tests are isolated unit tests and do not start the server or intentionally use the development database.

## Docker

```bash
docker build -t pesa-cup-backend .
docker run -p 3000:3000 --env-file .env pesa-cup-backend
```

Mount persistent storage for the SQLite database and uploads when running the container beyond local development.
