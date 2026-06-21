# Security, Backup, and PCI Notes

## Security Controls

- Helmet CSP is enabled in the API.
- CSRF double-submit protection is available with `CSRF_PROTECTION_ENABLED=true`.
- Login rate limiting is active.
- Account lockout is controlled by `ACCOUNT_LOCKOUT_ATTEMPTS` and `ACCOUNT_LOCKOUT_MINUTES`.
- Admin 2FA foundation is available at `/api/auth/2fa/enable` and `/api/auth/2fa/disable`.
- Non-standard admin route alias is controlled by `ADMIN_ROUTE_PREFIX` and `VITE_ADMIN_ROUTE_PREFIX`.
- GDPR export/delete endpoints are available under `/api/security/gdpr/*`.

## Backup Plan

Recommended production schedule:

- Daily PostgreSQL dump retained for 30 days.
- Weekly full backup retained for 12 weeks.
- Monthly archive retained for 12 months.
- Store backups in a separate encrypted bucket or volume.
- Test restore monthly against staging.

Example PostgreSQL dump:

```bash
pg_dump "$DATABASE_URL" > "backup-$(date +%Y-%m-%d).sql"
```

## PCI-safe Payment Handling

- Do not store card numbers, CVV, or full payment instrument details.
- Use Stripe Payment Element or hosted provider flows for card entry.
- Store only provider references, status, amount, and non-sensitive metadata.
- Keep webhook secrets in environment variables.
- Restrict payment admin actions to trusted roles.
- Exclude payment webhook routes from CSRF but keep provider signature checks enabled.

## Privacy and Terms

The storefront includes `/privacy`, `/terms`, and CMS-backed `/legal/:slug` pages.
