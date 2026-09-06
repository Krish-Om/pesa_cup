# Pesa Cup Backend Verification Report

**Scope:** `pesa_cup/backend/` — database schema, upload architecture, registration/payment flow, approval transaction, API structure, validation, and security. SSE/real-time features are explicitly excluded.

**Method:** Static code review of every file in `src/`, `drizzle/`, and `tests/`; live verification via `bun test`, a clean `bun run db:migrate` against a fresh SQLite file, and direct inspection of the resulting on-disk schema (`sqlite_master`). No source files were modified during this audit.

**Audit date:** 2026-09-06

---

## 1. Executive Summary

| Status | Count | Meaning |
| :--- | :---: | :--- |
| ✅ Passed | 8 | Fully implemented and verified against source and runtime evidence |
| ⚠️ Needs Attention | 6 | Implemented but with a functional, security, or architectural gap |
| ❌ Missing | 0 | No fully absent requirement |

**Headline finding:** The core requirement set — relational schema integrity, receipt-upload directory isolation, the atomic approval transaction, and removal of eSewa from the live registration flow — is **correctly implemented and verified on disk**. However, the refactor left behind **stale test coverage that currently fails/errors** (`bun test` confirmed 2 failing/erroring files), a **shared rate-limit bucket** across unrelated public/admin routes instead of a dedicated registration limiter, a **missing rejection endpoint** for the `REJECTED` status the schema already supports, and a **`.gitignore` gap** that does not exclude the new `uploads/` directory. None of these block core functionality, but all should be resolved before production sign-off.

---

## 2. Requirement Check Matrix

| Requirement | Status | File Location(s) | Notes |
| :--- | :---: | :--- | :--- |
| Alumni Eligibility (`batchYear`) | **Pass** | `src/db/schema.ts` (`teams.batchYear`, `registrations.batchYear`) | Both columns are `text(...).notNull()`. Verified on-disk via `sqlite_master` after a clean migration. |
| Receipt Upload Isolation | **Pass** | `src/middlewares/upload.ts`, `src/utils/local-storage.ts`, `src/app.ts` | `receipts/`, `gallery/`, `avatars/`, `misc/` are physically separate `diskStorage` destinations; `/uploads/receipts` is the only static route gated by `requireAdmin`. |
| Legacy eSewa Removal | **Needs Attention** | `src/db/schema.ts`, `src/modules/registrations/*`, `tests/payment.test.ts`, `tests/schemas.test.ts` | Fully removed from the active schema/service/controller/routes/repository and excluded from the TS build (`tsconfig.json` excludes `*.archived`). **But** the archived file still lives inside `src/modules/registrations/`, and two test files still reference the old shape — `bun test` currently fails/errors because of this (see §4). |
| Atomic Approval Transaction | **Pass** | `src/modules/registrations/registrations.service.ts` (`approve`) | Single `dbSession.transaction(...)` performs: create `teams` row → update `registrations.status="APPROVED"` + `teamId` → insert zero-state `standings` row. Rolls back on any failure. |
| Relational Schema Integrity | **Pass** | `src/db/schema.ts`, `src/db/relations.ts` | `fixtures`, `standings`, `scorers` all `references(() => teams.id)`; cascade/set-null behavior verified in generated SQL and confirmed against the live SQLite file. |
| Public Rate Limiting & Admin Auth | **Needs Attention** | `src/middlewares/rate-limiter.ts`, `src/middlewares/auth.ts`, all `*.routes.ts` | `requireAdmin` is consistently applied to every admin route. Rate limiting exists on every public route, but there is no dedicated `registrationLimiter` — registration endpoints share a single `contactFormLimiter` instance whose counter bucket is **also shared with unrelated admin write routes** across every other module (see §4). |

---

## 3. Detailed Findings by Module

### 3.1 Database & Drizzle Schemas (`src/db/`)

