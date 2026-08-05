export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// TODO: Add withAdminAuth(handler) protection - Task 4.4
import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess } from '@/lib/api-handler';
import prisma from '@/lib/prisma';

export const DELETE = withErrorHandling(
  async (_req: NextRequest, { params }: { params?: Record<string, string> }) => {
    const id = params?.id ?? '';
    await prisma.galleryImage.delete({ where: { id } });
    return apiSuccess({ message: 'Image removed from gallery.' });
  }
);

export const PUT = withErrorHandling(
  async (req: NextRequest, { params }: { params?: Record<string, string> }) => {
    const id = params?.id ?? '';
    const body = await req.json();
    const { displayOrder, caption } = body as { displayOrder?: number; caption?: string };
    const image = await prisma.galleryImage.update({
      where: { id },
      data: {
        ...(displayOrder !== undefined ? { displayOrder } : {}),
        ...(caption !== undefined ? { caption } : {}),
      },
    });
    return apiSuccess(image);
  }
);
