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
| GET | `/gallery` | List gallery media, optionally filtered by category |
| GET | `/gallery/:id` | Get one gallery item |
| POST | `/contacts` | Submit a contact message |
| POST | `/registrations` | Submit a team registration |
| POST | `/registrations/initiate-payment` | Create a signed eSewa checkout payload |
| POST | `/registrations/verify-payment` | Verify eSewa payment and create a pending registration |

## Admin Routes

Admin routes require `Authorization: Bearer <ADMIN_API_KEY>`. The API key is configured with the `ADMIN_API_KEY` environment variable.

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
| POST | `/gallery` | Upload gallery media using multipart form data |
| PUT/PATCH | `/gallery/:id` | Update gallery metadata |
| DELETE | `/gallery/:id` | Delete gallery media |
| GET | `/contacts` | List contact messages |
| GET | `/registrations` | List registrations |
| PATCH | `/registrations/:id/approve` | Approve a pending registration |
| POST | `/tournaments` | Create a tournament |
| PATCH | `/tournaments/:id` | Update a tournament |
| DELETE | `/tournaments/:id` | Delete a tournament |

## Status Codes

The API uses `200` for successful reads and updates, `201` for creations, `204` for successful deletes where applicable, `400` for invalid input, `401` for missing or invalid admin credentials, `404` for missing resources/routes, `409` for conflicts, and `500` for unexpected failures.

Gallery uploads are stored under the configured upload directory and exposed through the `/uploads` static path. Uploaded image processing is handled by the local storage utility.

## Payment Flow

The payment endpoints are described in [payment-flow.md](payment-flow.md). The payable amount, product code, gateway signature, and eSewa status request are controlled by the backend configuration. The client must not submit an amount to be trusted by the server.
