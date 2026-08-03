import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 12);
  
  const existing = await prisma.adminUser.findFirst({ where: { email: 'admin@divinebytes.com' } });
  
  if (existing) {
    await prisma.adminUser.update({
      where: { id: existing.id },
      data: { passwordHash },
    });
    console.log('✅ Admin password reset successfully');
  } else {
    await prisma.adminUser.create({
      data: { email: 'admin@divinebytes.com', passwordHash },
    });
    console.log('✅ Admin user created');
  }
  
  console.log('Email: admin@divinebytes.com');
  console.log('Password: admin123');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
