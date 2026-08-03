# Requirements Document

## Introduction

Divine Bytes is a luxury handcrafted chocolate brand that requires a premium e-commerce website to replace its existing WhatsApp catalogue as the primary sales platform. The website must deliver a beautiful, mobile-first shopping experience enabling customers to browse products, customize the Signature Chocolate Bar, place secure orders, and interact with the brand. An admin dashboard allows the Divine Bytes team to manage products, orders, gallery content, and website settings without touching code. The platform must communicate luxury, craftsmanship, warmth, and trust in every interaction.

---

## Glossary

- **Website**: The Divine Bytes Next.js full-stack web application.
- **Customer**: An unauthenticated user browsing and purchasing on the customer-facing website.
- **Admin**: An authenticated administrator operating the admin dashboard.
- **Product**: A purchasable chocolate item in the Divine Bytes catalogue.
- **Cart**: The in-session collection of products a Customer intends to purchase.
- **Order**: A confirmed purchase record created when a Customer completes checkout.
- **Customization**: The set of options (base, filling, name, vision, image) attached to a Signature Chocolate Bar order item.
- **Payment_Screenshot**: An image file uploaded by a Customer as proof of Bank Transfer or JazzCash payment.
- **Gallery**: The curated collection of luxury photography displayed on the website.
- **Slug**: A URL-safe, lowercase, hyphenated string uniquely identifying a Product or Category.
- **JWT**: JSON Web Token used for admin authentication stored in an HTTP-only cookie.
- **Prisma**: The ORM used for all database interactions, providing SQL injection protection.
- **Cloudinary**: The production image storage and optimization service.
- **Neon**: The production PostgreSQL database service hosted on Neon.
- **Vercel**: The hosting platform for the Next.js application.

---

## Requirements

### Requirement 1: Project Foundation and Configuration

**User Story:** As a developer, I want a properly configured Next.js project, so that the codebase is maintainable, consistent, and ready for feature development.

#### Acceptance Criteria

1. THE Website SHALL be built with Next.js, React, and TypeScript with strict type checking enabled.
2. THE Website SHALL use Tailwind CSS configured with the Divine Bytes design tokens: Deep Navy (`#1B2A4A`), Warm White (`#FAF8F5`), Luxury Gold (`#C9A84C`), Chocolate Brown (`#3E1F00`), and Dark Gray (`#2D2D2D`).
3. THE Website SHALL use Playfair Display for headings and Inter for body text, loaded via Next.js font optimization.
4. THE Website SHALL configure responsive breakpoints: Mobile (320px–767px), Tablet (768px–1023px), Desktop (1024px+).
5. THE Website SHALL use Framer Motion for all animations with durations between 150ms and 400ms.
6. THE Website SHALL use Prisma ORM connected to a PostgreSQL database via the `DATABASE_URL` environment variable.
7. THE Website SHALL store all secrets (database credentials, JWT secret, Cloudinary keys) in environment variables and never commit them to version control.
8. THE Website SHALL use ESLint and Prettier for consistent code formatting and quality.

---

### Requirement 2: Database Schema

**User Story:** As a developer, I want a complete, well-structured database schema, so that all application data is stored consistently and relationships are enforced.

#### Acceptance Criteria

