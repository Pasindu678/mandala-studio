# Mandala Studio — No-Code-Managed Mandala Art E-Commerce Platform

> **"Discover Your Art. Choose Your Mandala."**

A complete, production-ready, no-code-managed digital e-commerce website and content management platform built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS**, **Prisma ORM**, **PostgreSQL / SQLite**, and **Stripe Integration**.

---

## 🌟 Key Highlights & Capabilities

### 🎨 For Customers & Art Lovers
- **Dynamic Homepage**: Hero banners, category highlights, featured artworks, best-selling designs, curated collections, brand pillars, and interactive FAQ accordions.
- **Mandala Art Gallery (`/gallery`)**: High-performance responsive grid with real-time text search, category pills, difficulty filters (Beginner, Intermediate, Advanced), price filtering (Free vs Premium), and multi-criteria sorting.
- **Dynamic Category Pages (`/categories/[slug]`)**: Generated on-the-fly from database records with custom hero banners, SEO metadata, and category descriptions.
- **Artwork Details (`/artwork/[slug]`)**: Watermarked/protected vector preview, technical specifications, commercial license terms, instant free downloads or one-click cart additions.
- **Themed Shop (`/shop`)**: Ready-made printable 20-page coloring book PDFs, themed artwork suites, and premium design bundles.
- **Shopping Cart & Checkout (`/cart`, `/checkout`)**: Server-side recalculated pricing preventing client-side tampering, promo discount codes (`ZEN20`, `MANDALA10`, `WELCOME5`), and zero-friction sandbox or Stripe payment flows.
- **Secure Entitlement Downloads (`/account/downloads`, `/api/downloads/[id]`)**: Tamper-proof downloads verified against completed purchase entitlements, with download counter tracking and quota enforcement.
- **Customer Portal (`/account`)**: Order history, receipts, favorite designs, and profile management.

---

### ⚙️ Centralized No-Code Admin Dashboard (`/admin`)
Operate 100% of the website without editing code, HTML, CSS, or database rows:
1. **Overview KPI Dashboard**: Gross revenue, active orders, total artwork catalog size, registered customers, recent transactions, and top-selling designs.
2. **Category Management (`/admin/categories`)**: Add, edit, rename, publish/unpublish, feature, and sort categories. Automated URL slug generator with duplicate collision detection and dependency checks before deletion.
3. **Artwork Management (`/admin/artwork`)**: Filterable catalog table, instant publish toggle, archiving, metadata modal editor, and safe deletion guards.
4. **Artwork Upload Studio (`/admin/artwork/upload`)**: Single and bulk drag-and-drop uploader with real-time card editors, batch category assignment, draft vs publish toggle, and server-side file type and size validation.
5. **Themed Collections (`/admin/collections`)**: Create and organize curated artwork collections with multi-item artwork picker.
6. **Products & Bundles (`/admin/products`)**: Manage printable coloring book PDFs, multi-design suites, license terms, and commercial pricing.
7. **Media Library (`/admin/media`)**: Centralized media asset manager with file uploading, thumbnail previews, usage counters, clipboard URL copying, and safe removal.
8. **Homepage CMS (`/admin/homepage`)**: Live no-code editor for Hero section headlines, subheadlines, promotional banners, brand pillars, and FAQ Q&A entries, featuring on-demand cache revalidation (`revalidatePath`).
9. **Financial Orders (`/admin/orders`)**: Transaction logs, customer details, line items, payment status, and order receipts.
10. **Store Settings (`/admin/settings`)**: Store branding, support email, currency selector, sandbox vs live payment switcher, and digital download limits.

---

## 🚀 Quick Start (Local Development)

### 1. Requirements
- Node.js 18+ (tested on Node v20/v22)
- npm or pnpm

### 2. Installation
```bash
# Clone and enter directory
cd mandala-studio

# Install dependencies
npm install
```

### 3. Environment Setup
The repository includes a ready-to-run `.env` file pre-configured for instant zero-daemon local execution using SQLite:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="mandala_studio_super_secret_jwt_key_2026_xyz"
NEXT_PUBLIC_PAYMENT_MODE="mock" # Set to "stripe" for production Stripe Checkout
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup & Seeding
```bash
# Push schema to SQLite
npm run db:push

# Seed database with sample categories, 24 mathematical vector mandalas, products, and admin
npm run db:seed
```

