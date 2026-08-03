# Implementation Plan: Divine Bytes E-Commerce Website

## Overview

This plan converts the Divine Bytes design into incremental coding tasks following the 12-phase roadmap. Each task builds on the previous, ending with a fully integrated, deployed luxury e-commerce platform. Tasks use TypeScript throughout. Property-based tests use fast-check. Unit/integration tests use Jest + React Testing Library.

## Tasks

- [x] 1. Phase 1 — Project Foundation
  - Initialize Next.js 14+ project with TypeScript strict mode and App Router
  - Configure Tailwind CSS with Divine Bytes design tokens (Deep Navy `#1B2A4A`, Warm White `#FAF8F5`, Luxury Gold `#C9A84C`, Chocolate Brown `#3E1F00`, Dark Gray `#2D2D2D`)
  - Configure Playfair Display and Inter fonts via `next/font`
  - Configure responsive breakpoints in `tailwind.config.ts`: mobile (320–767px), tablet (768–1023px), desktop (1024px+)
  - Install and configure Framer Motion
  - Install and configure Prisma ORM with PostgreSQL datasource
  - Create `.env.development` and `.env.production` templates with all required variable names
  - Configure ESLint (eslint-config-next) and Prettier
  - Set up project folder structure: `/app`, `/components`, `/lib`, `/types`, `/prisma`, `/__tests__`
  - Create `lib/design-tokens.ts` exporting color, font, and animation constants
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

- [x] 2. Phase 2 — Database Schema
  - [x] 2.1 Write Prisma schema with all 10 models: Category, Product, ProductImage, Customer, Order, OrderItem, ProductCustomization, AdminUser, GalleryImage, WebsiteSetting
    - Define all fields, types, relations, and enums (PaymentMethod, PaymentStatus, OrderStatus, ChocolateBase, Filling) as specified in design.md
    - Add database indexes on Product.slug, Product.categoryId, Order.orderNumber, Order.customerId, GalleryImage.displayOrder
    - _Requirements: 2.1–2.12_
  - [x] 2.2 Run initial Prisma migration and generate Prisma Client
    - _Requirements: 2.1_
  - [x] 2.3 Create seed script `prisma/seed.ts`
    - Seed all 6 products with correct prices, slugs, descriptions, and categories (Heart Chocolates PKR 1499, Nut Filled PKR 2499, Flavour Bombs PKR 2499, Signature Chocolate Bar PKR 1299, Waffle Fingers PKR 999, Cookies PKR 500)
    - Seed default WebsiteSetting record
    - Seed default AdminUser with hashed password
    - _Requirements: 2.11_

