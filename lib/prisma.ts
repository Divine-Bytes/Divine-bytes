import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Lazy getter — PrismaClient is only instantiated on first actual DB call,
// not at module import time (prevents build-time crashes on Vercel)
function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return globalForPrisma.prisma;
}

// Proxy that forwards all property accesses to the lazy PrismaClient instance
const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as any)[prop];
  },
});

export default prisma;
