import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .trim(),
  phoneNumber: z
    .string()
    .regex(
      /^(\+92|0)[0-9]{10}$/,
      'Please enter a valid Pakistani phone number (e.g. 03001234567)'
    ),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  deliveryAddress: z
    .string()
    .min(10, 'Please provide a complete delivery address')
    .max(500, 'Address must not exceed 500 characters')
    .trim(),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must not exceed 100 characters')
    .trim(),
  paymentMethod: z.enum(['BANK_TRANSFER', 'JAZZCASH'], {
    error: 'Please select a payment method',
  }),
  notes: z.string().max(500, 'Notes must not exceed 500 characters').optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
        unitPrice: z.number().positive('Unit price must be positive'),
        customization: z
          .object({
            chocolateBase: z.enum(['DARK', 'MILK', 'WHITE']),
            personalizedName: z.string().max(50).optional(),
            customerVision: z.string().max(500).optional(),
            inspirationImageUrl: z.string().url().optional(),
          })
          .optional(),
      })
    )
    .min(1, 'Your cart is empty'),
  totalAmount: z.number().positive('Total amount must be positive'),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
