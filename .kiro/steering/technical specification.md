---
inclusion: always
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 
# 🍫 Divine Bytes
# Technical Specification
Version: 2.0

---

# 1. Technology Stack

The application will be developed as a modern full-stack web application.

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion

---

## Backend

- Next.js API Routes

---

## Database

- PostgreSQL

---

## ORM

- Prisma ORM

---

## Authentication

- JWT Authentication
- Secure HTTP-only Cookies

---

## Image Storage

Development

- Local Storage

Production

- Cloudinary

---

## Deployment

Frontend + Backend

- Vercel

Database

- Neon PostgreSQL (Recommended)

Domain

- Namecheap

---

# 2. Application Architecture

The application consists of two primary systems.

Customer Website

↓

Backend API

↓

Database

↓

Admin Dashboard

The Admin Dashboard is protected and inaccessible to customers.

---

# 3. Mobile-First Development

This project follows a Mobile-First design philosophy.

Every page must be designed for smartphones before tablets and desktops.

The mobile experience takes priority over desktop.

Requirements:

- Fast loading
- Comfortable touch targets
- Sticky navigation
- Responsive layouts
- Optimized images
- One-handed usability

---

# 4. Responsive Breakpoints

Mobile

320px – 767px

Tablet

768px – 1023px

Desktop

1024px+

Layouts should adapt rather than simply shrink.

---

# 5. Performance Goals

Target Lighthouse Scores

Performance

95+

Accessibility

95+

Best Practices

95+

SEO

95+

Core Web Vitals should meet Google's recommended thresholds.

---

# 6. Database Schema

Tables

- Products
- Product Images
- Categories
- Customers
- Orders
- Order Items
- Product Customizations
- Admin Users
- Gallery Images
- Website Settings

---

# 7. Products Table

Fields

- ID
- Name
- Slug
- Description
- Price
- Category ID
- Stock Quantity
- Featured
- Active
- Created At
- Updated At

---

# 8. Product Images

Each product may have multiple images.

Fields

- ID
- Product ID
- Image URL
- Display Order
- Alt Text

---

# 9. Categories

Examples

- Chocolate Bars
- Gift Boxes
- Cookies
- Waffle Fingers

Fields

- ID
- Name
- Slug

---

# 10. Customers

Fields

- ID
- Full Name
- Phone Number
- Email (Optional)
- Address
- City
- Created At

Customer accounts are not required.

Customer records are automatically created when an order is placed.

---

# 11. Orders

Fields

- Order Number
- Customer ID
- Payment Method
- Payment Status
- Order Status
- Delivery Address
- City
- Total Amount
- Notes
- Created At

---

# 12. Order Items

Fields

- Order ID
- Product ID
- Quantity
- Unit Price

If the item is a Signature Chocolate Bar, it references a Product Customization record.

---

# 13. Product Customizations

Used only for Signature Chocolate Bars.

Fields

- ID
- Order Item ID
- Chocolate Base
- Filling
- Personalized Name
- Customer Vision
- Inspiration Image
- Admin Notes

No design generation is performed.

The customization request is reviewed manually by the Divine Bytes team.

---

# 14. Gallery Images

Fields

- ID
- Image URL
- Caption
- Display Order

Used on the Gallery page and Homepage.

---

# 15. Website Settings

Fields

- Business Name
- Logo
- Contact Number
- Instagram Link
- Delivery Information
- Business Address
- Hero Image

Editable from the Admin Dashboard.

---

# 16. Customer APIs

GET /products

GET /products/{slug}

GET /categories

GET /gallery

POST /cart

POST /checkout

POST /contact

---

# 17. Admin APIs

POST /admin/login

GET /admin/dashboard

GET /admin/orders

PUT /admin/orders/{id}

GET /admin/products

POST /admin/products

PUT /admin/products/{id}

DELETE /admin/products/{id}

GET /admin/gallery

POST /admin/gallery

DELETE /admin/gallery/{id}

GET /admin/settings

PUT /admin/settings

---

# 18. Authentication

Only administrators require authentication.

Customers may browse and purchase without creating an account.

Authentication

- Email
- Password
- JWT
- HTTP-only Cookies

Passwords must be hashed using bcrypt.

Sessions should expire automatically after inactivity.

---

# 19. Authorization

Protected Routes

Dashboard

Products

Orders

Customers

Gallery

Settings

Every protected API must verify authentication before returning data.

---

# 20. Security

The application must implement:

HTTPS

Password Hashing

CSRF Protection

XSS Protection

SQL Injection Protection

Rate Limiting

Secure File Upload Validation

Environment Variables

Input Validation

Output Sanitization

Sensitive information must never be exposed.

---

# 21. Payments

Supported Methods

- Cash on Delivery
- Bank Transfer
- JazzCash

If Bank Transfer or JazzCash is selected:

Customer uploads payment screenshot.

Admin verifies payment manually.

The application must never store banking credentials or PINs.

---

# 22. File Uploads

Supported Uploads

Payment Screenshots

Customization Inspiration Images

Requirements

Validate file type

Validate maximum file size

Generate unique filenames

Reject executable files

Store securely

---

# 23. Image Optimization

Product images should:

- Use Next.js Image component
- Lazy load automatically
- Support responsive image sizes
- Maintain consistent aspect ratios
- Use modern formats where possible

---

# 24. Error Handling

Display user-friendly messages.

Example

Instead of:

500 Internal Server Error

Display:

"Something went wrong. Please try again."

---

# 25. Logging

Log:

Admin Login

New Orders

Order Status Changes

Payment Uploads

Product Updates

Gallery Updates

Logs must never contain passwords or sensitive payment information.

---

# 26. SEO

Every page should include:

Unique Page Title

Meta Description

Open Graph Image

Structured Data

Canonical URL

Sitemap

Robots.txt

Example URLs

/shop

/product/signature-chocolate-bar

/gallery

---

# 27. Browser Support

Latest versions of:

- Chrome
- Safari
- Firefox
- Edge

Special attention must be given to mobile browsers.

---

# 28. Code Standards

Use TypeScript throughout the application.

Use reusable React components.

Avoid duplicated logic.

Follow clean architecture principles.

Use meaningful variable and function names.

Write modular code.

Comment complex business logic where appropriate.

---

# 29. Development Principles

Every technical decision should prioritize:

- Performance
- Maintainability
- Security
- Scalability
- Accessibility
- Mobile Experience
- Code Readability

The codebase should be easy to understand, test and extend.

---

# 30. Technical Acceptance Criteria

The application is considered technically complete when:

✓ Customers can browse all products.

✓ Customers can customize Signature Chocolate Bars using guided options.

✓ Customers can upload inspiration images.

✓ Customers can complete checkout securely.

✓ Administrators can manage products, gallery images, settings and orders.

✓ Payment screenshots are uploaded securely.

✓ The website performs well on mobile devices.

✓ Security best practices are implemented.

✓ The architecture supports future expansion without major restructuring.