1. THE Prisma schema SHALL define a `Product` model with fields: `id`, `name`, `slug` (unique), `description`, `price` (Decimal), `categoryId`, `stockQuantity`, `featured` (Boolean), `active` (Boolean), `createdAt`, `updatedAt`.
2. THE Prisma schema SHALL define a `ProductImage` model with fields: `id`, `productId`, `imageUrl`, `displayOrder`, `altText`, linked to `Product` via foreign key.
3. THE Prisma schema SHALL define a `Category` model with fields: `id`, `name`, `slug` (unique).
4. THE Prisma schema SHALL define a `Customer` model with fields: `id`, `fullName`, `phoneNumber`, `email` (optional), `address`, `city`, `createdAt`.
5. THE Prisma schema SHALL define an `Order` model with fields: `id`, `orderNumber` (unique), `customerId`, `paymentMethod`, `paymentStatus`, `orderStatus`, `deliveryAddress`, `city`, `totalAmount`, `notes` (optional), `paymentScreenshotUrl` (optional), `createdAt`.
6. THE Prisma schema SHALL define an `OrderItem` model with fields: `id`, `orderId`, `productId`, `quantity`, `unitPrice`, linked to `Order` and `Product` via foreign keys.
7. THE Prisma schema SHALL define a `ProductCustomization` model with fields: `id`, `orderItemId` (unique), `chocolateBase`, `filling`, `personalizedName` (optional), `customerVision` (optional), `inspirationImageUrl` (optional), `adminNotes` (optional), linked to `OrderItem` via foreign key.
8. THE Prisma schema SHALL define an `AdminUser` model with fields: `id`, `email` (unique), `passwordHash`, `createdAt`.
9. THE Prisma schema SHALL define a `GalleryImage` model with fields: `id`, `imageUrl`, `caption` (optional), `displayOrder`.
10. THE Prisma schema SHALL define a `WebsiteSetting` model with fields: `id`, `businessName`, `logoUrl`, `contactNumber`, `instagramLink`, `deliveryInformation`, `businessAddress`, `heroImageUrl`.
11. THE Database SHALL be seeded with all six products (Heart Chocolates PKR 1,499; Nut Filled Chocolates PKR 2,499; Flavour Bombs PKR 2,499; Signature Chocolate Bar PKR 1,299; Waffle Fingers PKR 999; Cookies PKR 500), their categories, and default website settings.
12. THE Prisma schema SHALL define indexes on `Product.slug`, `Product.categoryId`, `Order.orderNumber`, and `Order.customerId` for query performance.

---

### Requirement 3: Customer Product Browsing

**User Story:** As a Customer, I want to browse the chocolate catalogue, so that I can discover products and find what I want to purchase.

#### Acceptance Criteria

1. THE Website SHALL display all active products on the Shop page in a responsive grid (1 column mobile, 2 columns tablet, 3–4 columns desktop).
2. WHEN a Customer searches for a product by name or description, THE Website SHALL return only products whose name or description contains the search query (case-insensitive).
3. WHEN a Customer selects a category filter, THE Website SHALL display only products belonging to the selected category.
4. WHEN no products match the applied search or filter, THE Website SHALL display the empty state message "No chocolates matched your search."
5. WHEN a Customer clicks a product card, THE Website SHALL navigate to the product details page at the URL `/product/{slug}`.
6. THE Product_Details_Page SHALL display the product name, price in PKR, full description, product images (swipeable gallery on mobile), a quantity selector, and an Add to Cart button.
7. WHEN a product has `active = false`, THE Website SHALL exclude it from all customer-facing product listings and detail pages.
8. THE Website SHALL display a sticky "Add to Cart" action section at the bottom of the viewport on mobile product detail pages.

---

### Requirement 4: Shopping Cart

**User Story:** As a Customer, I want to manage a shopping cart, so that I can collect items before purchasing.

#### Acceptance Criteria

1. WHEN a Customer clicks "Add to Cart" on a product, THE Cart SHALL add the product with a quantity of 1 if it is not already present, or increment the quantity by 1 if it is already present.
2. WHEN a Customer updates the quantity of a cart item to a value greater than 0, THE Cart SHALL update the item quantity to the new value.
3. WHEN a Customer updates the quantity of a cart item to 0 or clicks "Remove", THE Cart SHALL remove that item from the cart.
4. THE Cart SHALL display the subtotal for each line item (unit price × quantity) and the order total (sum of all line item subtotals).
5. THE Cart SHALL persist its state in the browser (localStorage) so items are not lost on page navigation or browser refresh.
6. THE Website SHALL display a cart item count badge on the navigation cart icon whenever the cart contains one or more items.
7. THE Cart SHALL display the empty state message "Your cart is waiting for something delicious." when it contains no items.
8. WHEN a Customer clicks "Proceed to Checkout", THE Website SHALL navigate to the Checkout page.

---

### Requirement 5: Checkout and Order Placement

**User Story:** As a Customer, I want to complete a checkout, so that I can place an order and receive my chocolates.

#### Acceptance Criteria

