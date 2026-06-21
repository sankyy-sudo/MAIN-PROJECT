# Integrations and Cloudflare Foundation

## Configuration

Copy the integration keys from `backend/.env.example` and `frontend/.env.example`.
The admin page at `/integrations` reports whether each required provider env var
is present without exposing secret values.

## Payment Providers

- Stripe is wired through payment intents and webhooks.
- PayPal has a placeholder order endpoint ready for a live capture adapter.
- B2B bank transfer instructions are generated from bank-transfer env values.

## Email and Marketing

- SendGrid is the active email provider.
- Mailgun, Mailchimp, and Klaviyo env keys are reserved for provider adapters.

## Analytics and Pixels

Frontend bootstraps these when env vars are present:

- `VITE_GA4_MEASUREMENT_ID`
- `VITE_GTM_CONTAINER_ID`
- `VITE_META_PIXEL_ID`

## Maps, Social, Security, and Shipping

- Google Maps uses `GOOGLE_MAPS_API_KEY` / `VITE_GOOGLE_MAPS_API_KEY`.
- Instagram Graph API uses `INSTAGRAM_ACCESS_TOKEN` and `INSTAGRAM_BUSINESS_ACCOUNT_ID`.
- reCAPTCHA v3 verification is available at `/api/integrations/recaptcha/verify`.
- DHL, UPS, FedEx, and local shipping env keys are documented and exposed through
  the shipping-rate foundation endpoint for future live carrier adapters.

## Cloudflare Deployment Notes

1. Point DNS records to the production frontend and API hosts.
2. Enable proxy/CDN for frontend records and keep API proxying only if websocket
   or webhook behavior has been tested.
3. Set SSL/TLS mode to Full or Full strict after installing a valid origin cert.
4. Add page rules or cache rules for static frontend assets.
5. Exclude `/api/*` from aggressive caching.
6. Add Stripe webhook paths to firewall allow rules if needed.
7. Store production secrets in the host platform, never in committed `.env` files.

## Optional Widgets

- WhatsApp chat appears when `VITE_WHATSAPP_PHONE_NUMBER` is set.
- Reviews API foundation is available at `/api/integrations/reviews`.
