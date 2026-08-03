import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.websiteSetting.findFirst();
  if (existing) {
    await prisma.websiteSetting.update({
      where: { id: existing.id },
      data: {
        contactNumber: '+92315-7713874',
        instagramLink: 'https://www.instagram.com/divine_bytes.pk?igsh=MXJ3N2x3MHZiMms3eg==',
      },
    });
    console.log('✅ Settings updated');
  } else {
    console.log('No settings record found');
  }
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); process.exit(1); });