1. THE Checkout_Page SHALL collect: Full Name (required), Phone Number (required, Pakistani format), Email (optional), Delivery Address (required), City (required), Payment Method (required: Cash on Delivery | Bank Transfer | JazzCash), and Additional Notes (optional).
2. WHEN a Customer selects Bank Transfer or JazzCash as the payment method, THE Checkout_Page SHALL display a file upload field for the Payment_Screenshot.
3. WHEN a Customer submits the checkout form with one or more required fields empty, THE Checkout_Page SHALL display inline validation errors identifying each missing field and SHALL NOT submit the order.
4. WHEN a Customer submits a valid checkout form, THE Website SHALL create a Customer record (if the phone number does not already exist), create an Order record, create OrderItem records for each cart item, and return a unique Order Number.
5. WHEN a checkout submission includes a Payment_Screenshot, THE Website SHALL upload the file to the configured storage (local in development, Cloudinary in production) and store the resulting URL on the Order record.
6. WHEN an order is successfully placed, THE Website SHALL navigate to the Order Confirmation page displaying the Order Number, order summary, and a message to contact Divine Bytes via WhatsApp for updates.
7. WHEN an order is successfully placed, THE Website SHALL clear the shopping cart.
8. IF a checkout form submission fails due to a server error, THEN THE Checkout_Page SHALL display the message "Something went wrong. Please try again." without clearing the customer's entered data.

---

### Requirement 6: Signature Chocolate Bar Customization

**User Story:** As a Customer, I want to customize a Signature Chocolate Bar, so that I can create a personalized gift or treat.

#### Acceptance Criteria

1. WHEN a Customer views the Signature Chocolate Bar product detail page, THE Website SHALL display a Customization Panel with the following fields: Chocolate Base (required dropdown: Dark Chocolate | Milk Chocolate | White Chocolate), Filling (required dropdown: Solid Chocolate | Coconut Crème | Golden Caramel | Cherry Bliss | Lotus Biscoff Crème | Peanut Praline), Personalized Name (optional text, maximum 50 characters), Your Vision (optional textarea, maximum 500 characters), Inspiration Image (optional file upload).
2. WHEN a Customer clicks "Add to Cart" on the Signature Chocolate Bar without selecting a Chocolate Base and Filling, THE Website SHALL display an inline validation error and SHALL NOT add the item to the cart.
3. WHEN a Customer uploads an Inspiration Image, THE Website SHALL display a preview of the uploaded image within the Customization Panel before the item is added to the cart.
4. WHEN a customized Signature Chocolate Bar is added to the cart, THE Cart SHALL store the customization data (base, filling, name, vision, inspiration image) alongside the cart item.
5. WHEN an Order containing a Signature Chocolate Bar is placed, THE Website SHALL create a `ProductCustomization` record linked to the corresponding `OrderItem`, storing all customization details.
6. THE Website SHALL display the note "Our team will review your customization and contact you if clarification is needed before production begins." on the Signature Chocolate Bar product detail page.

---

### Requirement 7: Gallery

**User Story:** As a Customer, I want to browse a luxury photo gallery, so that I can appreciate the craftsmanship of Divine Bytes chocolates and feel inspired to purchase.

#### Acceptance Criteria

1. THE Gallery_Page SHALL display all active gallery images ordered by `displayOrder` ascending.
2. THE Gallery_Page SHALL use a masonry layout on desktop and a horizontal scroll layout on mobile.
3. WHEN a Customer taps or clicks a gallery image, THE Website SHALL display the image in a fullscreen lightbox overlay.
4. THE Gallery_Page SHALL lazy-load images as they enter the viewport to maintain performance.
5. WHEN no gallery images are available, THE Gallery_Page SHALL display the empty state message "New creations are coming soon."

---

### Requirement 8: Static Content Pages

**User Story:** As a Customer, I want to read information about Divine Bytes, so that I can understand the brand, contact the team, and find answers to common questions.

#### Acceptance Criteria

1. THE About_Page SHALL display a hero image, brand story, mission statement, crafting process description, packaging showcase, and a Call to Action linking to the Shop page.
2. THE Contact_Page SHALL display a WhatsApp link, an Instagram link, and a contact form with fields: Full Name (required), Phone Number (required), Message (required).
3. WHEN a Customer submits the contact form with all required fields completed, THE Website SHALL POST the data to `POST /api/contact` and display a toast notification "Message sent successfully."
4. IF the contact form submission fails, THEN THE Website SHALL display the toast notification "Failed to send message. Please try again."
5. THE FAQ_Page SHALL display questions and answers in an accordion layout where clicking a question toggles its answer with a smooth animation.
6. THE Privacy_Policy_Page SHALL display the full privacy policy content.
7. THE Terms_Page SHALL display the full terms and conditions content.
8. THE Footer SHALL appear on every customer-facing page and contain: logo, navigation links, contact number, WhatsApp link, Instagram link, and links to Privacy Policy and Terms & Conditions.

