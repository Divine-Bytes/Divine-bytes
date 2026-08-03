'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useToast } from '@/components/ui/Toast';
import { toSlug } from '@/lib/utils';

export default function NewProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const [form, setForm] = useState({ name: '', slug: '', description: '', price: '', categoryId: '', stockQuantity: '0', featured: false, active: true });

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => { if (d.success) setCategories(d.data); });
  }, []);

  function setName(name: string) {
    setForm(p => ({ ...p, name, slug: toSlug(name) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    // Upload images first
    const imageUrls: string[] = [];
    for (const file of images) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) imageUrls.push(data.data.url);
    }

    const payload = {
      ...form,
      price: parseFloat(form.price),
      stockQuantity: parseInt(form.stockQuantity, 10),
      images: imageUrls,
    };

    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      showToast('Product created successfully.', 'success');
      router.push('/admin/products');
    } else {
      if (data.fieldErrors) setErrors(data.fieldErrors);
      showToast('Failed to create product.', 'error');
    }
    setSaving(false);
  }

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl text-deep-navy mb-8">New Product</h1>
      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
        <Input label="Product Name" required value={form.name} error={errors.name}
          onChange={e => setName(e.target.value)} />
        <Input label="Slug" required value={form.slug} error={errors.slug}
          onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} />
        <Textarea label="Description" required value={form.description} error={errors.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
        <Input label="Price (PKR)" required type="number" value={form.price} error={errors.price}
          onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
        <Select label="Category" required options={categoryOptions} value={form.categoryId} error={errors.categoryId}
          placeholder="Select category…" onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))} />
        <Input label="Stock Quantity" type="number" value={form.stockQuantity}
          onChange={e => setForm(p => ({ ...p, stockQuantity: e.target.value }))} />
        <div className="flex gap-6">
          <label className="flex items-center gap-2 font-body text-sm text-dark-gray cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4" />
            Featured
          </label>
          <label className="flex items-center gap-2 font-body text-sm text-dark-gray cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4" />
            Active
          </label>
        </div>
        <ImageUpload label="Product Images" hint="Upload product images." onChange={f => f && setImages(p => [...p, f])} />
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" loading={saving}>Create Product</Button>
        </div>
      </form>
    </div>
  );
}
