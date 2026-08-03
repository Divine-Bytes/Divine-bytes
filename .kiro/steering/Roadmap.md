---
inclusion: always
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 
# 🍫 Divine Bytes
# Development Roadmap
Version: 2.0

---

# Development Philosophy

The website must be developed incrementally.

Each phase should produce a fully functional, tested and stable version before moving to the next phase.

Kiro must never skip phases.

Each completed phase becomes the foundation for the next.

Priority Order

1. Stability
2. Security
3. User Experience
4. Visual Design
5. Performance
6. Optimization

---

# General Development Rules

Before starting each phase:

- Review the SRS.
- Review the UI/UX Specification.
- Review the Technical Specification.
- Review the Design System.
- Understand the objectives of the current phase.

After completing each phase:

- Test functionality.
- Test responsiveness.
- Fix discovered issues.
- Refactor code if necessary.
- Commit changes before moving forward.

Never continue if the current phase is incomplete.

---

# Phase 1 — Project Foundation

Objective

Create the project foundation.

Tasks

- Initialize Next.js project.
- Configure TypeScript.
- Configure Tailwind CSS.
- Configure Framer Motion.
- Configure Prisma ORM.
- Configure PostgreSQL.
- Configure ESLint and Prettier.
- Configure environment variables.
- Configure project folder structure.
- Configure global theme.
- Configure fonts.
- Configure responsive breakpoints.
- Configure reusable layouts.

Deliverable

A clean project structure with no business functionality.

---

# Phase 2 — Database Design

Objective

Create the database schema.

Tasks

Create tables:

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

Configure:

- Relationships
- Constraints
- Indexes
- Seed data

Deliverable

A complete database with seeded products and categories.

---

# Phase 3 — Backend APIs

Objective

Develop all backend services.

Customer APIs

- Products
- Categories
- Gallery
- Checkout
- Contact

Admin APIs

- Authentication
- Dashboard
- Products
- Orders
- Gallery
- Website Settings

Deliverable

A fully functional API layer tested independently from the frontend.

---

# Phase 4 — Authentication & Security

Objective

Secure the application.

Tasks

- Admin login
- Password hashing
- JWT authentication
- HTTP-only cookies
- Protected routes
- Protected APIs
- CSRF protection
- XSS protection
- SQL injection prevention
- Rate limiting
- Secure file uploads
- Input validation
- Error handling

Deliverable

A secure administrator authentication system.

---

# Phase 5 — Design System & Reusable Components

Objective

Build reusable UI components before creating pages.

Components

- Navbar
- Footer
- Buttons
- Product Card
- Gallery Card
- Inputs
- Select Dropdown
- Textarea
- Quantity Selector
- Modal
- Drawer
- Toast Notifications
- Image Gallery
- Loading Skeleton
- Empty State
- Breadcrumb
- Section Header

Deliverable

A reusable component library used throughout the project.

---

# Phase 6 — Customer Website

Objective

Build the customer-facing website.

Pages

- Home
- Shop
- Product Details
- Gallery
- About
- Contact
- FAQ
- Privacy Policy
- Terms & Conditions

Requirements

- Fully responsive
- Mobile-first
- Smooth animations
- Optimized images
- Accessible navigation

Deliverable

Customers can browse the complete website.

Shopping functionality is not yet implemented.

---

# Phase 7 — Shopping Experience

Objective

Build the shopping system.

Tasks

- Shopping cart
- Quantity controls
- Remove items
- Checkout
- Order summary
- Order confirmation
- Payment selection
- Payment screenshot upload
- Order validation

Deliverable

Customers can successfully place orders.

---

# Phase 8 — Signature Chocolate Bar Customization

Objective

Implement guided customization for the Signature Chocolate Bar.

Features

Chocolate Base

- Dark Chocolate
- Milk Chocolate
- White Chocolate

Chocolate Filling

- Solid Chocolate
- Coconut Crème
- Golden Caramel
- Cherry Bliss
- Lotus Biscoff Crème
- Peanut Praline

Additional Inputs

- Personalized Name
- Your Vision
- Inspiration Image Upload

Requirements

- Simple and intuitive layout.
- Mobile-friendly controls.
- Optional fields clearly marked.
- Uploaded images displayed before submission.

The website does not generate previews.

Customization requests are stored and reviewed manually.

Deliverable

Customers can submit complete customization requests.

---

# Phase 9 — Admin Dashboard

Objective

Build the administrator panel.

Pages

- Dashboard
- Products
- Orders
- Customers
- Gallery
- Website Settings

Functions

- Create products
- Edit products
- Delete products
- Manage gallery
- Update order status
- Verify payments
- View uploaded inspiration images
- Manage homepage content

Deliverable

Administrators can operate the business without modifying code.

---

# Phase 10 — Visual Polish

Objective

Refine the overall experience.

Tasks

Improve:

- Animations
- Typography
- White space
- Card layouts
- Mobile interactions
- Hover effects
- Scroll animations
- Image presentation
- Loading transitions

Verify brand consistency across every page.

Deliverable

A premium luxury shopping experience.

---

# Phase 11 — Testing & Quality Assurance

Objective

Verify stability and usability.

Devices

- Mobile
- Tablet
- Desktop

Browsers

- Chrome
- Safari
- Firefox
- Edge

Test

- Navigation
- Product browsing
- Search
- Filters
- Cart
- Checkout
- Payments
- Uploads
- Admin dashboard
- Responsiveness
- Accessibility

Fix all discovered issues.

Deliverable

A production-ready application.

---

# Phase 12 — Deployment

Objective

Deploy the website.

Tasks

- Configure production environment
- Connect production database
- Configure Cloudinary
- Configure HTTPS
- Configure Namecheap domain
- Generate sitemap
- Configure robots.txt
- Configure SEO metadata
- Deploy application

Deliverable

A publicly accessible production website.

---

# Git Workflow

Commit after every completed phase.

Example commits

feat: initialize project foundation

feat: create database schema

feat: implement backend APIs

feat: build customer storefront

feat: implement shopping cart

feat: add chocolate customization

feat: build admin dashboard

style: polish UI

fix: responsive improvements

refactor: optimize architecture

---

# Code Standards

Kiro must

- Use TypeScript everywhere.
- Write modular React components.
- Avoid duplicated code.
- Prefer reusable components over one-off implementations.
- Follow clean architecture principles.
- Keep business logic separate from UI components.
- Write descriptive variable and function names.
- Keep files organized by feature.

---

# Performance Standards

The website should maintain:

- Lighthouse Performance 95+
- Accessibility 95+
- Best Practices 95+
- SEO 95+

Animations should remain smooth on mid-range mobile devices.

Images must be optimized.

Avoid unnecessary JavaScript.

---

# Completion Checklist

The project is complete only when:

✓ Customers can browse all products.

✓ Customers can search and filter products.

✓ Customers can customize the Signature Chocolate Bar.

✓ Customers can upload inspiration images.

✓ Customers can securely complete checkout.

✓ Payment screenshots upload correctly.

✓ Administrators can manage products.

✓ Administrators can manage gallery images.

✓ Administrators can manage website settings.

✓ Administrators can update order statuses.

✓ The website performs exceptionally on mobile devices.

✓ The website is fully responsive.

✓ Security best practices are implemented.

✓ The visual experience reflects a premium handcrafted chocolate brand.

✓ The platform successfully replaces the WhatsApp catalogue as the primary sales channel.