### 5. Start the Application
```bash
# For development with Turbopack:
npm run dev

# Or build and start production server:
npm run build
npm run start
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Store Owner / Admin** | `admin@mandalastudio.art` | `admin123456` | Full access to `/admin` CMS |
| **Customer** | `customer@example.com` | `customer123456` | Customer account, cart & downloads |

> **Pro-Tip**: The login page (`/login`) includes one-click **"Fill Admin Credentials"** and **"Fill Customer Credentials"** buttons for effortless testing.

---

## 🎟️ Active Discount Codes for Testing

- `AYUBOWAN15`: 15% off any purchase (Sri Lankan Heritage special, no minimum order).
- `CEYLON20`: 20% off orders of $10.00 or more.
- `LANKA10`: 10% off any purchase (no minimum order).
- `MANDALA10`: 10% off any purchase (no minimum order).
- `ZEN20`: 20% off orders of $10.00 or more.
- `WELCOME5`: $5.00 off orders of $15.00 or more.

---

## 🧪 Automated Integration Tests

Run the complete 33-point integration test suite covering database models, public routes, cart recalculation, promo discounts, sandbox checkout, and download entitlement streaming:

```bash
npm test
```

Expected result:
```
====================================================
   MANDALA STUDIO — AUTOMATED TEST SUITE
   Target Server: http://localhost:3000
====================================================
...
====================================================
   TEST RESULTS: 33 PASSED, 0 FAILED
====================================================
```

---

## 🛡️ Production Deployment (PostgreSQL & Stripe)

### 1. Production PostgreSQL Database
For production deployment (e.g. Supabase, Neon, AWS RDS, Railway), copy `prisma/schema.postgresql.prisma` to `prisma/schema.prisma` or adjust datasource:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
Update `.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/mandala_studio?schema=public"
```
Run migrations:
```bash
npx prisma migrate deploy
npm run db:seed
```

### 2. Stripe Production Payments
1. Obtain your API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys).
2. Set `.env`:
   ```env
   STRIPE_SECRET_KEY="sk_live_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   NEXT_PUBLIC_PAYMENT_MODE="stripe"
   ```
3. Set your Stripe Webhook endpoint to:
   `https://yourdomain.com/api/webhooks/stripe`
   Listening for event: `checkout.session.completed`.

---

## 📂 Project Architecture

```
mandala-studio/
├── app/
│   ├── (auth)/login & register/   # Customer & Admin authentication
│   ├── account/                   # Customer dashboard, orders, downloads, favorites
│   ├── admin/                     # 10 No-Code Management sections
│   │   ├── artwork/               # Catalog list, bulk upload, per-card editor
│   │   ├── categories/            # Category CRUD & slug management
│   │   ├── collections/           # Curated themed suites
│   │   ├── customers/             # Customer CRM & spend metrics
│   │   ├── homepage/              # Dynamic CMS for hero, banner, about, FAQs
│   │   ├── media/                 # File asset manager
│   │   ├── orders/                # Financial ledger & receipt viewer
│   │   ├── products/              # Commercial PDFs & bundles
│   │   └── settings/              # Store branding & download limits
│   ├── api/                       # REST APIs for Auth, Admin CRUD, Cart, Checkout, Webhook
│   ├── artwork/[slug]/            # Artwork detail page with vector preview
│   ├── categories/[slug]/         # Dynamic category listings
│   ├── gallery/                   # Interactive gallery with live filters
│   ├── shop/                      # Printable coloring books & bundles
│   ├── cart/ & checkout/          # Recalculated cart & instant checkout
│   └── page.tsx                   # Dynamic CMS-driven homepage
├── components/                    # Accessible UI components (Navbar, Footer, Modals)
├── lib/
│   ├── auth/                      # JWT token generation & verification
│   ├── db/                        # Prisma ORM singleton client
│   ├── payments/                  # Server-side cart recalculation & Stripe logic
│   └── storage/                   # File validation, uploads, secure storage
├── prisma/
│   ├── schema.prisma              # Database schema (models & relations)
│   └── seed.js                    # Initial demo catalog & users
├── storage/private/               # Entitlement-protected vector originals & PDFs
└── scripts/                       # Asset generators & automated test suite
```

---

## 📜 License
MIT License. Built with ❤️ for Mandala Studio.
