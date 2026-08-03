import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess, apiError } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { checkoutSchema } from '@/lib/validations/checkout';

function generateOrderNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `DB-${date}-${rand}`;
}

async function getUniqueOrderNumber(): Promise<string> {
  let orderNumber = generateOrderNumber();
  let attempts = 0;
  while (attempts < 10) {
    const existing = await prisma.order.findUnique({ where: { orderNumber } });
    if (!existing) return orderNumber;
    orderNumber = generateOrderNumber();
    attempts++;
  }
  throw new Error('Failed to generate unique order number');
}

export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const result = checkoutSchema.safeParse(body);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path.join('.');
      if (field) fieldErrors[field] = issue.message;
    }
    return apiError('Please check your order details.', 400, fieldErrors);
  }

  const {
    fullName,
    phoneNumber,
    email,
    deliveryAddress,
    city,
    paymentMethod,
    notes,
    items,
    totalAmount,
  } = result.data;

  // Allow optional paymentScreenshotUrl passed from frontend after upload
  const paymentScreenshotUrl =
    (body as Record<string, unknown>).paymentScreenshotUrl as string | undefined;

  // Upsert customer — creates a new record or updates an existing one by phoneNumber
  const customer = await prisma.customer.upsert({
    where: { phoneNumber },
    update: { fullName, email: email || null, address: deliveryAddress, city },
    create: {
      fullName,
      phoneNumber,
      email: email || null,
      address: deliveryAddress,
      city,
    },
  });

  // Generate unique order number in DB-YYYYMMDD-XXXX format
  const orderNumber = await getUniqueOrderNumber();

  // Create order, order items, and optional product customizations atomically
  const order = await prisma.$transaction(async (tx) => {
    // Create the order without nested items so we can get deterministic IDs back
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        paymentMethod,
        deliveryAddress,
        city,
        totalAmount,
        notes: notes || null,
        paymentScreenshotUrl: paymentScreenshotUrl || null,
      },
    });

    // Create each order item individually so we have the exact ID for each
    for (const item of items) {
      const orderItem = await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        },
      });

      // If this item has customization data, attach it using the real orderItem ID
      if (item.customization) {
        await tx.productCustomization.create({
          data: {
            orderItemId: orderItem.id,
            chocolateBase: item.customization.chocolateBase,
            personalizedName: item.customization.personalizedName || null,
            customerVision: item.customization.customerVision || null,
            inspirationImageUrl: item.customization.inspirationImageUrl || null,
          },
        });
      }
    }

    return newOrder;
  });

  return apiSuccess({ orderNumber: order.orderNumber, orderId: order.id }, 201);
});
