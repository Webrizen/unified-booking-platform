# Booking domain boundaries

Three service types, all sharing common booking concepts:

* **Marriage Garden** — often venue for events; bookings include `date`, `time-slot`, `package` (catering/addons), deposit rules.
* **Hotel** — bookings with `check-in`, `check-out`, `room-type`, `rooms` count, occupancy.
* **Water Park** — bookings for `date`, time-slot, per-ticket count, capacity-limited groups.

Common needs:

* Availability management
* Pricing & packages/addons
* Taxes & discounts
* Hold & confirm flows (to avoid double-booking)
* Payments + partial payments (deposits)
* Cancellation & refunds
* Vendor payouts

# Booking flow (step-by-step)

1. **Search**: User searches venues by city/date/type. Backend returns availability & packages.
2. **Select**: User picks package/room/time-slot and quantity.
3. **Prebook / Hold**:

   * Server creates a `Bookings` document with `status: pending` and `holdExpiresAt = now + holdTTL` (e.g., 10–15 minutes for online payment).
   * Server reserves inventory: either decrement `Availabilities.reservedCount` within a transaction, or create a `Holds` collection with TTL index (see concurrency).
4. **Create Razorpay Order**:

   * Server calls Razorpay Orders API with `amount` in paise, `receipt` (booking id), and `notes`.
   * Save `razorpayOrderId` in Payments collection.
5. **Client Pays**:

   * Client opens Razorpay checkout with `order_id`.
   * On success, browser gets `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`.
   * Client posts these to `POST /api/bookings/verify` (or you can use webhook flow).
6. **Verify Payment**:

   * Server verifies signature using HMAC SHA256: `hmac_sha256(order_id + "|" + payment_id, RAZORPAY_KEY_SECRET)` and compare to `razorpay_signature`.
   * If valid, capture payment if not auto-captured (Razorpay usually auto-captures if allowed); mark Payment status captured.
   * Change Booking status to `confirmed` and decrement availability permanently (if using holds).
   * Send confirmation email & tickets.
7. **Webhook Fallback**:

   * Also process Razorpay webhook events (`payment.captured`, `payment.failed`) to ensure consistency.
8. **Cancellation/Refund**:

   * User requests cancellation via API.
   * Check cancellation policy and eligibility.
   * If refund needed, create Razorpay refund (server call), update Payment & Booking statuses, notify user.
9. **Payout to Vendor**:

   * Maintain ledger for platform fees/taxes.
   * Admin triggers payout generation; for vendor payouts use your payment provider or Razorpay Payouts (if enabled), or manual bank transfer.

# Concurrency & availability (critical)

Double-booking avoidance is a must.

Options:

1. **MongoDB Transactions (recommended for atomic changes)**

   * Use multi-document transactions (MongoDB replica-set required).
   * For booking confirm: in a single transaction read availability (or hold), ensure capacity >= requested, decrement capacity, create Booking, create Payment.
2. **Holds with TTL**

   * When prebooking, create `Holds` doc and set TTL index to auto-expire. Hold reduces `available` via reservedCount or tracked separately.
   * If hold expires, background job releases (decrements reservedCount).
3. **Unique Reservation Key**

   * For slot-based bookings create a unique compound index on `{venueId, date, startTime, bookingItemRefId, bookingItemUnitIndex}` to enforce uniqueness where applicable (e.g., single exclusive slot).
4. **Optimistic locking**

   * Use a `version` field to check updates (atomic updates with `$inc`).

Recommended: combine **transactions** + **holds**. Use transactions for final confirm and atomic updates.

# Indexing & performance

* Index commonly queried fields: `Venues.location.city`, `Venues.type`, `Availabilities.date`, `Bookings.userId`, `Bookings.vendorId`, `Payments.razorpayOrderId`.
* Text index for venue search on `title`, `description`.
* Use geospatial indexes for location-based search (`2dsphere` on coordinates).
* Pagination with range-based cursors (avoid skip for large offsets).

# Security

* Use HTTPS and secure cookies (SameSite=Strict where appropriate).
* Verify Clerk tokens server-side.
* Rate-limit critical endpoints (bookings, payment-create) — use API gateway or middleware.
* Validate all inputs with Zod/Joi (server-side).
* Sanitize user content (XSS).
* Protect webhooks using signature verification.
* Protect file uploads: generate signed S3 URLs; validate MIME type & max size.

# Testing strategy

* Unit tests for business logic (booking, cancellations, refunds).
* Integration tests with an in-memory MongoDB (or staging Atlas).
* End-to-end tests with Razorpay test keys (sandbox) and mocked responses for edge cases.
* Test concurrency with load tests for same-slot bookings.

# Observability & error handling

* Centralized logging (structured JSON).
* Sentry for exceptions.
* Health endpoint + Prometheus metrics (worker queue depth, DB connections).
* Error codes and consistent API error format.

# Environment variables (essential)

```
MONGODB_URI=mongodb+srv://...:...@webrizen-backend.....mongodb.net
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
SENDER_EMAIL=...@gmail.com
SENDER_EMAIL_PASSWORD_GAPP=...
SMTP_FROM_NAME=...
RAZOR_PAY_KEY_ID=...
RAZOR_PAY_KEY_SECRET=...
```

# Edge cases and business rules (suggested)

* If customer pays but the webhook fails — reconcile by checking payment id and order id; verify via Razorpay Payment fetch API.
* Partial payments: support deposit flows with `depositPercent`.
* Double refund attempts: idempotency check in Refunds collection.
* Overlapping bookings for multi-day bookings: check every date in range for availability.
* Grace period for hold expiry; send reminder email before hold expiry.

