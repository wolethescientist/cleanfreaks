# CleanFreaks booking

Booking site for CleanFreaks by Henam Facility Management (Lagos). Built with Next.js (App Router), Tailwind v4 and framer-motion.

## Flow
1. **Plan** – pick a cleaning plan (`src/constants/plans.ts`) or the per-rug **Rug Washing** pickup service.
2. **Schedule** – pick date(s) and a time slot (`src/constants/schedule.ts`).
3. **Details** – name, email, phone, address, accept the T&Cs.
4. **Payment** – bank transfer details, then confirm the receipt via WhatsApp.

Bookings are appended to a Google Sheet (`Sheet1!A:K`) and the same sheet is read back to work out slot availability.
All pricing, plan names and limits are resolved server-side from the catalogue (`src/lib/booking.ts`) — the client only sends the plan id, quantity, dates, slot and customer details.

## Environment variables (`.env.local`)
| Variable | Purpose |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID` | Google Sheets storage |
| `RESEND_API_KEY`, `SENDER_EMAIL`, `ADMIN_EMAIL` | Optional – emails are skipped when unset |

`node test-sheets.mjs` checks the Sheets connection.

## Development
```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```