- [ ] 3. Phase 3 — Backend APIs
  - [x] 3.1 Create `lib/prisma.ts` singleton Prisma client and `lib/api-handler.ts` `withErrorHandling` wrapper
    - _Requirements: 19.7_
  - [x] 3.2 Create `lib/validations/` Zod schemas for all API inputs (checkout, contact, product, order, settings)
    - _Requirements: 5.3, 13.7_
  - [x] 3.3 Implement customer API routes:
    - `GET /api/products` — list active products with optional `search` and `categoryId` query params
    - `GET /api/products/[slug]` — single product with images
    - `GET /api/categories` — all categories
    - `GET /api/gallery` — gallery images ordered by displayOrder
    - `POST /api/contact` — validate and store/forward contact message
    - _Requirements: 3.2, 3.3, 7.1, 8.3_
  - [ ]* 3.4 Write property tests for product search and category filter API logic
    - **Property 9: Search results subset invariant** — for any query, all results contain the query string (case-insensitive) and have active=true
    - **Property 10: Category filter subset invariant** — for any categoryId, all results belong to that category and have active=true
    - **Validates: Requirements 3.2, 3.3, 3.7**
  - [x] 3.5 Implement `POST /api/checkout` route
    - Zod validation of all required fields
    - Upsert Customer by phoneNumber
    - Generate unique orderNumber (format DB-YYYYMMDD-XXXX)
    - Handle paymentScreenshot upload
    - Create Order + OrderItems + ProductCustomization in a Prisma transaction
    - Return orderNumber on success
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  - [ ]* 3.6 Write property tests for checkout validation
    - **Property 4: Checkout validation rejects incomplete data** — for any checkout object missing required fields, the validation function returns errors and no Order is created
    - **Property 5: Order creation atomicity** — for any valid checkout input, the transaction creates all records or none
    - **Validates: Requirements 5.3, 5.4**
  - [ ]* 3.7 Write property test for order total consistency
    - **Property 13: Order total consistency** — for any set of OrderItems, the Order.totalAmount equals sum(qty × unitPrice)
    - **Validates: Requirements 5.4, 4.4**

  - [-] 3.8 Implement admin API routes:
    - `GET /admin/dashboard` — aggregate stats (total orders, revenue, pending orders, pending payments) + 5 recent orders
    - `GET /admin/products`, `POST /admin/products`, `PUT /admin/products/[id]`, `DELETE /admin/products/[id]`
    - `GET /admin/orders`, `GET /admin/orders/[id]`, `PUT /admin/orders/[id]`
    - `GET /admin/customers`
    - `GET /admin/gallery`, `POST /admin/gallery`, `DELETE /admin/gallery/[id]`, `PUT /admin/gallery/[id]/reorder`
    - `GET /admin/settings`, `PUT /admin/settings`
    - `POST /admin/upload` — secure image upload handler
    - _Requirements: 12.1, 13.1–13.6, 14.1–14.6, 15.1, 16.1–16.4, 17.1–17.3_

- [ ] 4. Phase 4 — Authentication and Security
  - [ ] 4.1 Create `lib/auth/` module: `hashPassword`, `verifyPassword` (bcrypt, cost factor 12), `signJwt`, `verifyJwt` utilities
    - _Requirements: 19.2_
  - [ ]* 4.2 Write property test for password hashing
    - **Property 12: Password hash irreversibility** — for any password string, bcrypt hash does not equal plaintext and passes bcrypt.compare
    - **Validates: Requirements 19.2**
  - [~] 4.3 Implement `POST /api/admin/auth/login` and `POST /api/admin/auth/logout` routes
    - Login: validate credentials, issue JWT in HTTP-only + Secure + SameSite=Strict cookie
    - Logout: clear the cookie
    - _Requirements: 11.2, 11.3, 11.6_
  - [~] 4.4 Implement `lib/auth/withAdminAuth.ts` middleware wrapper for all admin API routes
    - Reads JWT from cookie, verifies signature and expiry, returns 401 if invalid
    - _Requirements: 11.4, 11.5_
  - [ ]* 4.5 Write property test for JWT authentication gate
    - **Property 11: Admin JWT authentication gate** — for any admin API route, requests without a valid JWT cookie receive HTTP 401 and no data
    - **Validates: Requirements 11.5**
  - [~] 4.6 Implement Next.js middleware `middleware.ts` to protect all `/admin/*` routes (except `/admin/login`) by checking JWT cookie
    - _Requirements: 11.5_
  - [~] 4.7 Implement rate limiting using `lib/rate-limit.ts` (sliding window, in-memory for dev / Redis for prod)
    - Apply 5 attempts/15min to login endpoint; 100 req/min to public endpoints
    - _Requirements: 11.7, 19.6_
  - [~] 4.8 Implement `lib/upload/fileValidator.ts` — validates MIME type (magic bytes), extension, and file size ≤ 5 MB
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_
  - [ ]* 4.9 Write property test for file upload validation
    - **Property 8: File upload type and size enforcement** — for any file with MIME type not in {jpeg, png, webp, gif} or size > 5MB, the validator rejects it with the correct error message
    - **Validates: Requirements 18.1, 18.2**
  - [~] 4.10 Implement `lib/upload/storageService.ts` — local disk storage (dev) or Cloudinary (prod) based on NODE_ENV; generates UUID-based filenames
    - _Requirements: 18.3, 22.2_
  - [~] 4.11 Add XSS sanitization middleware using DOMPurify (server-side via isomorphic-dompurify) for all user-supplied string fields before DB write
    - _Requirements: 19.4_