# Admin & Financial flows

* Platform commission: store in `Payments` (notes) or a ledger collection.
* Payout schedule: weekly/bi-weekly. Generate payouts by summing vendor earnings minus refunds minus fees.
* Tax compliance: capture GST/PAN details and keep invoices/tax receipts.
* Dispute flow: admin manually marks booking `dispute`, vendor must respond.

# Observations & choices I recommend

* Use **Clerk** for auth (fast, less custom). Clerk integrates well with Next.js.
* Use **MongoDB transactions** for booking confirmation (requires replica set — Atlas).
* Use **Razorpay Orders + Webhooks**; always verify server-side.
* Use **Redis + BullMQ** for background work; do not send email directly in request handlers.
* Keep business logic in service layer (`/lib/services/bookingService.js`) and keep route handlers thin.
* Write thorough tests around concurrency (simulate many users booking same slot).
* Start with **one canonical Booking model** that supports all three venue types and expand with small type-specific subdocuments where necessary.

# Quick checklist to start implementing (milestones)

1. Project bootstrap: Next.js 15 + `connectToDB` + Clerk + dev env.
2. Implement core models: Users/Vendors/Venues/Availabilities/Bookings/Payments.
3. Implement `GET /venues` & `GET /venues/:id` and search UI hooks to validate schema.
4. Implement availability endpoints + vendor UI for adding slots/room types.
5. Implement prebook + hold flow (DB and TTL holds).
6. Integrate Razorpay Orders API + `create-order` endpoint.
7. Implement payment verification + webhook handler + signature verification.
8. Setup Nodemailer + queue and sample booking confirmation template.
9. Add unit/integration tests & concurrency tests.
10. Add admin endpoints (payouts, refunds) and monitoring (Sentry).
11. Deploy staging (Vercel) + Atlas + Redis provider for queue workers.
12. Load testing and hardening.

---

If you want, I can now:

* generate **complete Mongoose schemas** for all models above, or
* produce **detailed route handlers** (Next.js route handler files) for the booking & payment flow (including Razorpay signature verification code and `connectToDB` usage), or
* create a **sequence diagram** or a **Postman collection** listing every endpoint with request/response examples.

Tell me which of those to produce next and I’ll generate it immediately (I won’t ask clarifying questions — I’ll pick sensible defaults if you don’t).


---

## Stack

* **Next.js 15 App Router** (API in `/app/api/...`)
* **MongoDB (Atlas)** with `connectToDB`
* **Clerk** for auth (users, vendors, admin roles)
* **Razorpay** for payments (Orders + Webhooks)
* **Nodemailer** for emails
* **Redis + BullMQ** (optional) for email/jobs

---

## Roles

* **Customer**: search, book, pay, cancel
* **Vendor**: manage venues, slots, bookings
* **Admin**: payouts, disputes, global control

---

## Collections (MongoDB)

1. **Users** → id, role (customer/vendor/admin), email, phone
2. **Vendors** → userId, businessName, payout details
3. **Venues** → vendorId, type (garden/hotel/waterpark), title, desc, location, pricing, images
4. **RoomTypes** (for hotels) → venueId, title, totalRooms, price
5. **Availabilities** → venueId, date, slots/rooms/tickets, capacity, reservedCount
6. **Bookings** → userId, venueId, status (pending/confirmed/cancelled), items, totalAmount, paymentId
7. **Payments** → razorpayOrderId, paymentId, bookingId, status (created/captured/refunded)
8. **Coupons** → code, type, value, validity
9. **Refunds / Payouts** → paymentId/vendorId, amount, status
10. **Notifications** → userId, type, channel, payload, status

---

## APIs (main ones)

### Venues

* `GET /api/venues` → list/search
* `GET /api/venues/:id` → details
* `POST /api/venues` → create (vendor)
* `PUT /api/venues/:id` → update (vendor)

### Availability

* `GET /api/venues/:id/availability`
* `POST /api/venues/:id/availability`

### Bookings

* `POST /api/bookings/prebook` → create pending booking + hold
* `POST /api/bookings/:id/pay` → create Razorpay order
* `POST /api/bookings/verify` → verify Razorpay signature
* `PUT /api/bookings/:id/cancel` → cancel + refund
* `GET /api/bookings/:id` → booking status

### Payments

* `POST /api/payments/create-order` → Razorpay order
* `POST /api/payments/webhook` → Razorpay webhook (update booking/payment)
* `POST /api/payments/:id/refund` → refund

### Admin

* `GET /api/admin/bookings`
* `POST /api/admin/payouts`

---

## Flow

1. User searches venues → picks date/slot/package
2. Call `prebook` → booking pending + hold slot
3. Call `pay` → server creates Razorpay order → client pays
4. Client sends paymentId/orderId/signature → `verify`
5. Server verifies → update booking to **confirmed**, send email
6. Razorpay webhook also updates status (backup)
7. On cancel → check policy → refund via Razorpay → update DB + email

---

## Razorpay

* Use server-side to create Orders (`amount` in paise)
* Verify signature with secret key
* Handle webhooks for `payment.captured`, `payment.failed`, `refund.processed`

---

## Emails

* Nodemailer with SMTP (SendGrid/Mailgun/SES)
* Templates: booking confirm, cancel, refund
* Send via queue (optional)

---

## File Structure

```
/app/api/venues/...
/app/api/bookings/...
/app/api/payments/...
/lib/db.js
/lib/razorpay.js
/lib/mailer.js
/models/*.js
```

---