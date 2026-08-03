import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find all products
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { displayOrder: 'asc' } } },
  });

  for (const product of products) {
    if (product.images.length <= 1) continue;

    console.log(`\n${product.name}: ${product.images.length} images`);

    // Keep only the LAST image (most recently uploaded) per product
    // Delete all but the last one
    const toDelete = product.images.slice(0, -1);
    for (const img of toDelete) {
      await prisma.productImage.delete({ where: { id: img.id } });
      console.log(`  Deleted duplicate: ${img.imageUrl.slice(-30)}`);
    }
    console.log(`  Kept: ${product.images[product.images.length - 1].imageUrl.slice(-30)}`);
  }

  const remaining = await prisma.productImage.count();
  console.log(`\n✅ Done. ${remaining} image records remaining.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