- [~] 5. Checkpoint — API and Security Foundation
  - Ensure all tests pass, ask the user if questions arise.
  - Verify: all customer and admin API routes return correct shapes, JWT auth gates work, file upload validation rejects bad files, cart/checkout property tests pass.

- [ ] 6. Phase 5 — Design System and Reusable Components
  - [~] 6.1 Create base UI components in `components/ui/`
    - `Button.tsx` — variants: primary (Deep Navy bg), secondary (outlined), ghost, danger; sizes: sm, md, lg; loading state with spinner
    - `Input.tsx` — labeled, error state, required indicator, mobile-friendly keyboard type hints
    - `Select.tsx` — styled dropdown matching design tokens
    - `Textarea.tsx` — auto-resize, character counter for limited fields
    - `QuantitySelector.tsx` — +/- buttons with min=1, configurable max; 44×44px touch targets
    - _Requirements: 21.1_
  - [~] 6.2 Create feedback UI components in `components/ui/`
    - `Toast.tsx` — toast notification system with variants (success, error, info); auto-dismisses after 4 seconds; uses React portal
    - `Skeleton.tsx` — flexible skeleton loader with width/height/variant props
    - `EmptyState.tsx` — icon + heading + subtext + optional CTA
    - `Modal.tsx` — accessible dialog with focus trap, overlay close, keyboard escape
    - `Breadcrumb.tsx` — renders path with `>` separators
    - `SectionHeader.tsx` — Playfair Display title + Inter subtitle + optional CTA
    - _Requirements: 8.3, 8.4_
  - [~] 6.3 Create image components in `components/ui/`
    - `ImageUpload.tsx` — drag-and-drop + file picker; preview on selection; validates client-side for type and size; calls `onChange` with File
    - _Requirements: 6.3, 18.1, 18.2_
  - [~] 6.4 Create layout components
    - `Navbar.tsx` — sticky header; desktop: logo left + centered nav links + cart icon with badge; mobile: logo + cart icon + hamburger; slide-in `NavigationDrawer.tsx` with overlay
    - `Footer.tsx` — Deep Navy bg; logo, nav links, contact number, WhatsApp link, Instagram link, Privacy Policy link, Terms link, copyright
    - _Requirements: 10.1–10.5, 8.8_
  - [~] 6.5 Create product components in `components/product/`
    - `ProductCard.tsx` — image (Next.js Image), name, price in PKR, short description, "Add to Cart" button; rounded corners, subtle shadow; hover: lift + image zoom (Framer Motion)
    - `ProductGrid.tsx` — 1-col mobile / 2-col tablet / 3–4-col desktop; shows skeleton cards while loading
    - `ProductImageGallery.tsx` — swipeable gallery on mobile (touch events), thumbnail strip; fullscreen lightbox
    - `CustomizationPanel.tsx` — Chocolate Base Select, Filling Select, Personalized Name Input (max 50), Your Vision Textarea (max 500), Inspiration Image ImageUpload; inline required field validation
    - _Requirements: 3.1, 3.6, 6.1_
  - [~] 6.6 Create gallery components in `components/gallery/`
    - `GalleryLightbox.tsx` — fullscreen overlay, keyboard navigation (arrow keys, escape), accessible close button
    - `GalleryGrid.tsx` — masonry desktop / horizontal scroll mobile; lazy loading via Intersection Observer
    - _Requirements: 7.2, 7.3, 7.4_
  - [~] 6.7 Create cart components in `components/cart/`
    - `CartItem.tsx` — product image, name, unit price, `QuantitySelector`, remove button, line total
    - `CartSummary.tsx` — line items, subtotal, order total in PKR, "Proceed to Checkout" button
    - _Requirements: 4.4_
  - [~] 6.8 Create admin components in `components/admin/`
    - `AdminSidebar.tsx` — links to all admin pages, active state indication, logout button
    - `AdminTable.tsx` — sortable columns, pagination, loading skeleton rows
    - `StatusBadge.tsx` — color-coded pill for OrderStatus and PaymentStatus values

