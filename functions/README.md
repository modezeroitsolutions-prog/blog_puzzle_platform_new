# Cloud Functions (backend)

This folder is intended for **Firebase Cloud Functions** so that:

1. **Razorpay payouts** run only on the server (never expose `RAZORPAY_SECRET` to the client).
2. **Reward validation** and anti-cheat run in a trusted environment.
3. **Referral rewards** are granted when a referred user signs up (trigger on `users` create, check `referredBy`, grant coins to referrer).
4. **Daily leaderboard reset** (scheduled function) if needed.

## Suggested setup

```bash
cd functions
npm init -y
npm install firebase-functions firebase-admin razorpay
```

- **On withdrawal approval:** Use a Firestore trigger on `withdrawals` (when `status` becomes `approved`) or an HTTP/callable function that:
  - Verifies admin
  - Deducts user coins (or mark as paid)
  - Calls Razorpay Payout API with secret key
  - Updates withdrawal `status` to `paid`
- **On user create:** If `referredBy` is set, look up referrer and add coins to their account (and optionally write to `transactions`).

The Next.js app only updates Firestore (e.g. withdrawal status to `approved`). Actual payout is done here.
