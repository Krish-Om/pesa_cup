# Payment Flow

The registration payment flow uses static merchant QR codes and manual receipt upload. There is no automated gateway redirect or server-side payment verification.

## Steps

### 1. Fill in Team Details

The user opens `/register` and completes the team registration form:

- Team name
- Captain name, email, and phone
- Number of players
- Alumni batch year

### 2. Scan QR Code and Pay

The registration page displays static eSewa and Fonepay merchant QR codes side by side. The user scans the appropriate QR code with their payment app and completes the transfer.

### 3. Upload Payment Receipt

After payment, the user screenshots the confirmation screen in their payment app and uploads it using the dropzone on the registration page.

**Upload endpoint:** `POST /api/v1/registrations/upload-receipt`  
**Content-Type:** `multipart/form-data`, field name `receipt`  
**Accepted:** PNG, JPEG, WebP — maximum 5 MB  
**Response:**

```json
{ "url": "/uploads/receipts/receipt-1725518232-483920183.jpg" }
```

The file is written to `uploads/receipts/` by Multer diskStorage before the controller runs. The controller reads `req.file.filename`, builds the relative path with `getUploadUrl("receipts", filename)`, and returns it. No image conversion is applied to receipts.

The `/uploads/receipts/*` static route is protected by `requireAdmin`, so the stored file is not publicly accessible via browser URL. The admin reviews it through an authenticated request.

### 4. Submit Registration

The frontend posts the completed payload to `POST /api/v1/registrations`:

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

`transactionCode` is optional — it is the transaction reference copied from the payment app.

The backend validates the payload with `insertRegistrationSchema` (Zod), sets `status: "PENDING"`, and inserts the row. A `201 Created` response is returned.

The frontend replaces the form with a confirmation view showing the team name, captain, and batch year, along with a "Pending Approval" status badge.

### 5. Admin Approval

An admin reviews the registration and the uploaded receipt at `GET /api/v1/registrations` (admin only), then approves it via `PATCH /api/v1/registrations/:id/approve`.

The approval runs as a single database transaction:

1. Inserts a row into `teams` using the registration details.
2. Updates the registration to `status: "APPROVED"` and links `teamId`.
3. Inserts a `standings` row for the new team.

If any step fails, the transaction rolls back.

## QR Code Setup

Place static QR code images in `frontend/public/qr/`:

- `frontend/public/qr/esewa-qr.png`
- `frontend/public/qr/fonepay-qr.png`

Then uncomment the `<img>` tags in `src/pages/Registration.jsx` inside the two `.qr-placeholder` divs.

## Receipt Confidentiality

Because receipts contain payment screenshots, the `/uploads/receipts/*` static path requires an admin Bearer token. The admin UI must fetch receipt images using:

```js
fetch("/uploads/receipts/receipt-1725518232-483920183.jpg", {
  headers: { Authorization: `Bearer ${ADMIN_API_KEY}` },
});
```

Once S3 is introduced (see project TODO), receipts will be stored in a private bucket and accessed via pre-signed URLs with a short TTL.