- [ ] 7. Phase 6 — Customer Website Pages
  - [~] 7.1 Create `app/(customer)/layout.tsx` with `Navbar` and `Footer`, global font application, and toast provider
    - _Requirements: 10.1, 8.8_
  - [~] 7.2 Build Home page `app/(customer)/page.tsx`
    - Hero section: full-bleed image (WebsiteSetting.heroImageUrl), Playfair Display headline, subheading, "Shop Collection" CTA → `/shop`, "Explore Our Story" CTA → `/about`; min-height 85dvh on mobile
    - Featured Collection section: fetch featured products, horizontal scroll carousel on mobile + grid desktop (use `ProductCard`)
    - Best Sellers section: swipe carousel mobile / grid desktop
    - Why Divine Bytes section: three cards (Premium Ingredients, Handcrafted with Care, Beautifully Giftable) with icons
    - Signature Product Highlight section: Signature Bar image + "Customize Yours" → `/product/signature-chocolate-bar`
    - Gallery Preview section: up to 6 GalleryImages + "View Gallery" → `/gallery`
    - Customer Reviews Placeholder section: static placeholder cards
    - Instagram Preview section: Instagram link + "Follow Divine Bytes" CTA
    - Framer Motion scroll-triggered fade-in animations on each section (250ms ease-out)
    - _Requirements: 9.1–9.7_
  - [~] 7.3 Build Shop page `app/(customer)/shop/page.tsx`
    - Search bar with debounced input (300ms)
    - Category filter pills
    - `ProductGrid` with skeleton loading state
    - "Load More" pagination button
    - Empty state via `EmptyState` component when no results
    - _Requirements: 3.1–3.4_
  - [~] 7.4 Build Product Details page `app/(customer)/product/[slug]/page.tsx`
    - Fetch product by slug; call `notFound()` if inactive or missing
    - `ProductImageGallery` at top
    - Product name (Playfair Display h1), price, description
    - `QuantitySelector`
    - "Add to Cart" button — sticky bar at bottom on mobile
    - `CustomizationPanel` rendered only for slug `signature-chocolate-bar`
    - Disclaimer note for Signature Bar
    - Generate JSON-LD structured data (schema.org/Product)
    - Per-page `<title>` and `<meta name="description">` and OG tags
    - _Requirements: 3.5, 3.6, 3.8, 6.1, 6.3, 6.6, 20.3, 20.6_
  - [~] 7.5 Build Gallery page `app/(customer)/gallery/page.tsx`
    - Fetch all GalleryImages ordered by displayOrder
    - `GalleryGrid` component with lazy loading
    - `GalleryLightbox` on image click
    - Empty state when no images
    - _Requirements: 7.1–7.5_
  - [~] 7.6 Build About, Contact, FAQ, Privacy Policy, Terms pages
    - About: hero image, brand story, mission, crafting process, packaging showcase, CTA → `/shop`
    - Contact: WhatsApp link (wa.me), Instagram link, contact form (name, phone, message) wired to `POST /api/contact`; toast on success/failure
    - FAQ: accordion with smooth Framer Motion open/close (150ms)
    - Privacy Policy and Terms: static content pages
    - _Requirements: 8.1–8.7_

