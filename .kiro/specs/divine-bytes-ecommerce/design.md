# Design Document: Divine Bytes E-Commerce Website

## Overview

Divine Bytes is a full-stack Next.js e-commerce application for a luxury handcrafted chocolate brand. The system replaces a WhatsApp catalogue with a mobile-first shopping experience featuring product browsing, Signature Chocolate Bar customization, a secure checkout pipeline with manual payment verification, and a comprehensive admin dashboard for business operations.

The architecture follows a monolithic Next.js application pattern — the same codebase serves both the customer website and the admin dashboard via Next.js App Router, with API Routes handling all backend logic. This approach minimizes operational complexity while supporting the Vercel + Neon PostgreSQL deployment target.

**Key design goals:**
- Mobile-first at 320px, elegant at 1440px
- Lighthouse 95+ across all four categories
- Secure by default (JWT cookies, bcrypt, Prisma parameterized queries, CSRF)
- Extensible schema designed for future features (accounts, wishlists, coupons)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Application                      │
│                    (Vercel Deployment)                       │
│                                                              │
│  ┌─────────────────────┐   ┌────────────────────────────┐   │
│  │  Customer Website   │   │     Admin Dashboard        │   │
│  │  /app/(customer)    │   │     /app/(admin)            │   │
│  │                     │   │     [JWT Protected]         │   │
│  │  - Home             │   │     - Dashboard             │   │
│  │  - Shop             │   │     - Products              │   │
│  │  - Product Details  │   │     - Orders                │   │
│  │  - Gallery          │   │     - Customers             │   │
│  │  - About/Contact    │   │     - Gallery Mgmt          │   │
│  │  - Cart/Checkout    │   │     - Settings              │   │
│  └────────┬────────────┘   └────────────┬───────────────┘   │
│           │                             │                     │
│  ┌────────▼─────────────────────────────▼───────────────┐   │
│  │               Next.js API Routes                      │   │
│  │               /app/api/*                              │   │
│  │                                                        │   │
│  │  Customer: /products  /categories  /gallery           │   │
│  │            /checkout  /contact                        │   │
│  │  Admin:    /admin/auth  /admin/products               │   │
│  │            /admin/orders  /admin/gallery              │   │
│  │            /admin/customers  /admin/settings          │   │
│  └────────────────────────┬──────────────────────────────┘   │
│                           │                                   │
│  ┌────────────────────────▼──────────────────────────────┐   │
│  │                  Prisma ORM                            │   │
│  └────────────────────────┬──────────────────────────────┘   │
│                           │                                   │
└───────────────────────────┼───────────────────────────────────┘
                            │
            ┌───────────────▼───────────────┐
            │   Neon PostgreSQL (Production) │
            │   Local PostgreSQL (Dev)       │
            └───────────────────────────────┘

Image Storage:
  Development  →  /public/uploads  (local disk)
  Production   →  Cloudinary CDN
```

### Route Group Structure

```
/app
  /(customer)          ← customer layout (Navbar + Footer)
    /page.tsx          ← Home
    /shop/page.tsx
    /product/[slug]/page.tsx
    /gallery/page.tsx
    /about/page.tsx
    /contact/page.tsx
    /faq/page.tsx
    /cart/page.tsx
    /checkout/page.tsx
    /order-confirmation/[orderNumber]/page.tsx
    /privacy-policy/page.tsx
    /terms/page.tsx
  /(admin)             ← admin layout (AdminSidebar)
    /admin/login/page.tsx
    /admin/dashboard/page.tsx
    /admin/products/page.tsx
    /admin/products/new/page.tsx
    /admin/products/[id]/edit/page.tsx
    /admin/orders/page.tsx
    /admin/orders/[id]/page.tsx
    /admin/customers/page.tsx
    /admin/gallery/page.tsx
    /admin/settings/page.tsx
  /api
    /products/route.ts
    /products/[slug]/route.ts
    /categories/route.ts
    /gallery/route.ts
    /checkout/route.ts
    /contact/route.ts
    /admin/auth/login/route.ts
    /admin/auth/logout/route.ts
    /admin/dashboard/route.ts
    /admin/products/route.ts
    /admin/products/[id]/route.ts
    /admin/orders/route.ts
    /admin/orders/[id]/route.ts
    /admin/customers/route.ts
    /admin/gallery/route.ts
    /admin/gallery/[id]/route.ts
    /admin/settings/route.ts
    /admin/upload/route.ts
```

---

## Components and Interfaces

### Design System Tokens

```typescript
// lib/design-tokens.ts
export const colors = {
  deepNavy:       '#1B2A4A',
  warmWhite:      '#FAF8F5',
  luxuryGold:     '#C9A84C',
  chocolateBrown: '#3E1F00',
  darkGray:       '#2D2D2D',
} as const;

export const fonts = {
  heading: 'Playfair Display, serif',
  body:    'Inter, sans-serif',
} as const;

export const animation = {
  fast:    '150ms ease-out',
  normal:  '250ms ease-out',
  slow:    '400ms ease-out',
} as const;
```

### Core Reusable Components

| Component | Location | Purpose |
|---|---|---|
| `Navbar` | `components/layout/Navbar.tsx` | Sticky top nav with mobile drawer |
| `Footer` | `components/layout/Footer.tsx` | Site-wide footer |
| `AdminSidebar` | `components/admin/AdminSidebar.tsx` | Admin navigation |
| `Button` | `components/ui/Button.tsx` | Variants: primary, secondary, ghost, danger |
| `ProductCard` | `components/product/ProductCard.tsx` | Grid card with image, name, price, CTA |
| `ProductGrid` | `components/product/ProductGrid.tsx` | Responsive grid with skeleton states |
| `GalleryImage` | `components/gallery/GalleryImage.tsx` | Lazy-loaded image with lightbox trigger |
| `GalleryLightbox` | `components/gallery/GalleryLightbox.tsx` | Fullscreen image overlay |
| `CartItem` | `components/cart/CartItem.tsx` | Line item with quantity controls |
| `CartSummary` | `components/cart/CartSummary.tsx` | Subtotal + total display |
| `CheckoutForm` | `components/checkout/CheckoutForm.tsx` | Multi-section checkout with validation |
| `CustomizationPanel` | `components/product/CustomizationPanel.tsx` | Signature Bar options |
| `ImageUpload` | `components/ui/ImageUpload.tsx` | Drag-and-drop + file validation |
| `Input` | `components/ui/Input.tsx` | Labeled input with error state |
| `Select` | `components/ui/Select.tsx` | Styled dropdown |
| `Textarea` | `components/ui/Textarea.tsx` | Expandable textarea |
| `QuantitySelector` | `components/ui/QuantitySelector.tsx` | +/- controls with bounds |
| `Toast` | `components/ui/Toast.tsx` | Auto-dismissing notifications |
| `Skeleton` | `components/ui/Skeleton.tsx` | Loading placeholder shapes |
| `EmptyState` | `components/ui/EmptyState.tsx` | Configurable empty state with icon |
| `Modal` | `components/ui/Modal.tsx` | Accessible dialog overlay |
| `Breadcrumb` | `components/ui/Breadcrumb.tsx` | Page path indicator |
| `SectionHeader` | `components/ui/SectionHeader.tsx` | Title + subtitle + optional CTA |
| `AdminTable` | `components/admin/AdminTable.tsx` | Sortable data table |
| `StatusBadge` | `components/admin/StatusBadge.tsx` | Color-coded order/payment status |

### State Management

Cart state is managed via React Context + localStorage persistence:

```typescript
// lib/cart/CartContext.tsx
interface CartItem {
  productId:     string;
  name:          string;
  price:         number;
  quantity:      number;
  imageUrl:      string;
  customization?: CustomizationData;  // only for Signature Bar
}

interface CustomizationData {
  chocolateBase:      ChocolateBase;
  filling:            Filling;
  personalizedName?:  string;
  customerVision?:    string;
  inspirationImage?:  File | null;
  inspirationPreview?: string;        // object URL for preview
}

interface CartContextValue {
  items:       CartItem[];
  addItem:     (item: CartItem) => void;
  updateItem:  (productId: string, quantity: number) => void;
  removeItem:  (productId: string) => void;
  clearCart:   () => void;
  total:       number;
  itemCount:   number;
}
```

### API Response Types

```typescript
// types/api.ts
interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiError {
  success: false;
  error: string;
  fieldErrors?: Record<string, string>;
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;
```

---

## Data Models

### Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String    @unique
  products Product[]
}

model Product {
  id            String         @id @default(cuid())
  name          String
  slug          String         @unique
  description   String
  price         Decimal        @db.Decimal(10, 2)
  categoryId    String
  stockQuantity Int            @default(0)
  featured      Boolean        @default(false)
  active        Boolean        @default(true)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  category      Category       @relation(fields: [categoryId], references: [id])
  images        ProductImage[]
  orderItems    OrderItem[]

  @@index([categoryId])
  @@index([slug])
  @@index([active, featured])
}

model ProductImage {
  id           String  @id @default(cuid())
  productId    String
  imageUrl     String
  displayOrder Int     @default(0)
  altText      String  @default("")
  product      Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId, displayOrder])
}

model Customer {
  id          String   @id @default(cuid())
  fullName    String
  phoneNumber String   @unique
  email       String?
  address     String
  city        String
  createdAt   DateTime @default(now())
  orders      Order[]
}

model Order {
  id                   String      @id @default(cuid())
  orderNumber          String      @unique
  customerId           String
  paymentMethod        PaymentMethod
  paymentStatus        PaymentStatus @default(PENDING)
  orderStatus          OrderStatus   @default(PENDING)
  deliveryAddress      String
  city                 String
  totalAmount          Decimal     @db.Decimal(10, 2)
  notes                String?
  paymentScreenshotUrl String?
  createdAt            DateTime    @default(now())
  customer             Customer    @relation(fields: [customerId], references: [id])
  items                OrderItem[]

  @@index([customerId])
  @@index([orderNumber])
  @@index([orderStatus])
  @@index([paymentStatus])
}

model OrderItem {
  id              String               @id @default(cuid())
  orderId         String
  productId       String
  quantity        Int
  unitPrice       Decimal              @db.Decimal(10, 2)
  order           Order                @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product         Product              @relation(fields: [productId], references: [id])
  customization   ProductCustomization?

  @@index([orderId])
}

model ProductCustomization {
  id                  String    @id @default(cuid())
  orderItemId         String    @unique
  chocolateBase       ChocolateBase
  filling             Filling
  personalizedName    String?
  customerVision      String?
  inspirationImageUrl String?
  adminNotes          String?
  orderItem           OrderItem @relation(fields: [orderItemId], references: [id], onDelete: Cascade)
}

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

model GalleryImage {
  id           String  @id @default(cuid())
  imageUrl     String
  caption      String?
  displayOrder Int     @default(0)

  @@index([displayOrder])
}

model WebsiteSetting {
  id                  String  @id @default(cuid())
  businessName        String
  logoUrl             String?
  contactNumber       String
  instagramLink       String?
  deliveryInformation String?
  businessAddress     String?
  heroImageUrl        String?
}

enum PaymentMethod {
  CASH_ON_DELIVERY
  BANK_TRANSFER
  JAZZCASH
}

enum PaymentStatus {
  PENDING
  VERIFIED
  REJECTED
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  READY
  DELIVERED
  CANCELLED
}

enum ChocolateBase {
  DARK
  MILK
  WHITE
}

enum Filling {
  SOLID
  COCONUT_CREME
  GOLDEN_CARAMEL
  CHERRY_BLISS
  LOTUS_BISCOFF
  PEANUT_PRALINE
}
```

### Order Number Generation

Order numbers use the format `DB-YYYYMMDD-XXXX` where `XXXX` is a zero-padded 4-digit random number. This is generated server-side at checkout and checked for uniqueness before insertion.

### Checkout Flow Data Flow

```
1. Client submits CheckoutForm (FormData for multipart)
2. POST /api/checkout validates input with Zod schema
3. Upsert Customer by phoneNumber
4. Generate unique orderNumber
5. Upload paymentScreenshot → return URL (if applicable)
6. Create Order + OrderItems in a Prisma transaction
7. For each Signature Bar item: create ProductCustomization
8. Return { orderNumber, customerId }
9. Client clears cart, navigates to /order-confirmation/[orderNumber]
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Cart total invariant

*For any* collection of cart items with non-negative quantities and non-negative unit prices, the cart total must equal the sum of (quantity × unitPrice) for all items in the collection.

**Validates: Requirements 4.4**

### Property 2: Cart item add/retrieve round trip

*For any* valid product added to the cart, the cart must subsequently contain an item whose productId matches the added product and whose quantity reflects the cumulative additions.

**Validates: Requirements 4.1, 4.5**

### Property 3: Whitespace-only cart rejection

*For any* cart item whose name or essential fields consist entirely of whitespace, the cart add operation must reject the item and leave the cart unchanged.

**Validates: Requirements 4.1**

### Property 4: Checkout validation rejects incomplete data

*For any* checkout submission missing one or more required fields (fullName, phoneNumber, deliveryAddress, city, paymentMethod), the API must return a validation error and must NOT create an Order record.

**Validates: Requirements 5.3**

### Property 5: Order creation atomicity

*For any* valid checkout submission, either all records (Customer upsert, Order, OrderItems, ProductCustomization where applicable) are created successfully, or none are — the database must never be left in a partially-created order state.

**Validates: Requirements 5.4**

### Property 6: Customization required fields enforcement

*For any* Signature Chocolate Bar cart item, adding it to the cart must be rejected if chocolateBase or filling is absent, and the cart must remain unchanged.

**Validates: Requirements 6.2**

### Property 7: Customization data round trip

*For any* valid customization data object (base, filling, optional fields), serializing it into a cart item and then reading it back must produce an equivalent customization data object with no field loss.

**Validates: Requirements 6.4, 6.5**

### Property 8: File upload type and size enforcement

*For any* file uploaded to any upload endpoint, if the file's MIME type is not in {image/jpeg, image/png, image/webp, image/gif} or its size exceeds 5 MB, the upload must be rejected with an appropriate error message and no file must be stored.

**Validates: Requirements 18.1, 18.2**

### Property 9: Search results subset invariant

*For any* product search query applied to a product catalogue, every product in the result set must contain the search query string (case-insensitive) in its name or description, and no result may be a product with `active = false`.

**Validates: Requirements 3.2, 3.7**

### Property 10: Category filter subset invariant

*For any* category filter applied to a product catalogue, every product in the result set must belong to the selected category, and the result set must be a subset of all active products.

**Validates: Requirements 3.3, 3.7**

### Property 11: Admin JWT authentication gate

*For any* request to a protected admin API endpoint, if the request does not carry a valid, non-expired JWT cookie, the API must return HTTP 401 and must NOT return any protected data.

**Validates: Requirements 11.5**

### Property 12: Password hash irreversibility

*For any* admin password string, the stored value must be a bcrypt hash (not the plaintext), and the stored hash must never equal the original plaintext string.

**Validates: Requirements 19.2**

### Property 13: Order total consistency

*For any* placed order, the stored `totalAmount` on the Order record must equal the sum of (quantity × unitPrice) across all OrderItems belonging to that order.

**Validates: Requirements 5.4, 4.4**

---

## Error Handling

### Client-Side Error Handling

All forms use React Hook Form with Zod resolvers for inline field-level validation before submission. Server errors are displayed via toast notifications. The cart persists across errors.

```typescript
// Standard form error pattern
const { register, handleSubmit, formState: { errors } } = useForm<CheckoutSchema>({
  resolver: zodResolver(checkoutSchema),
});
// fieldError displayed as red text below each input
```

### API Error Handling

All API routes return consistent `ApiResponse<T>` shapes. Unhandled exceptions are caught by a top-level try/catch and return HTTP 500 with `{ success: false, error: "Something went wrong. Please try again." }` — never exposing internal details.

```typescript
// lib/api-handler.ts — wraps all route handlers
export function withErrorHandling(handler: RouteHandler): RouteHandler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error('[API Error]', error);  // server-side log only
      return NextResponse.json(
        { success: false, error: 'Something went wrong. Please try again.' },
        { status: 500 }
      );
    }
  };
}
```

### Validation Layer

All API input is validated with Zod schemas before reaching business logic. Field-level errors are returned as `fieldErrors: Record<string, string>` on HTTP 400 responses.

### Database Error Handling

Prisma unique constraint violations (e.g., duplicate `orderNumber`) are caught specifically and trigger a retry with a new generated number. Other Prisma errors are logged server-side and surfaced as generic 500 errors.

### File Upload Errors

Upload failures in production (Cloudinary errors) are caught and return HTTP 422 with a specific message. The checkout transaction does not begin until the upload is confirmed.

### Not Found Handling

Dynamic pages (`/product/[slug]`, `/order-confirmation/[orderNumber]`) call `notFound()` from `next/navigation` when the resource is not found, rendering the Next.js 404 page.

---

## Testing Strategy

### Assessment: Is Property-Based Testing (PBT) Applicable?

Yes — this application contains significant pure business logic (cart calculations, input validation, data transformation, serialization) that benefits strongly from property-based testing. PBT applies to: cart state management, form validation schemas, file upload validation, search/filter logic, order total calculation, and customization data handling.

PBT does NOT apply to: UI rendering (React components), database integration (Prisma queries against a real DB), Next.js routing, Cloudinary uploads, or Framer Motion animations.

### Property-Based Testing Setup

**Library:** [fast-check](https://github.com/dubzzz/fast-check) (TypeScript-native, excellent arbitrary generators)

**Configuration:** Each property test runs a minimum of 100 iterations.

**Tag format:** `// Feature: divine-bytes-ecommerce, Property N: <property_text>`

### Unit and Property Test Files

```
__tests__/
  unit/
    cart/
      cartReducer.test.ts         ← Properties 1, 2, 3
    checkout/
      checkoutValidation.test.ts  ← Properties 4
    customization/
      customizationValidation.test.ts  ← Properties 6, 7
    upload/
      fileValidation.test.ts      ← Property 8
    search/
      productSearch.test.ts       ← Properties 9, 10
    auth/
      jwtMiddleware.test.ts       ← Property 11
      passwordHash.test.ts        ← Property 12
    orders/
      orderTotal.test.ts          ← Property 13, 5
  integration/
    api/
      products.test.ts
      checkout.test.ts
      admin-auth.test.ts
      admin-orders.test.ts
```

### Dual Testing Approach

**Property tests** (fast-check) verify universal correctness properties across generated inputs — catching edge cases like floating-point price arithmetic, boundary values in validation, empty strings vs. whitespace strings, and file byte patterns.

**Unit tests** (Jest + Testing Library) verify specific examples: known product fixtures render correctly, the order confirmation page shows the correct order number, toast notifications appear after cart add.

**Integration tests** (Jest + Prisma test DB) verify API route behavior end-to-end with a real SQLite or test PostgreSQL database — covering the checkout transaction, admin auth flow, and product CRUD.

### Test Commands

```bash
pnpm test              # run all tests once
pnpm test:unit         # run unit + property tests only
pnpm test:integration  # run integration tests only
pnpm test:coverage     # generate coverage report
```
