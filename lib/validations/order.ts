import { z } from 'zod';

export const updateOrderStatusSchema = z.object({
  orderStatus: z
    .enum(
      ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'],
      {
        error: 'Invalid order status',
      }
    )
    .optional(),
  paymentStatus: z
    .enum(['PENDING', 'VERIFIED', 'REJECTED'], {
      error: 'Invalid payment status',
    })
    .optional(),
  adminNotes: z.string().max(1000).optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