- [ ] 8. Phase 7 — Shopping Experience
  - [~] 8.1 Implement `lib/cart/CartContext.tsx` — React Context + useReducer for cart state
    - Actions: ADD_ITEM, UPDATE_QUANTITY, REMOVE_ITEM, CLEAR_CART
    - Computed values: `total` (sum of qty × price), `itemCount`
    - Persistence: serialize to/deserialize from localStorage on every state change
    - _Requirements: 4.1–4.6_
  - [ ]* 8.2 Write property tests for cart state management
    - **Property 1: Cart total invariant** — for any cart state, total equals sum(qty × price) for all items
    - **Property 2: Cart item add/retrieve round trip** — for any product, after adding it, the cart contains an item with matching productId and correct quantity
    - **Property 3: Whitespace-only cart rejection** — for any cart item with blank name, the reducer rejects the add and leaves cart unchanged
    - **Validates: Requirements 4.1, 4.4, 4.5**
  - [ ]* 8.3 Write property tests for cart persistence
    - Verify cart serialization round trip: serialize CartItem[] to JSON string, deserialize, assert equivalence
    - **Validates: Requirements 4.5**
  - [~] 8.4 Build Cart page `app/(customer)/cart/page.tsx`
    - List `CartItem` components with quantity controls and remove buttons
    - `CartSummary` with totals
    - "Continue Shopping" link → `/shop`
    - "Proceed to Checkout" button → `/checkout`
    - Empty state with `EmptyState` component
    - _Requirements: 4.1–4.8_
  - [~] 8.5 Build Checkout page `app/(customer)/checkout/page.tsx`
    - `CheckoutForm` component with all required fields using React Hook Form + Zod validation
    - Conditional payment screenshot `ImageUpload` for Bank Transfer / JazzCash
    - Order summary sidebar (or bottom card on mobile)
    - "Place Order" button with loading state
    - Wire to `POST /api/checkout`; navigate to `/order-confirmation/[orderNumber]` on success
    - Display inline field errors and error toast on failure
    - _Requirements: 5.1–5.8_
  - [~] 8.6 Build Order Confirmation page `app/(customer)/order-confirmation/[orderNumber]/page.tsx`
    - Fetch order by orderNumber; call `notFound()` if missing
    - Display order number, order summary, delivery address, payment method
    - WhatsApp contact CTA for order updates
    - Clear cart on mount
    - _Requirements: 5.6, 5.7_

- [ ] 9. Phase 8 — Signature Chocolate Bar Customization
  - [~] 9.1 Wire `CustomizationPanel` fully to cart add flow on `/product/signature-chocolate-bar`
    - Require Chocolate Base + Filling before enabling "Add to Cart"
    - Display validation errors inline when required fields are missing
    - Show image preview after inspiration image selection
    - Pass `CustomizationData` into `CartContext.ADD_ITEM` action
    - _Requirements: 6.1–6.4, 6.6_
  - [ ]* 9.2 Write property tests for customization validation
    - **Property 6: Customization required fields enforcement** — for any Signature Bar add attempt missing chocolateBase or filling, the action is rejected and cart is unchanged
    - **Property 7: Customization data round trip** — for any valid CustomizationData, serializing to JSON and deserializing produces an equivalent object with no field loss
    - **Validates: Requirements 6.2, 6.4**
  - [~] 9.3 Ensure `POST /api/checkout` creates `ProductCustomization` record for Signature Bar line items
    - Read customization data from checkout payload
    - Create `ProductCustomization` linked to corresponding `OrderItem` in the same Prisma transaction
    - _Requirements: 6.5_

- [~] 10. Checkpoint — Customer Experience Complete
  - Ensure all tests pass, ask the user if questions arise.
  - Verify: product browsing, search, filtering, cart operations, checkout, order confirmation, and Signature Bar customization all work end-to-end.

