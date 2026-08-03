import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
p.productImage.findMany({ include: { product: { select: { name: true } } } })
  .then(r => {
    console.log('Product Images in DB:');
    if (r.length === 0) { console.log('  None found.'); }
    r.forEach(i => console.log(`  [${i.product.name}] ${i.imageUrl}`));
    return p.$disconnect();
  });