**`schema.ts`**
- `teams`: `id, name, logo, captainName, captainEmail, captainPhone, batchYear (NOT NULL), createdAt`. No FK dependency on anything else — correct root entity.
- `registrations`: `tournamentId → tournaments.id (cascade)`, `teamId → teams.id (set null)`, `batchYear NOT NULL`, `paymentReceiptUrl NOT NULL`, `transactionCode` nullable, `status` defaults to `"PENDING"` (plain `text()` column, not a DB-level `CHECK` enum — enum enforcement is Zod-only, see §4). All legacy eSewa columns (`paymentMethod`, `transactionUuid`, `amountPaid`) are **absent**. The old `registrations_transaction_uuid_unique` index is also gone.
- `fixtures`: `homeTeamId → teams.id`, `awayTeamId → teams.id`, `tournamentId → tournaments.id (cascade)`. Correctly relational; two independent team FKs allow home/away distinction.
- `standings`: `teamId → teams.id (cascade)`, `tournamentId → tournaments.id (cascade)`, numeric fields (`played`, `won`, `draw`, `lost`, `goalFor`, `goalAgainst`, `goalDifference`, `points`) all `NOT NULL DEFAULT 0` — this is what allows the approval transaction to seed a "zero-state" row by simply omitting these fields.
- `scorers`: `teamId → teams.id (cascade)`, `tournamentId → tournaments.id (cascade)`.
- `galleryPhotos.categoryId → galleryCategories.id` with `onDelete: "cascade", onUpdate: "cascade"`.

**Live verification:** After running `bun run db:migrate` against a fresh database, `sqlite_master` was queried directly:
```
registrations: id, tournament_id, team_name, captain_name, captain_email,
  captain_phone, player_count, batch_year, transaction_code,
  payment_receipt_url (NOT NULL), status (DEFAULT 'PENDING' NOT NULL),
  rejection_reason, team_id, created_at
  FK tournament_id → tournaments(id) ON DELETE cascade
  FK team_id → teams(id) ON DELETE set null
```
No leftover `transaction_uuid` unique index exists. This matches the schema source exactly — **no drift between Drizzle schema and the applied migration.**

**`relations.ts`** — declares `one`/`many` relations for every FK pair above (`teamsRelations`, `registrationsRelations`, `fixturesRelations`, `standingsRelations`, `scorersRelations`, `galleryCategoriesRelations`/`galleryPhotosRelations`). Consistent with the schema; no orphaned relation declarations.

**`config/database.ts`** — opens `bun:sqlite`, enables `PRAGMA journal_mode=WAL`, `PRAGMA foreign_keys=ON`, `PRAGMA busy_timeout=5000`. This is what makes the `onDelete` cascade/set-null behavior actually enforced at the SQLite engine level for the app's connection (see §4 for a caveat on this pragma being connection-scoped, not persisted).

