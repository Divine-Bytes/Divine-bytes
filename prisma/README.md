# Divine Bytes — Prisma Database

## Setup

1. Copy `.env.example` to `.env.development` and fill in `DATABASE_URL`
2. Run migration: `pnpm prisma migrate dev --name init`
3. Generate client: `pnpm prisma generate`
4. Seed database: `pnpm prisma db seed`

## Schema

10 models: Category, Product, ProductImage, Customer, Order, OrderItem, ProductCustomization, AdminUser, GalleryImage, WebsiteSetting