---

### Requirement 9: Homepage Experience

**User Story:** As a Customer, I want to land on a captivating homepage, so that I immediately understand the brand and feel drawn to explore the products.

#### Acceptance Criteria

1. THE Homepage SHALL contain the following sections in order: Hero, Featured Collection, Best Sellers, Why Divine Bytes, Signature Product Highlight, Gallery Preview, Customer Reviews Placeholder, Instagram Preview, Footer.
2. THE Hero_Section SHALL occupy a minimum of 85% of the viewport height on mobile and SHALL contain a headline, subheading, a primary CTA button "Shop Collection" linking to `/shop`, and a secondary CTA button "Explore Our Story" linking to `/about`.
3. THE Featured_Collection_Section SHALL display products marked as `featured = true` in a horizontally scrollable carousel on mobile and a grid on desktop.
4. THE Why_Divine_Bytes_Section SHALL display three cards: "Premium Ingredients", "Handcrafted with Care", "Beautifully Giftable", each with an icon and short description.
5. THE Signature_Product_Highlight_Section SHALL display the Signature Chocolate Bar with a "Customize Yours" button linking to `/product/signature-chocolate-bar`.
6. THE Gallery_Preview_Section SHALL display a subset of up to 6 gallery images with a "View Gallery" link to `/gallery`.
7. THE Instagram_Preview_Section SHALL display an Instagram link and CTA "Follow Divine Bytes".

---

### Requirement 10: Navigation

**User Story:** As a Customer, I want consistent, intuitive navigation, so that I can move between pages effortlessly on any device.

#### Acceptance Criteria

1. THE Navbar SHALL be sticky (fixed to the top of the viewport) on both mobile and desktop.
2. THE Desktop_Navbar SHALL display: logo on the left, centered navigation links (Home, Shop, Gallery, About, Contact, FAQ), and a cart icon with item count badge on the right.
3. THE Mobile_Navbar SHALL display: logo, cart icon with item count badge, and a hamburger menu icon; tapping the hamburger icon SHALL open a slide-in navigation drawer.
4. THE Navigation_Drawer SHALL display all navigation links and SHALL close when a link is tapped or the overlay is tapped.
5. THE Navbar SHALL indicate the currently active page by visually highlighting the corresponding navigation link.

---

### Requirement 11: Admin Authentication

**User Story:** As an Admin, I want to log in securely, so that I can access the dashboard and manage the business.

#### Acceptance Criteria

1. THE Admin_Login_Page SHALL be accessible at `/admin/login` and SHALL contain email and password fields and a "Sign In" button.
2. WHEN an Admin submits valid credentials, THE Website SHALL issue a JWT stored in an HTTP-only, Secure, SameSite=Strict cookie and redirect to `/admin/dashboard`.
3. WHEN an Admin submits invalid credentials, THE Admin_Login_Page SHALL display the error "Invalid email or password." and SHALL NOT redirect.
4. WHILE an Admin is authenticated, THE Website SHALL include the JWT cookie on all admin API requests automatically.
5. WHEN a JWT cookie is absent or expired, THE Website SHALL redirect any request to a protected admin route to `/admin/login`.
6. THE Admin_Logout_Action SHALL clear the JWT cookie and redirect to `/admin/login`.
7. THE Admin_Login_Page SHALL rate-limit login attempts to a maximum of 5 attempts per IP address per 15-minute window; IF the limit is exceeded, THEN THE Admin_Login_Page SHALL return HTTP 429 and display "Too many login attempts. Please try again later."

---

### Requirement 12: Admin Dashboard Overview

**User Story:** As an Admin, I want a dashboard overview, so that I can quickly see the business status without drilling into individual sections.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display the following summary statistics: total orders, total revenue (sum of all order totals in PKR), pending orders count, and pending payment verification count.
2. THE Admin_Dashboard SHALL display the 5 most recent orders with order number, customer name, total, payment method, and order status.
3. THE Admin_Dashboard SHALL be accessible only to authenticated admins; unauthenticated requests SHALL be redirected to `/admin/login`.

---

