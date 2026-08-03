import { z } from 'zod';

export const contactSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .trim(),
  phoneNumber: z
    .string()
    .regex(
      /^(\+92|0)[0-9]{10}$/,
      'Please enter a valid Pakistani phone number'
    ),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1000 characters')
    .trim(),
});

export type ContactInput = z.infer<typeof contactSchema>;