- [ ] 11. Phase 9 — Admin Dashboard
  - [~] 11.1 Create `app/(admin)/layout.tsx` with `AdminSidebar` and auth guard (redirect to `/admin/login` if no valid JWT cookie)
    - _Requirements: 11.5, 12.3_
  - [~] 11.2 Build Admin Login page `app/(admin)/admin/login/page.tsx`
    - Email + password form; wire to `POST /api/admin/auth/login`
    - Display "Invalid email or password." on 401
    - Display rate-limit message on 429
    - Redirect to `/admin/dashboard` on success
    - _Requirements: 11.1–11.3, 11.7_
  - [~] 11.3 Build Admin Dashboard page `app/(admin)/admin/dashboard/page.tsx`
    - Summary cards: Total Orders, Total Revenue (PKR), Pending Orders, Pending Payment Verification
    - Recent Orders table (5 rows): order number, customer name, total, payment method, status badges
    - _Requirements: 12.1, 12.2_
  - [~] 11.4 Build Admin Products pages
    - `admin/products/page.tsx` — `AdminTable` with all products; "New Product" button; edit/delete actions
    - `admin/products/new/page.tsx` — product creation form: name, slug (auto-generated + editable), description, price, category select, stock quantity, featured toggle, active toggle, multi-image upload
    - `admin/products/[id]/edit/page.tsx` — pre-populated edit form; same validation as creation form
    - Soft-delete (set active=false) with confirmation modal
    - Toast notifications on success/failure
    - _Requirements: 13.1–13.7_
  - [~] 11.5 Build Admin Orders pages
    - `admin/orders/page.tsx` — `AdminTable` with all orders sorted by createdAt desc; filter dropdowns for orderStatus and paymentStatus
    - `admin/orders/[id]/page.tsx` — full order detail: customer info, order items with unit prices, customization details, inspiration image thumbnail, payment screenshot link, status update selects with save buttons
    - _Requirements: 14.1–14.6_
  - [~] 11.6 Build Admin Customers page `admin/customers/page.tsx`
    - Read-only `AdminTable`: full name, phone, email, city, order count
    - _Requirements: 15.1, 15.2_
  - [~] 11.7 Build Admin Gallery Management page `admin/gallery/page.tsx`
    - Grid of current gallery images with captions and display order
    - Upload new image form with caption field
    - Delete button with confirmation modal
    - Drag-and-drop reorder (updates displayOrder)
    - _Requirements: 16.1–16.4_
  - [~] 11.8 Build Admin Website Settings page `admin/settings/page.tsx`
    - Form with all WebsiteSetting fields: business name, logo upload, contact number, Instagram link, delivery info, business address, hero image upload
    - Wire to `PUT /api/admin/settings`; toast on success
    - _Requirements: 17.1, 17.2_
  - [~] 11.9 Wire WebsiteSetting values to customer-facing pages
    - Navbar logo, hero image, contact number in footer, Instagram link in footer
    - _Requirements: 17.3_

- [~] 12. Checkpoint — Admin Dashboard Complete
  - Ensure all tests pass, ask the user if questions arise.
  - Verify: login/logout, product CRUD, order status updates, payment verification, gallery management, and settings updates all work correctly.

- [ ] 13. Phase 10 — Visual Polish
  - [~] 13.1 Audit and refine all Framer Motion animations across every page
    - Ensure all durations are 150ms–400ms; remove bounce/flash/playful effects
    - Add scroll-triggered fade-in/slide-up to homepage sections
    - Add hover lift + image zoom to all ProductCards
    - Add smooth accordion open/close animation to FAQ items (150ms)
    - Add page transition animation using AnimatePresence in root layout
    - _Requirements: 1.5_
  - [~] 13.2 Refine typography, spacing, and whitespace
    - Audit every page for correct Playfair Display headings and Inter body text
    - Ensure generous whitespace on desktop multi-column layouts
    - Verify single-column mobile layouts and comfortable touch spacing
    - _Requirements: 1.3, 1.4_
  - [~] 13.3 Refine product cards, gallery, and image presentation
    - Ensure all product images use consistent aspect ratios
    - Add smooth fade-in to lazy-loaded images
    - Refine masonry gallery layout on desktop
    - _Requirements: 20.2_
  - [~] 13.4 Verify brand color consistency across all pages
    - Buttons use Deep Navy bg + white text
    - Accents use Luxury Gold
    - Footer uses Deep Navy bg
    - All backgrounds use Warm White
    - _Requirements: 1.2_
  - [~] 13.5 Refine mobile interactions: bottom sheets, sticky purchase actions, swipe carousels
    - _Requirements: 13.1_

