# Payment Flow

## 1. Initiation

`POST /api/v1/registrations/initiate-payment`

The user fills out the registration form on your site, including the team name, captain information, and batch year.

Before taking any money, the frontend calls your server. The server generates a unique `transactionUuid` (for example, `pesa-cup-1725518232`) and calculates an HMAC-SHA256 signature using `ESEWA_SECRET_KEY`. The server sends this signed payload back to the frontend.

## 2. Redirect to the eSewa Gateway

The frontend receives the signature and automatically submits a POST form to the eSewa payment portal:

<https://rc-epay.esewa.com.np/api/epay/main/v2/form>

Because the parameters are cryptographically signed by the backend key, eSewa knows that the payment amount and merchant details cannot be tampered with by the user.

## 3. Payment Execution

The user logs into eSewa and completes the payment. Once successful, eSewa redirects the user back to the frontend's `success_url` with an encoded Base64 string in the URL parameters containing the payment result.

## 4. Server-Side Verification

`POST /api/v1/registrations/verify-payment`

The frontend extracts the Base64 response and sends it, along with the complete registration form details, to the backend.

The backend calls eSewa's Status Check API directly at `/api/epay/transaction/status/` to verify that:

- The payment status is `COMPLETE`.
- The `total_amount` paid matches the registration fee.
- The `transaction_uuid` exists and has not been reused.

## 5. Database Record Creation

Once eSewa confirms the payment server-side, the backend inserts a new record into the `registrations` table with status `PENDING`, saving the `transactionUuid` and `transactionCode`. When an admin later reviews and approves the registration, the server creates the official team record inside a database transaction.
