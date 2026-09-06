# Backend TODO

## Completed

- [x] Add Bun unit-test coverage for middleware and representative schemas.
- [x] Implement registration flow with team details form and payment receipt upload.
- [x] Upload receipts to `uploads/receipts/` via `POST /registrations/upload-receipt`.
- [x] Separate upload directory structure: `receipts/`, `gallery/`, `misc/`.
- [x] Central Multer diskStorage middleware in `src/middlewares/upload.ts`.
- [x] Per-subdirectory static routes in `app.ts`; receipts protected by `requireAdmin`.
- [x] Gallery post-processing: sharp converts uploaded images to WebP in-place.
- [x] Atomic approval transaction: inserts team and standings row in a single DB transaction.
- [x] Add local API documentation and architecture notes.

## Before Production

- [ ] Add real QR code images to `frontend/public/qr/` (eSewa and Fonepay merchant codes).
- [ ] Add an HTTP integration test using a temporary SQLite database.
- [ ] Replace the static admin Bearer key with a managed authentication system before multi-admin use.
- [ ] Add pagination to list endpoints that can grow unbounded (`/registrations`, `/gallery`).
- [ ] Move `ADMIN_API_KEY` presence check to server startup so the server refuses to boot without it.

## Upload / Storage

- [ ] Migrate receipt storage to a private S3 bucket and serve via pre-signed URLs with a short TTL.
- [ ] Migrate gallery storage to a public S3 bucket and update `mediaUrl` to the CDN URL.
- [ ] Add MinIO service to `compose.yml` for local S3-compatible development (see root `README.md` TODO).
- [ ] Add receipt file cleanup on registration rejection to avoid orphaned files.
- [ ] Add file-type validation using magic-byte inspection (not just MIME type from the client).

## Operational Follow-up

- [ ] Add structured audit logs for registration submissions and approvals.
- [ ] Add rate-limit and abuse monitoring for the receipt upload and registration submission endpoints.
- [ ] Keep `ADMIN_API_KEY` outside source control and rotate any exposed development credentials.