**Migration chain (`drizzle/`)** — three migrations: `0000` (initial schema), `0001` (added the now-removed `transaction_uuid` unique index), `0002` (recreates `registrations` via SQLite's copy-and-rename pattern to drop `payment_method`/`transaction_uuid`/`amount_paid` and enforce `payment_receipt_url NOT NULL`). Verified this chain applies cleanly end-to-end on a **fresh** database. See §4 for a data-migration risk on databases with pre-existing legacy rows.

### 3.2 Uploads Middleware (`src/middlewares/upload.ts`, `src/utils/local-storage.ts`)

- Three typed `multer.diskStorage` instances: `uploadReceipt` (5 MB, PNG/JPEG/WebP → `receipts/`), `uploadGallery` (20 MB, images + MP4/WebM → `gallery/`), `uploadAvatar` (2 MB, any image → `avatars/`). Filenames follow `<fieldname>-<timestamp>-<random>.<ext>`.
- `local-storage.ts` centralizes `BASE_UPLOAD_DIR` (`UPLOAD_DIR` env var, default `./uploads`) and `UPLOAD_SUBDIRS` (`receipts`, `gallery`, `avatars`, `misc`); all four subdirectories are `mkdirSync`'d recursively at import time — verified no manual directory setup is required.
- `app.ts` mounts one `express.static` per subdirectory. `/uploads/receipts` is the **only** one wrapped in `requireAdmin`; `/uploads/gallery`, `/uploads/avatars`, `/uploads/misc` are public. No duplicate or legacy `/uploads` catch-all route remains (`grep` confirmed a single set of four scoped mounts).
- **Registration controller** (`registrations.controller.ts`) does zero extra I/O for receipts — it reads `req.file.filename` (already written to disk by `uploadReceipt`) and returns `getUploadUrl("receipts", filename)`, a relative path like `/uploads/receipts/receipt-<ts>-<rand>.jpg`.
- **Gallery service** (`gallery.service.ts`) post-processes uploaded images with `sharp` (resize ≤1920×1080, convert to WebP q80), replacing the original file in place and updating `fileKey`/`mediaUrl` accordingly; non-image gallery uploads (MP4/WebM) are stored as-is.
- **Gap:** `uploadAvatar` is fully implemented but **not wired to any route** — `scorers.avatar` is currently just a validated URL string (`z.string().url()`), not a file-upload field. The `avatars/` subdirectory will remain empty until an avatar-upload endpoint is added.

### 3.3 Registration & Approval Flow (`src/modules/registrations/`)

- **`registrations.schema.ts`** — `insertRegistrationSchema` requires `paymentReceiptUrl: z.string().min(1, ...)` (a relative path, not a URL-format check — intentionally loosened after the eSewa→static-QR refactor since the app now stores `/uploads/receipts/...` paths, not absolute URLs) and `batchYear: z.string().min(1, ...)`. `transactionCode` is `optional().nullable()`. No `paymentMethod`, `transactionUuid`, or `amountPaid` fields remain anywhere in this file.
- **`registrations.routes.ts`** — `POST /upload-receipt` (public, `contactFormLimiter` + `uploadReceipt.single("receipt")`), `POST /` (public, create), `GET /` (admin), `PATCH /:id/approve` (admin). No `/initiate-payment` or `/verify-payment` routes exist — confirmed by direct read and by `grep` across `src/`.
- **`registrations.controller.ts` / `.service.ts` / `.repository.ts`** — clean of all eSewa-era logic. `create()` forces `status: "PENDING"`, `teamId: null`, `rejectionReason: null` server-side regardless of client input (client cannot forge an approved registration).
- **Approval transaction (`approve()`)** — verified step-by-step:
  1. `dbSession.transaction(async (tx) => {...})` wraps the entire operation.
  2. Fetches the registration by ID; throws `NotFoundError` (404) if missing, `AppError` (409) if not `PENDING` — prevents double-approval.
  3. `tx.insert(teams).values({...})` using `teamName`, `batchYear`, captain fields from the registration.
  4. `tx.update(registrations).set({ status: "APPROVED", teamId: team.id, rejectionReason: null })`.
  5. `tx.insert(standings).values({ tournamentId, teamId: team.id, group })` — omits all numeric fields, relying on `NOT NULL DEFAULT 0` at the schema level to produce a genuine zero-state row.
  6. Any thrown error (including the two explicit guard checks) rolls back the entire transaction because it's inside the `tx` callback.
- **Gap:** There is no `REJECTED` counterpart. The schema supports `status: "REJECTED"` and a `rejectionReason` string field, but no route/controller/service method ever sets them — an admin can only approve, never formally reject, a pending registration.

### 3.4 API & Security

- **Error handling** — `errorHandler` produces one consistent JSON shape (`{ success, message, errors }`) for malformed JSON (400), `ZodError` (400, field-mapped), `AppError` (its own `.status`), and unknown errors (500). `notFoundHandler` returns a consistent 404 shape. `asyncHandler` wraps every controller to forward rejected promises to `next()`. **Verified by test**: 4/4 tests in `tests/middleware.test.ts` pass at runtime (one has an unrelated strict-mode TS diagnostic, see §4).
- **Admin auth** — `requireAdmin` checks `Authorization: Bearer <ADMIN_API_KEY>` and is applied via `router.use(requireAdmin)` (or per-route) consistently across `fixtures`, `standings`, `scorers`, `gallery`, `contacts`, `registrations`, and `tournaments`. Verified by test: token rejection/acceptance behavior passes.
- **Rate limiting** — `apiReadLimiter` (100 req/min) on all public `GET` routes; `contactFormLimiter` (10 req/15 min) on all public/admin write routes. Every public `POST` (`/contacts`, `/registrations`, `/registrations/upload-receipt`) carries a limiter. **However**, see §4 for the shared-bucket issue this creates.
- **CORS** — configurable via `ALLOWED_ORIGINS`, defaults to the two local dev origins; `*` opt-in supported.
- **Logging** — `pino` with `redact: ['req.headers.authorization', 'password', 'creditCard', 'OTP']`, preventing `ADMIN_API_KEY` and other secrets from leaking into logs via the Authorization header.

---

## 4. Discrepancies & Recommendations

1. **Test suite is currently broken** (`bun test` run as part of this audit):
   - `tests/payment.test.ts` imports `../src/modules/registrations/payment.service`, which no longer exists at that path (archived to `payment.service.ts.archived`). Result: `error: Cannot find module ... from '.../tests/payment.test.ts'` — an unhandled module-resolution error that aborts the whole file.
   - `tests/schemas.test.ts` → `"applies registration payment defaults and validates required fields"` still builds a payload with `transactionUuid`/`amountPaid` and omits the now-required `paymentReceiptUrl`. Result: a real `ZodError` thrown at test time (`expected: "string", path: ["paymentReceiptUrl"], message: "Invalid input: expected string, received undefined"`), causing that test to fail.
   - **Actual run output:** `7 pass, 2 fail, 1 error` across 3 files.
   - **Recommendation:** Delete `tests/payment.test.ts` (its subject no longer exists) and rewrite the stale case in `tests/schemas.test.ts` to assert the new required fields (`paymentReceiptUrl`, optional `transactionCode`) instead of the old eSewa shape. Add a new test asserting `paymentReceiptUrl` is required and `transactionCode` is optional/nullable.

2. **No dedicated `registrationLimiter`, and the generic limiter's bucket is shared across unrelated routes.** `contactFormLimiter` is declared once in `rate-limiter.ts` and imported as the *same middleware instance* into `contacts`, `registrations` (×2 routes), `fixtures`, `standings`, `scorers`, `gallery`, and `tournaments`. `express-rate-limit`'s default key is `req.ip` only — it does not scope by route. This means a single client IP shares **one combined 10-requests-per-15-minutes budget across every one of those endpoints**, public and admin alike. An admin approving several registrations or uploading several gallery photos in a short session could be throttled by unrelated public contact-form traffic from the same NAT/IP, or vice versa.
   - **Recommendation:** Create a distinct `registrationLimiter` (and ideally a distinct limiter per admin-write surface, or key admin routes by API key instead of IP) rather than reusing one shared instance everywhere.

3. **Missing rejection path.** `registrations.status` supports `"REJECTED"` and the table has a `rejectionReason` column, but no route/controller/service exists to ever transition a registration into that state. Operationally, a pending registration can only ever become `APPROVED` — there's no way to formally reject a fraudulent/duplicate submission (it just stays `PENDING` forever, or an admin must resort to manual SQL).
   - **Recommendation:** Add `PATCH /registrations/:id/reject` mirroring `approve`, setting `status: "REJECTED"` and `rejectionReason` from an admin-supplied message.

4. **Archived payment service sits inside the active module directory.** `src/modules/registrations/payment.service.ts.archived` is excluded from the TypeScript build (`tsconfig.json` → `"exclude": ["**/*.archived"]`) but still contains a fully wired `ESEWA_SECRET_KEY`-dependent HMAC signing and verification implementation, physically located inside `src/`. It is dead code that could be mistakenly restored (e.g., a stray rename) and reintroduce the removed payment gateway.
   - **Recommendation:** Move it out of `src/` entirely (e.g., `docs/archive/payment.service.ts.bak`) or delete it outright now that git history preserves it.

5. **`.gitignore` does not exclude the new `uploads/` directory.** The gitignore covers `data/`, `*.sqlite`, `*.db`, etc., but has no entry for `uploads/` (or `$UPLOAD_DIR`). Since `BASE_UPLOAD_DIR` defaults to `./uploads` inside the repo when `UPLOAD_DIR` is unset, payment receipts, gallery photos, and avatars could be accidentally committed.
   - **Recommendation:** Add `uploads/` to `backend/.gitignore`.

6. **Migration `0002` is not safe against pre-existing legacy data.** The migration recreates `registrations` and copies existing rows into a `payment_receipt_url NOT NULL` column with no `DEFAULT` or backfill. Verified: this migration applies cleanly on a **fresh** database, but if run against any database that already has `registrations` rows from before this refactor (i.e., real eSewa-era rows with `payment_receipt_url IS NULL`), it will fail with `SQLITE_CONSTRAINT_NOTNULL` (reproduced during earlier development of this feature).
   - **Recommendation:** Before deploying to any environment with existing data, either backfill a placeholder value for `payment_receipt_url` first, or ship a pre-migration data-repair script.

7. **`PRAGMA foreign_keys = ON` is connection-scoped, not persisted in the file.** The app correctly sets this pragma on its own `bun:sqlite` connection at startup, so cascade/set-null behavior works for all app traffic. However, this is not a durable database setting — any other tool (e.g., a raw `sqlite3` CLI session, an ad-hoc script, or a future admin utility) that opens the same file without explicitly issuing `PRAGMA foreign_keys = ON` will silently **not** enforce FK constraints.
   - **Recommendation:** Document this requirement wherever direct DB access is described (e.g., `docs/setup.md`), and consider centralizing all raw DB access through `config/database.ts`.

8. **`uploadAvatar` middleware is unused.** Defined with correct limits/filters but never attached to a route. Not a defect, but incomplete — flagged so it isn't mistaken for a wired feature.

9. **Minor pre-existing TypeScript diagnostics** (not introduced by the audited refactor, but present under `strict: true`):
   - `src/middlewares/error-handler.ts:11` — `Property 'status' does not exist on type 'SyntaxError'`. Works at runtime (Express augments the thrown `SyntaxError` with `status`/`body` on JSON parse failure) but is not statically typed; consider a type guard or a narrower cast.
   - `tests/middleware.test.ts:110` — `Object is possibly 'undefined'` when indexing `errors[0]`.

10. **Minor cosmetic bug:** `src/utils/logger.ts` has a typo in the `pino-pretty` transport options — `trnslateTime` instead of `translateTime`. Pino-pretty silently ignores the unrecognized option and falls back to its default timestamp format; no functional impact, but the intended custom format never applies.

11. **`registrations.status` is a plain `text()` column, not a SQLite `CHECK` enum**, unlike `tournaments.status` and `fixtures.status`, which do use `{ enum: [...] }` (Drizzle emits a `CHECK` constraint for those). `registrations.status` relies entirely on the Zod layer (`insertRegistrationSchema`) for enum enforcement — the database itself would accept any string via a raw SQL `UPDATE`. Low risk given all app-level writes go through Zod-validated paths, but inconsistent with the pattern used elsewhere in the same schema file.
    - **Recommendation:** Add `{ enum: ["PENDING", "APPROVED", "REJECTED"] }` to the `status` column definition for defense-in-depth consistent with `fixtures.status`/`tournaments.status`.

---

### Verification Commands Used

```bash
bun test                                    # 7 pass, 2 fail, 1 error (see finding #1)
NODE_ENV=development bun run db:migrate     # migrations apply cleanly on a fresh database
# Direct sqlite_master inspection confirmed column/index state matches schema.ts exactly
```

No code, configuration, or data was modified as part of this audit, apart from the creation of a fresh local development SQLite file (`data/pesa_cup_futsal_dev.db`) as a side effect of running the migration command for verification.
