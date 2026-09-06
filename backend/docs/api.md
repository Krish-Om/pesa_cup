# API Reference

Base URL: `/api/v1`

Successful responses use the resource-specific JSON shape returned by the controller. Errors use:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

## Public Routes

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Service health check |
| GET | `/tournament` | Tournament metadata and summary |
| GET | `/tournaments` | List tournaments |
| GET | `/tournaments/:id` | Get one tournament |
| GET | `/fixtures` | List fixtures |
| GET | `/fixtures/:id` | Get one fixture |
| GET | `/standings` | List standings |
| GET | `/standings/:id` | Get one standing |
| GET | `/scorers` | List scorers |
| GET | `/scorers/:id` | Get one scorer |
| GET | `/gallery` | List gallery media, optionally filtered by `?category=` |
| GET | `/gallery/:id` | Get one gallery item |
| POST | `/contacts` | Submit a contact message |
| POST | `/registrations/upload-receipt` | Upload a payment receipt screenshot — returns `{ url }` |
| POST | `/registrations` | Submit a completed team registration |

## Admin Routes

Admin routes require `Authorization: Bearer <ADMIN_API_KEY>`. The key is set via the `ADMIN_API_KEY` environment variable.

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/fixtures` | Create a fixture |
| PUT/PATCH | `/fixtures/:id` | Update a fixture |
| POST | `/standings` | Create a standing |
| PUT/PATCH | `/standings/:id` | Update a standing |
| DELETE | `/standings/:id` | Delete a standing |
| POST | `/scorers` | Create a scorer |
| PATCH | `/scorers/:id` | Update a scorer |
| DELETE | `/scorers/:id` | Delete a scorer |
| POST | `/gallery` | Upload gallery media (`multipart/form-data`, field `file`) |
| PUT/PATCH | `/gallery/:id` | Update gallery metadata |
| DELETE | `/gallery/:id` | Delete gallery media and its file on disk |
| GET | `/contacts` | List contact messages |
| GET | `/registrations` | List all registrations |
| PATCH | `/registrations/:id/approve` | Approve a pending registration (creates team + standings row atomically) |
| PATCH | `/registrations/:id/reject` | Reject a pending registration and record an optional `rejectionReason` |
| POST | `/tournaments` | Create a tournament |
| PATCH | `/tournaments/:id` | Update a tournament |
| DELETE | `/tournaments/:id` | Delete a tournament |

## Static File Serving

Uploaded files are served from subdirectory-scoped static routes. The `UPLOAD_DIR` environment variable sets the root (default: `./uploads`).

| URL prefix | Directory | Access |
| --- | --- | --- |
| `/uploads/receipts/*` | `uploads/receipts/` | **Admin only** — requires `Authorization: Bearer <ADMIN_API_KEY>` |
| `/uploads/gallery/*` | `uploads/gallery/` | Public |
| `/uploads/misc/*` | `uploads/misc/` | Public |

> Because receipt files contain sensitive payment data, browser `<img src="/uploads/receipts/...">` requests will receive a `401` without the correct Bearer token. The admin UI must fetch receipts via authenticated `fetch` calls or use pre-signed URLs once S3 is introduced.

## Registration — `POST /registrations/upload-receipt`

**Accepts:** `multipart/form-data`, field name `receipt`
**Constraints:** PNG, JPEG, or WebP only; maximum 5 MB
**Returns:**

```json
{ "url": "/uploads/receipts/receipt-1725518232-483920183.jpg" }
```

The returned relative path is what the client stores and later submits as `paymentReceiptUrl` in `POST /registrations`.

## Registration — `POST /registrations`

**Body (JSON):**

```json
{
  "tournamentId": 1,
  "teamName": "CSIT Strikers",
  "captainName": "Rohan KC",
  "captainEmail": "rohan@example.com",
  "captainPhone": "9800000001",
  "playerCount": 7,
  "batchYear": "2021",
  "paymentReceiptUrl": "/uploads/receipts/receipt-1725518232-483920183.jpg",
  "transactionCode": "ABC123XYZ"
}
```

`transactionCode` is optional. The registration is created with status `PENDING` and must be approved by an admin.

## Status Codes

`200` — successful read or update
`201` — resource created
`204` — successful delete
`400` — invalid input
`401` — missing or invalid admin credentials
`404` — resource or route not found
`409` — conflict (e.g. duplicate submission)
`500` — unexpected server error
