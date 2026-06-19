# Stripe and SendGrid setup

## Stripe

Set these backend variables:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=gbp
```

Set the frontend variable:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

The webhook endpoint is:

```text
POST /api/payments/webhook
```

For local Stripe CLI testing:

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

## SendGrid

Set:

```env
SENDGRID_API_KEY=SG...
EMAIL_FROM=noreply@cotecae.com
EMAIL_FROM_NAME=COTECAE
```

The sender address or domain must be verified in SendGrid. Without credentials,
email calls are logged and skipped so local development remains usable.
