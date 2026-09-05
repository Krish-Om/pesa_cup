# Pesa Cup Backend

REST API for the Pesa Cup tournament platform. The backend uses Bun, TypeScript, Express 5, Drizzle ORM, and SQLite.

## Documentation

- [API reference](docs/api.md)
- [Setup and operations](docs/setup.md)
- [Payment flow](docs/payment-flow.md)
- [Architecture and testing](docs/architecture-and-testing.md)
- [Backend guidelines](docs/backend-server-guidelines.md)
- [Backend decisions](docs/Backend-Decisions.md)

The API is versioned under `/api/v1`. Current behavior is documented in the API reference; future ideas are labelled as planned in the guidelines and decisions documents.

## Quick Start

Requirements: Bun 1.x and a writable workspace.

```bash
bun install
bun run db:migrate
bun run dev
```

The server listens on `http://localhost:3000` by default. See [setup and operations](docs/setup.md) for configuration, migrations, seeding, uploads, and Docker usage.

## Common Commands

```bash
bun run dev          # Start the development server with watch mode
bun run build        # Bundle the server into dist/
bun test             # Run isolated backend unit tests
bun run db:migrate   # Apply Drizzle migrations
bun run db:seed      # Replace database content with development seed data
bun run db:generate  # Generate a migration from schema changes
bun run db:studio    # Open Drizzle Studio
```

`db:seed` is destructive and should only be run against an intended database.

## Module Layout

Each feature under `src/modules` follows a route, controller, service, repository, and schema structure where applicable. Shared middleware, database configuration, migrations, and utilities live under `src/middlewares`, `src/config`, `src/db`, and `src/utils`.

## Scope

Implemented features include public tournament content, contact and registration submission, admin-protected writes, gallery uploads, SQLite persistence, migrations, and seed data. SSE live updates, JWT/session authentication, an admin UI, and load-balancer deployment are not implemented in the current backend.
