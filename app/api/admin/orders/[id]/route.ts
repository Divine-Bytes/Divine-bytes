export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// TODO: Add withAdminAuth(handler) protection - Task 4.4
import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess, apiError } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { updateOrderStatusSchema } from '@/lib/validations/order';

export const GET = withErrorHandling(
  async (_req: NextRequest, { params }: { params?: Record<string, string> }) => {
    const id = params?.id ?? '';
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: { include: { images: true } },
            customization: true,
          },
        },
      },
    });
    if (!order) return apiError('Order not found', 404);
    return apiSuccess(order);
  }
);

export const PUT = withErrorHandling(
  async (req: NextRequest, { params }: { params?: Record<string, string> }) => {
    const id = params?.id ?? '';
    const body = await req.json();
    const result = updateOrderStatusSchema.safeParse(body);
    if (!result.success) {
      return apiError('Invalid status value.', 400);
    }
    const updateData: Record<string, unknown> = {};
    if (result.data.orderStatus) updateData.orderStatus = result.data.orderStatus;
    if (result.data.paymentStatus) updateData.paymentStatus = result.data.paymentStatus;
    const order = await prisma.order.update({ where: { id }, data: updateData });
    return apiSuccess(order);
  }
);
