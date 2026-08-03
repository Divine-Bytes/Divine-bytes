import { z } from 'zod';

export const settingsSchema = z.object({
  businessName: z
    .string()
    .min(1, 'Business name is required')
    .max(100, 'Business name must not exceed 100 characters')
    .trim(),
  contactNumber: z
    .string()
    .min(7, 'Contact number must be at least 7 characters')
    .max(20, 'Contact number must not exceed 20 characters')
    .trim(),
  instagramLink: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  deliveryInformation: z
    .string()
    .max(2000, 'Delivery information must not exceed 2000 characters')
    .optional(),
  businessAddress: z
    .string()
    .max(500, 'Business address must not exceed 500 characters')
    .optional(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
