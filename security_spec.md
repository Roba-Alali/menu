# VIRAL Firestore Security Specification (Phase 0)

## 1. Data Invariants
1. **Default Deny**: All unmatched Firestore paths are strictly denied.
2. **No Self-Assigned Privileges**: `/users/{userId}` contains zero role or privilege fields; platform roles reside solely in `/platformAdmins/{uid}` (managed by platform owners) and tenant roles reside in `/restaurants/{slug}/members/{memberId}`.
3. **Strict Path & ID Validation**: Every single-document operation validates `isValidId(id)` (`^[a-zA-Z0-9_-]+$`, `<= 128` chars) and enforces `hasOnly` + `hasAll` key checks on creation and `affectedKeys().hasOnly(...)` on updates.
4. **Temporal & Immutable Field Integrity**: `createdAt == request.time` on create; `createdAt` and `restaurantId` / `slug` are immutable on update; `updatedAt == request.time` on update.
5. **PII Isolation (Orders & Users)**:
   - Public guests may create an order under `/restaurants/{slug}/orders/{orderId}` ONLY with `status == 'pending'`, valid non-negative totals, and 1–50 items, and ONLY when the parent restaurant exists and is published (`isPublished == true`).
   - Reading, listing, or updating `/restaurants/{slug}/orders/{orderId}` (which contains `customerName`, `customerPhone`, `tableLabel`) is strictly forbidden for guests and non-members; only the restaurant's authorized staff/owner or platform admins may read/list/update orders.
   - Terminal order states (`completed`, `cancelled`) cannot be transitioned further except by platform owner override.
6. **Zero `get()` in `allow list`**: Collection list rules evaluate `resource.data` directly (`isPublic == true`, `ownerUid == request.auth.uid`, or verified `ownerEmail == request.auth.token.email`) to prevent O(n) read amplification.

## 2. Dirty Dozen Attack Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated Restaurant Creation**: `POST /restaurants/evil-slug` with `auth == null` -> DENIED.
2. **Shadow Field Injection on Restaurant**: `POST /restaurants/new-slug` with extra ghost key `{ ..., "isSuperVerified": true }` -> DENIED by `hasOnly(...)`.
3. **Unverified Email Spoofing**: `GET /restaurants/private-draft` with `auth.token.email == "robaalali86@gmail.com"` and `email_verified == false` -> DENIED.
4. **Non-Owner Reading Order PII**: `GET /restaurants/the-house/orders/ord-1001` as signed-in customer -> DENIED.
5. **Guest Listing All Orders**: `LIST /restaurants/the-house/orders` without restaurant membership -> DENIED.
6. **Pre-Accepted Fake Order**: `CREATE /restaurants/the-house/orders/ord-999` with `status: "completed"` -> DENIED (`status == 'pending'` required).
7. **Negative Total Manipulation**: `CREATE /restaurants/the-house/orders/ord-998` with `total: -50` -> DENIED.
8. **Empty Items Order**: `CREATE /restaurants/the-house/orders/ord-997` with `items: []` -> DENIED (`items.size() >= 1`).
9. **Immutable Timestamp Forgery**: `CREATE /restaurants/the-house/products/prod-1` with client-forged `createdAt: "2020-01-01"` -> DENIED (`createdAt == request.time`).
10. **ID Poisoning**: `CREATE /restaurants/a...{1500 chars}` -> DENIED by `isValidId()`.
11. **Terminal Order Mutation**: Non-admin attempting `UPDATE /restaurants/the-house/orders/ord-1003` (`completed` -> `pending`) -> DENIED.
12. **Self-Admin Escalation**: Authenticated user writing `/platformAdmins/{uid}` with `platformRole: "owner"` -> DENIED.