### Requirement 13: Admin Product Management

**User Story:** As an Admin, I want to create, edit, and delete products, so that the catalogue stays up to date without requiring code changes.

#### Acceptance Criteria

1. THE Admin_Products_Page SHALL display all products in a table showing name, price, category, stock quantity, featured status, and active status.
2. WHEN an Admin submits a valid product creation form, THE Website SHALL create a new Product record and display a toast notification "Product created successfully."
3. THE Product_Form SHALL require: name, slug (auto-generated from name, editable), description, price (positive decimal), category, stock quantity (non-negative integer), featured (boolean), active (boolean).
4. WHEN an Admin uploads product images, THE Website SHALL upload each image to the configured storage and create `ProductImage` records with the correct `displayOrder`.
5. WHEN an Admin edits a product and submits the form, THE Website SHALL update the Product record and display a toast notification "Product updated successfully."
6. WHEN an Admin deletes a product, THE Website SHALL soft-delete the product by setting `active = false` (not physically deleting it) and display a toast notification "Product removed from catalogue."
7. IF a product creation or update fails validation, THEN THE Admin_Products_Page SHALL display inline field-level error messages.

---

### Requirement 14: Admin Order Management

**User Story:** As an Admin, I want to view and manage all orders, so that I can fulfill them and keep customers informed.

#### Acceptance Criteria

1. THE Admin_Orders_Page SHALL display all orders in a table sorted by `createdAt` descending, showing order number, customer name, phone number, total, payment method, payment status, and order status.
2. WHEN an Admin clicks an order, THE Website SHALL display an order detail view showing all order fields, the list of order items with quantities and unit prices, and — if a `ProductCustomization` exists — all customization details including the inspiration image.
3. WHEN an Admin updates an order status, THE Website SHALL update the `orderStatus` field and display a toast notification "Order status updated."
4. WHEN an Admin verifies a payment, THE Website SHALL update the `paymentStatus` to "Verified" and display a toast notification "Payment verified."
5. THE Admin_Orders_Page SHALL provide filters for order status and payment status to narrow the displayed list.
6. WHEN an order includes a Payment_Screenshot, THE Admin_Orders_Page SHALL display a link or thumbnail to view the uploaded screenshot.

---

### Requirement 15: Admin Customer Management

**User Story:** As an Admin, I want to view customer records, so that I can understand who is purchasing and contact them if needed.

#### Acceptance Criteria

1. THE Admin_Customers_Page SHALL display all customers in a table showing full name, phone number, email (if provided), city, and total number of orders placed.
2. THE Admin_Customers_Page SHALL be read-only; admins SHALL NOT be able to create or delete customer records through this interface.

---

### Requirement 16: Admin Gallery Management

**User Story:** As an Admin, I want to manage the gallery, so that the website always showcases the most inspiring, up-to-date photography.

#### Acceptance Criteria

1. THE Admin_Gallery_Page SHALL display all gallery images with their captions and display order.
2. WHEN an Admin uploads a new gallery image with an optional caption, THE Website SHALL upload the image to the configured storage, create a `GalleryImage` record, and display a toast notification "Image added to gallery."
3. WHEN an Admin deletes a gallery image, THE Website SHALL delete the `GalleryImage` record and display a toast notification "Image removed from gallery."
4. WHEN an Admin changes the display order of gallery images by reordering them, THE Website SHALL update the `displayOrder` values to reflect the new sequence.

---

### Requirement 17: Admin Website Settings

**User Story:** As an Admin, I want to update website settings, so that I can keep business information and homepage content current without touching code.

#### Acceptance Criteria

1. THE Admin_Settings_Page SHALL display editable fields for: Business Name, Logo (image upload), Contact Number, Instagram Link, Delivery Information, Business Address, and Hero Image (image upload).
2. WHEN an Admin saves the settings form, THE Website SHALL update the `WebsiteSetting` record, update any uploaded images in the configured storage, and display a toast notification "Settings saved successfully."
3. THE Website SHALL use the `WebsiteSetting` record values to render the logo, hero image, contact number, Instagram link, delivery information, and business address on all relevant customer-facing pages.

---

### Requirement 18: File Upload Security

**User Story:** As a developer, I want all file uploads to be validated and secured, so that malicious files cannot be stored or served through the platform.

#### Acceptance Criteria

