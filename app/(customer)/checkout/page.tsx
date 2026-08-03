'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useCart } from '@/lib/cart/CartContext';
import { useToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const paymentOptions = [
  { value: 'BANK_TRANSFER', label: 'Bank Transfer (03274056532)' },
  { value: 'JAZZCASH', label: 'Easypaisa (03274056532)' },
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [form, setForm] = useState({ fullName: '', phoneNumber: '', email: '', deliveryAddress: '', city: '', paymentMethod: '', notes: '' });

  const needsScreenshot = ['BANK_TRANSFER', 'JAZZCASH'].includes(form.paymentMethod);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) { showToast('Your cart is empty.', 'error'); return; }
    setLoading(true); setErrors({});
    try {
      let paymentScreenshotUrl: string | undefined;
      if (screenshot && needsScreenshot) {
        const fd = new FormData(); fd.append('file', screenshot);
        const upRes = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const upData = await upRes.json();
        if (upData.success) paymentScreenshotUrl = upData.data.url;
      }

      // Map cart items — inspiration image is already uploaded at selection time
      const itemsWithUrls = await Promise.all(
        items.map(async (i) => {
          let inspirationImageUrl: string | undefined = i.customization?.inspirationImageUrl;

          // Fallback: if somehow a File object survived, upload it now
          if (!inspirationImageUrl && i.customization?.inspirationImage instanceof File) {
            const fd = new FormData();
            fd.append('file', i.customization.inspirationImage);
            const upRes = await fetch('/api/admin/upload', { method: 'POST', body: fd });
            const upData = await upRes.json();
            if (upData.success) inspirationImageUrl = upData.data.url;
          }

          return {
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.price,
            customization: i.customization
              ? {
                  chocolateBase: i.customization.chocolateBase,
                  personalizedName: i.customization.personalizedName,
                  customerVision: i.customization.customerVision,
                  inspirationImageUrl,
                }
              : undefined,
          };
        })
      );

      const payload = { ...form, items: itemsWithUrls, totalAmount: total, paymentScreenshotUrl };
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { clearCart(); router.push(`/order-confirmation/${data.data.orderNumber}`); }
      else { if (data.fieldErrors) setErrors(data.fieldErrors); showToast('Something went wrong. Please try again.', 'error'); }
    } catch { showToast('Something went wrong. Please try again.', 'error'); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:py-16">
      <h1 className="font-heading text-3xl text-deep-navy mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} noValidate className="lg:col-span-2 flex flex-col gap-5">
          <h2 className="font-heading text-xl text-deep-navy">Your Details</h2>
          <Input label="Full Name" required value={form.fullName} error={errors.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} autoComplete="name" />
          <Input label="Phone Number" required type="tel" placeholder="03001234567" value={form.phoneNumber} error={errors.phoneNumber} onChange={e => setForm(p => ({ ...p, phoneNumber: e.target.value }))} autoComplete="tel" />
          <Input label="Email (Optional)" type="email" value={form.email} error={errors.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} autoComplete="email" />
          <Input label="Delivery Address" required value={form.deliveryAddress} error={errors.deliveryAddress} onChange={e => setForm(p => ({ ...p, deliveryAddress: e.target.value }))} autoComplete="street-address" />
          <Input label="City" required value={form.city} error={errors.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} autoComplete="address-level2" />
          <Select label="Payment Method" required placeholder="Select payment method…" options={paymentOptions} value={form.paymentMethod} error={errors.paymentMethod} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value }))} />
          {needsScreenshot && <ImageUpload label="Payment Screenshot" hint="Upload proof of your Bank Transfer or Easypaisa payment to 03274056532." onChange={setScreenshot} />}
          <Textarea label="Additional Notes (Optional)" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Any special instructions…" />
          <Button type="submit" loading={loading} size="lg">Place Order</Button>
        </form>
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-100 p-5 bg-white sticky top-20">
            <h2 className="font-heading text-lg text-deep-navy mb-4">Order Summary</h2>
            {items.map(item => (
              <div key={item.productId} className="flex justify-between text-sm font-body text-dark-gray mb-2">
                <span className="truncate max-w-[160px]">{item.name} × {item.quantity}</span>
                <span className="shrink-0 ml-2">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-body font-semibold text-deep-navy">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
