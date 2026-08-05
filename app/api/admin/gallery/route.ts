export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// TODO: Add withAdminAuth(handler) protection - Task 4.4
import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess, apiError } from '@/lib/api-handler';
import prisma from '@/lib/prisma';

export const GET = withErrorHandling(async (_req: NextRequest) => {
  const images = await prisma.galleryImage.findMany({ orderBy: { displayOrder: 'asc' } });
  return apiSuccess(images);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const { imageUrl, caption } = body as { imageUrl: string; caption?: string };
  if (!imageUrl) return apiError('Image URL is required.', 400);
  const maxOrder = await prisma.galleryImage.aggregate({ _max: { displayOrder: true } });
  const displayOrder = (maxOrder._max.displayOrder ?? 0) + 1;
  const image = await prisma.galleryImage.create({
    data: { imageUrl, caption: caption || null, displayOrder },
  });
  return apiSuccess(image, 201);
});
