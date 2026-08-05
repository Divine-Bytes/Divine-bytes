export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess } from '@/lib/api-handler';
import prisma from '@/lib/prisma';

export const GET = withErrorHandling(async (_req: NextRequest) => {
  const images = await prisma.galleryImage.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return apiSuccess(images);
});
