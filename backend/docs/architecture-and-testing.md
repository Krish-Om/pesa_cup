# Architecture and Testing

## Request Flow

Requests enter through `src/app.ts`, which configures JSON parsing, CORS, upload serving, rate limiting, routes, not-found handling, and the global error handler.

Feature modules use this flow:

```text
route -> controller -> service -> repository -> Drizzle schema
```

- Routes define paths and middleware.
- Controllers translate HTTP input and output.
- Services validate input and enforce business rules.
- Repositories contain persistence queries.
- Schemas define database-backed input and output validation.

The service layer is the preferred unit-test boundary because repositories can generally be supplied as test doubles. Middleware and schemas can be tested without HTTP or database setup.

## Authentication

Admin access currently uses a static Bearer token checked by `requireAdmin`. It is not JWT or session authentication. Keep `ADMIN_API_KEY` out of logs and client-side code.

## Testing Strategy

The backend uses Bun's built-in test runner. Essential coverage currently targets:

- Admin token acceptance and rejection.
- Consistent malformed JSON, validation, application, unknown-error, and not-found responses.
- Async error forwarding.
- Fixture, standing, contact, and registration schema rules, including defaults and invalid input.

Run tests from `backend/` with `bun test`. Add repository fakes for service tests and temporary database integration tests only when behavior depends on Drizzle transactions, relations, migrations, or foreign keys. Do not treat a test that imports and mutates the development database as an isolated unit test.

## Extension Rules

Keep new business rules in services, validate request data before persistence, use transactions for multi-step writes, and document public routes in `docs/api.md`. Update tests when changing status codes, error shapes, authentication behavior, or schema defaults.
