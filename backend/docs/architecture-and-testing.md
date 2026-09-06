# Architecture and Testing

## Request Flow

Requests enter through `src/app.ts`, which configures JSON parsing, CORS, static file serving, rate limiting, routes, not-found handling, and the global error handler.

Feature modules follow this layered flow:

```text
route → middleware → controller → service → repository → Drizzle schema
```

- **Routes** define HTTP paths, apply middleware (rate limiter, auth, multer), and forward to controllers.
- **Middleware** handles cross-cutting concerns: authentication (`requireAdmin`), rate limiting, file uploads (`upload.ts`), error mapping, and 404 responses.
- **Controllers** translate HTTP input and output. They do not contain business logic.
- **Services** validate input (via Zod schemas), enforce business rules, and coordinate repositories. This is the preferred unit-test boundary.
- **Repositories** contain all Drizzle ORM queries and return plain data objects.
- **Schemas** define database-backed Zod validators for each module, co-located with the module they serve.

## Upload Architecture

All file uploads are routed through `src/middlewares/upload.ts`, which exports typed Multer instances using `diskStorage`. Files are written directly to the correct subdirectory without an extra write step in the controller.

```text
UPLOAD_DIR/          (default: ./uploads, override with UPLOAD_DIR env var)
├── receipts/        payment receipt screenshots — admin-read-only
├── gallery/         tournament photos and media — public
└── misc/            catch-all for other uploads — public
```

All three subdirectories are created at server startup via `mkdirSync`. The base path and subdir constants are defined in `src/utils/local-storage.ts` and imported by `upload.ts`.

### Multer Instances

| Export | Destination | Size limit | Accepted types |
| --- | --- | --- | --- |
| `uploadReceipt` | `receipts/` | 5 MB | PNG, JPEG, WebP |
| `uploadGallery` | `gallery/` | 20 MB | Images, MP4, WebM |

Filenames follow `<fieldname>-<timestamp>-<random>.<ext>` (e.g. `receipt-1725518232-483920183.jpg`).

### Gallery Post-Processing

Gallery images are converted to WebP after multer writes the original file to disk. `gallery.service.createMedia` reads the file via `sharp(file.path)`, resizes to a maximum of 1920×1080, converts to WebP at quality 80, writes the result back, and removes the original if the filename changed. Non-image gallery files (MP4, WebM) are left as uploaded.

### Receipt Storage

Receipt files are stored as uploaded (no conversion). The `uploadReceipt` controller reads `req.file.filename`, calls `getUploadUrl("receipts", filename)` to produce a relative path such as `/uploads/receipts/receipt-1725518232-483920183.jpg`, and returns it in the response. That path is what the client submits as `paymentReceiptUrl`.

### Static Route Access Control

`app.ts` mounts one `express.static` handler per subdirectory. The `receipts` route is protected by `requireAdmin`:

```ts
app.use("/uploads/receipts", requireAdmin, express.static(...));
app.use("/uploads/gallery",  express.static(...));
app.use("/uploads/misc",     express.static(...));
```

## Authentication

Admin access uses a static Bearer token checked by `requireAdmin` (`src/middlewares/auth.ts`). It is not JWT or session-based. Keep `ADMIN_API_KEY` out of logs and client-side code.

## Testing Strategy

The backend uses Bun's built-in test runner. Essential coverage currently targets:

- Admin token acceptance and rejection.
- Consistent malformed JSON, validation, application, unknown-error, and not-found responses.
- Async error forwarding.
- Fixture, standing, contact, and registration schema rules, including defaults and invalid input.

Run tests from `backend/` with `bun test`. Add repository fakes for service tests and temporary database integration tests only when behavior depends on Drizzle transactions, relations, migrations, or foreign keys. Do not treat a test that imports and mutates the development database as an isolated unit test.

## Extension Rules

Keep new business rules in services, validate request data before persistence, use transactions for multi-step writes, add new upload categories to `upload.ts` and the corresponding static route in `app.ts`, and document public routes in `docs/api.md`. Update tests when changing status codes, error shapes, authentication behaviour, or schema defaults.
