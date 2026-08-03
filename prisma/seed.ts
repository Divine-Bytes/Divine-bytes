import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Divine Bytes database...');

  // ── Categories ────────────────────────────────────────────────────────────
  const chocolateBarsCategory = await prisma.category.upsert({
    where: { slug: 'chocolate-bars' },
    update: {},
    create: { name: 'Chocolate Bars', slug: 'chocolate-bars' },
  });

  await prisma.category.upsert({
    where: { slug: 'gift-boxes' },
    update: {},
    create: { name: 'Gift Boxes', slug: 'gift-boxes' },
  });

  const cookiesCategory = await prisma.category.upsert({
    where: { slug: 'cookies' },
    update: {},
    create: { name: 'Cookies', slug: 'cookies' },
  });

  const waffleCategory = await prisma.category.upsert({
    where: { slug: 'waffle-fingers' },
    update: {},
    create: { name: 'Waffle Fingers', slug: 'waffle-fingers' },
  });

  const chocolatesCategory = await prisma.category.upsert({
    where: { slug: 'chocolates' },
    update: {},
    create: { name: 'Chocolates', slug: 'chocolates' },
  });

  console.log('✅ Categories seeded');

  // ── Products ─────────────────────────────────────────────────────────────
  await prisma.product.upsert({
    where: { slug: 'heart-chocolates' },
    update: {},
    create: {
      name: 'Heart Chocolates',
      slug: 'heart-chocolates',
      description:
        'Four handcrafted chocolate hearts beautifully decorated for an elegant gifting experience. Each heart is crafted with premium chocolate and delicately finished to create a truly special gift.',
      price: 1499,
      categoryId: chocolatesCategory.id,
      stockQuantity: 50,
      featured: true,
      active: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'nut-filled-chocolates' },
    update: {},
    create: {
      name: 'Nut Filled Chocolates',
      slug: 'nut-filled-chocolates',
      description:
        'Premium handcrafted chocolates featuring rich chocolate and carefully selected nuts. A perfect combination of smooth chocolate and crunchy nuts for an indulgent experience.',
      price: 2499,
      categoryId: chocolatesCategory.id,
      stockQuantity: 40,
      featured: true,
      active: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'flavour-bombs' },
    update: {},
    create: {
      name: 'Flavour Bombs',
      slug: 'flavour-bombs',
      description:
        'A collection of twelve handcrafted chocolates featuring a variety of signature fillings. Each piece offers a burst of flavour — from rich caramel to delicate coconut crème.',
      price: 2499,
      categoryId: chocolatesCategory.id,
      stockQuantity: 35,
      featured: true,
      active: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'signature-chocolate-bar' },
    update: {},
    create: {
      name: 'Signature Chocolate Bar',
      slug: 'signature-chocolate-bar',
      description:
        'A handcrafted premium chocolate bar that can be personalized according to your preferences. Choose your chocolate base, select a filling, and add a personal touch to create something truly unique.',
      price: 1299,
      categoryId: chocolateBarsCategory.id,
      stockQuantity: 100,
      featured: true,
      active: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'chocolate-coated-waffle-fingers' },
    update: {},
    create: {
      name: 'Chocolate Coated Waffle Fingers',
      slug: 'chocolate-coated-waffle-fingers',
      description:
        'Six crispy waffle fingers coated in smooth milk chocolate. The perfect combination of satisfying crunch and creamy chocolate in every bite.',
      price: 999,
      categoryId: waffleCategory.id,
      stockQuantity: 60,
      featured: false,
      active: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'chocolate-chunk-cookies' },
    update: {},
    create: {
      name: 'Chocolate Chunk Cookies',
      slug: 'chocolate-chunk-cookies',
      description:
        'Two soft-baked chocolate chunk cookies with a rich, chewy center. Made with premium chocolate chunks and baked fresh for the ultimate cookie experience.',
      price: 500,
      categoryId: cookiesCategory.id,
      stockQuantity: 80,
      featured: false,
      active: true,
    },
  });

  console.log('✅ Products seeded');

  // ── Website Settings ──────────────────────────────────────────────────────
  const existingSettings = await prisma.websiteSetting.findFirst();
  if (!existingSettings) {
    await prisma.websiteSetting.create({
      data: {
        businessName: 'Divine Bytes',
        contactNumber: '+92315-7713874',
        instagramLink: 'https://www.instagram.com/divine_bytes.pk?igsh=MXJ3N2x3MHZiMms3eg==',
        deliveryInformation:
          'We deliver across Pakistan. Standard delivery takes 2-3 business days. Express delivery available for Karachi.',
        businessAddress: 'Karachi, Pakistan',
        heroImageUrl: null,
        logoUrl: null,
      },
    });
  } else {
    // Update existing settings with correct contact info
    await prisma.websiteSetting.update({
      where: { id: existingSettings.id },
      data: {
        contactNumber: '+92315-7713874',
        instagramLink: 'https://www.instagram.com/divine_bytes.pk?igsh=MXJ3N2x3MHZiMms3eg==',
      },
    });
  }

  console.log('✅ Website settings seeded');

  // ── Admin User ─────────────────────────────────────────────────────────────
  const existingAdmin = await prisma.adminUser.findFirst({
    where: { email: 'admin@divinebytes.com' },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 12);
    await prisma.adminUser.create({
      data: {
        email: 'admin@divinebytes.com',
        passwordHash,
      },
    });
    console.log('✅ Admin user seeded: admin@divinebytes.com / admin123');
  } else {
    console.log('ℹ️  Admin user already exists, skipping.');
  }

  console.log('');
  console.log('🎉 Seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
