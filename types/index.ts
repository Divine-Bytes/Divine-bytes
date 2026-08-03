// Shared API response types
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  fieldErrors?: Record<string, string>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Enums mirroring Prisma schema
export enum PaymentMethod {
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  JAZZCASH = 'JAZZCASH',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum ChocolateBase {
  DARK = 'DARK',
  MILK = 'MILK',
  WHITE = 'WHITE',
}

export enum Filling {
  SOLID = 'SOLID',
  COCONUT_CREME = 'COCONUT_CREME',
  GOLDEN_CARAMEL = 'GOLDEN_CARAMEL',
  CHERRY_BLISS = 'CHERRY_BLISS',
  LOTUS_BISCOFF = 'LOTUS_BISCOFF',
  PEANUT_PRALINE = 'PEANUT_PRALINE',
}

// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  stockQuantity: number;
  featured: boolean;
  active: boolean;
  category?: Category;
  images?: ProductImage[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  displayOrder: number;
  altText: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

// Cart types
export interface CustomizationData {
  chocolateBase: ChocolateBase;
  filling?: Filling;
  personalizedName?: string;
  customerVision?: string;
  inspirationImage?: File | null;
  inspirationPreview?: string;
  inspirationImageUrl?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  slug: string;
  customization?: CustomizationData;
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryAddress: string;
  city: string;
  totalAmount: number;
  notes?: string;
  paymentScreenshotUrl?: string;
  createdAt: string;
  customer?: Customer;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: Product;
  customization?: ProductCustomization;
}

export interface ProductCustomization {
  id: string;
  orderItemId: string;
  chocolateBase: ChocolateBase;
  filling?: Filling;
  personalizedName?: string;
  customerVision?: string;
  inspirationImageUrl?: string;
  adminNotes?: string;
}

export interface Customer {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  address: string;
  city: string;
  createdAt: string;
}

// Gallery types
export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption?: string | null;
  displayOrder: number;
}

// Website settings
export interface WebsiteSetting {
  id: string;
  businessName: string;
  logoUrl?: string;
  contactNumber: string;
  instagramLink?: string;
  deliveryInformation?: string;
  businessAddress?: string;
  heroImageUrl?: string;
}
