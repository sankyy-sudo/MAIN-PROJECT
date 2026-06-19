# Phase Roadmap

## Phase 1: Authentication + Dashboard

Implemented:
- Login, logout, refresh token, forgot password, reset password
- JWT access and refresh tokens
- Password hashing
- RBAC middleware
- User CRUD
- Dashboard stats for users, customers, leads, orders, and revenue
- Frontend routes for login, dashboard, users, profile, and settings

## Phase 2: CRM Module

Implemented:
- Lead CRUD
- Lead search, filters, pagination
- Lead pipeline statuses
- Lead activity timeline
- Customer CRUD
- Customer timeline
- Customer notes
- Customer document activity endpoints

## Phase 5: Inventory Management

Implemented:
- Transactional stock-in, stock-out, adjustment, and return movements
- Prevention of negative inventory
- Per-product low-stock thresholds
- Low-stock alerts
- Paginated stock movement history with product and actor details
- Authenticated inventory frontend page

## Future Phases

## Phase 6: Order Management

Implemented:
- Transactional order creation with inventory deduction
- Pending, processing, packed, shipped, delivered, and cancelled workflow
- Automatic inventory restoration on cancellation
- Order tracking events
- Automatic invoice generation and B2B invoice listing
- Refund requests and approval/completion workflow
- Authenticated order management frontend

Phase 3 started:
- B2B business accounts
- Silver, Gold, and Platinum pricing tiers
- Discount calculation endpoint
- B2B account dashboard endpoint
- Invoice list endpoint placeholder for the future order/invoice module

Phase 4 started:
- Category CRUD
- Brand CRUD
- Product CRUD
- Product search and filters
- Product image URL fields ready for Cloudinary wiring

Phase 7 and Phase 8 should be implemented as separate modules:
- CMS
- Analytics dashboards with Recharts