- [ ] 14. Phase 11 — Testing and Quality Assurance
  - [~] 14.1 Run all unit and property-based tests; fix any failures
    - `pnpm test:unit` — verify all 13 correctness properties pass (minimum 100 iterations each)
    - _Requirements: All_
  - [ ]* 14.2 Write integration tests for core checkout and admin flows
    - Checkout integration test: POST /api/checkout with valid payload creates Order + OrderItems + ProductCustomization in test DB
    - Admin auth integration test: login → access protected route → logout → verify access denied
    - _Requirements: 5.4, 11.2, 11.5_
  - [ ]* 14.3 Write accessibility tests using jest-axe
    - Run axe on Home, Shop, Product Details, Cart, Checkout pages
    - Assert zero accessibility violations
    - _Requirements: 21.1–21.6_
  - [~] 14.4 Manually test on mobile devices (320px–767px): Chrome (Android), Safari (iOS)
    - Navigation drawer, swipe carousels, sticky cart bar, checkout form, image upload
    - _Requirements: 13.1_
  - [~] 14.5 Manually test on tablet (768px–1023px) and desktop (1024px+) in Chrome, Safari, Firefox, Edge
    - _Requirements: 20.1_
  - [~] 14.6 Run Lighthouse audit on Home, Shop, and Product Details pages; ensure all four scores ≥ 95
    - Fix any performance issues (image sizes, unused JS, render-blocking resources)
    - _Requirements: 20.1_
  - [~] 14.7 Verify all SEO metadata: page titles, meta descriptions, OG tags, sitemap.xml, robots.txt, JSON-LD on product pages
    - _Requirements: 20.3–20.6_

- [ ] 15. Phase 12 — Deployment
  - [~] 15.1 Configure Neon PostgreSQL production database and run Prisma migrations against it
    - _Requirements: 22.1_
  - [~] 15.2 Configure Cloudinary account and add credentials to Vercel environment variables
    - _Requirements: 22.2_
  - [~] 15.3 Deploy to Vercel: connect GitHub repo, configure all production environment variables, trigger production build
    - _Requirements: 22.1_
  - [~] 15.4 Configure custom domain on Namecheap and point to Vercel; verify HTTPS is enforced (HTTP → HTTPS redirect)
    - _Requirements: 19.1, 22.3_
  - [~] 15.5 Generate `sitemap.xml` (via next-sitemap or custom route) and `robots.txt` and verify they are accessible in production
    - _Requirements: 20.4_
  - [~] 15.6 Run seed script against production database to populate products, categories, and default settings
    - _Requirements: 2.11_
  - [~] 15.7 Run final Lighthouse audit in production environment; verify all four scores ≥ 95
    - _Requirements: 20.1_

- [~] 16. Final Checkpoint — Production Ready
  - Ensure all tests pass, ask the user if questions arise.
  - Verify: production site is accessible at custom domain, HTTPS is enforced, all products are browsable, checkout completes successfully, admin dashboard is accessible and functional.

## Notes

- Tasks marked with `*` are optional property/integration/accessibility test sub-tasks and can be skipped for a faster MVP
- Each task references specific requirements from `requirements.md` for traceability
- All 13 correctness properties from `design.md` are covered by property test sub-tasks in Phases 3, 4, 7, 8, and 9
- Checkpoints at tasks 5, 10, 12, and 16 ensure incremental validation
- The design.md `lib/api-handler.ts` `withErrorHandling` wrapper must be applied to every API route to guarantee consistent error shapes and prevent internal error exposure
- fast-check property tests are configured to run minimum 100 iterations; tag each test with: `// Feature: divine-bytes-ecommerce, Property N: <property_text>`

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2"] },
    { "wave": 3, "tasks": ["3"] },
    { "wave": 4, "tasks": ["4"] },
    { "wave": 5, "tasks": ["5"] },
    { "wave": 6, "tasks": ["6"] },
    { "wave": 7, "tasks": ["7"] },
    { "wave": 8, "tasks": ["8"] },
    { "wave": 9, "tasks": ["9"] },
    { "wave": 10, "tasks": ["10"] },
    { "wave": 11, "tasks": ["11"] },
    { "wave": 12, "tasks": ["12"] },
    { "wave": 13, "tasks": ["13"] },
    { "wave": 14, "tasks": ["14"] },
    { "wave": 15, "tasks": ["15"] },
    { "wave": 16, "tasks": ["16"] }
  ]
}
```

Each phase depends on the completion of all preceding phases. The API routes (task 3) must be complete before customer pages (task 7) and admin pages (task 11) are built. Authentication (task 4) must be complete before any admin UI is wired. The design system (task 6) must be complete before any page is assembled.