1. THE Website SHALL accept only image files (JPEG, PNG, WebP, GIF) for all upload endpoints; IF a non-image file type is uploaded, THEN THE Website SHALL reject the upload with the error "Only image files are accepted."
2. THE Website SHALL enforce a maximum file size of 5 MB per upload; IF a file exceeds this limit, THEN THE Website SHALL reject the upload with the error "File size must not exceed 5 MB."
3. THE Website SHALL generate a unique filename (UUID-based) for every uploaded file to prevent filename collisions and path traversal attacks.
4. THE Website SHALL validate MIME type by reading the file's magic bytes in addition to checking the file extension.
5. THE Website SHALL never serve uploaded files through a path that allows directory traversal.

---

### Requirement 19: Security Controls

**User Story:** As a developer, I want comprehensive security controls implemented, so that customer data and admin access are protected from common web vulnerabilities.

#### Acceptance Criteria

1. THE Website SHALL enforce HTTPS by redirecting all HTTP requests to HTTPS in the production environment.
2. THE Website SHALL hash all admin passwords using bcrypt with a minimum cost factor of 12 before storing them in the database.
3. THE Website SHALL include CSRF protection on all state-mutating API routes (POST, PUT, DELETE) using the SameSite=Strict cookie attribute and origin validation.
4. THE Website SHALL sanitize all user-supplied input before rendering it in HTML to prevent XSS attacks.
5. THE Website SHALL use Prisma parameterized queries exclusively for all database operations, preventing SQL injection.
6. THE Website SHALL rate-limit the admin login endpoint to 5 attempts per IP per 15 minutes and all public API endpoints to 100 requests per IP per minute.
7. THE Website SHALL never expose stack traces, database errors, or internal paths in API responses returned to clients.

---

### Requirement 20: Performance and SEO

**User Story:** As a developer, I want the website to meet performance and SEO targets, so that customers have a fast, discoverable experience.

#### Acceptance Criteria

1. THE Website SHALL achieve Lighthouse scores of 95 or above for Performance, Accessibility, Best Practices, and SEO on both mobile and desktop.
2. THE Website SHALL use the Next.js `<Image>` component for all product and gallery images with lazy loading, responsive `srcset`, and modern format (WebP) support.
3. EVERY customer-facing page SHALL include a unique `<title>`, `<meta name="description">`, Open Graph `<og:title>`, `<og:description>`, and `<og:image>` tags.
4. THE Website SHALL generate a `sitemap.xml` and `robots.txt` at build time covering all customer-facing pages.
5. THE Website SHALL use SEO-friendly URLs: `/shop`, `/product/{slug}`, `/gallery`, `/about`, `/contact`, `/faq`.
6. THE Website SHALL implement structured data (JSON-LD) for Product pages using the `schema.org/Product` type.

---

### Requirement 21: Accessibility

**User Story:** As a developer, I want the website to be accessible, so that all customers can use it regardless of ability or input method.

#### Acceptance Criteria

1. THE Website SHALL ensure all interactive elements (buttons, links, inputs) have a minimum touch target size of 44 × 44 pixels.
2. THE Website SHALL provide descriptive `alt` text for all product images and gallery images.
3. THE Website SHALL maintain a color contrast ratio of at least 4.5:1 for all normal text and 3:1 for large text against their backgrounds.
4. THE Website SHALL support full keyboard navigation; all interactive elements SHALL be reachable and operable using Tab, Enter, and Space keys.
5. THE Website SHALL use semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<section>`, `<button>`, `<label>`) throughout.
6. THE Website SHALL display a visible focus indicator on all focusable elements when navigated via keyboard.

---

### Requirement 22: Deployment and Environment Configuration

**User Story:** As a developer, I want the website deployed and correctly configured per environment, so that the production site is stable and performant.

#### Acceptance Criteria

1. THE Website SHALL be deployed to Vercel with the production database on Neon PostgreSQL.
2. THE Website SHALL use Cloudinary for image storage in the production environment and local disk storage in the development environment, controlled by the `NODE_ENV` environment variable.
3. THE Website SHALL configure a custom domain via Namecheap with HTTPS enforced.
4. THE Website SHALL use Next.js production build optimizations (static generation for suitable pages, ISR for product pages, server-side rendering for dynamic pages).
5. THE Website SHALL support separate `.env.development` and `.env.production` configurations.
