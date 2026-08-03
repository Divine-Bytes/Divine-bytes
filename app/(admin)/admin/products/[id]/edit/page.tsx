'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useToast } from '@/components/ui/Toast';
import { toSlug } from '@/lib/utils';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { showToast } = useToast();

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: string; imageUrl: string }[]>([]);
  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '',
    categoryId: '', stockQuantity: '0', featured: false, active: true,
  });

  useEffect(() => {
    // Load categories and product data in parallel
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch(`/api/admin/products/${id}`).then(r => r.json()),
    ]).then(([catData, prodData]) => {
      if (catData.success) setCategories(catData.data);
      if (prodData.success) {
        const p = prodData.data;
        setForm({
          name: p.name ?? '',
          slug: p.slug ?? '',
          description: p.description ?? '',
          price: String(p.price ?? ''),
          categoryId: p.categoryId ?? '',
          stockQuantity: String(p.stockQuantity ?? 0),
          featured: p.featured ?? false,
          active: p.active ?? true,
        });
        setExistingImages(p.images ?? []);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  function setName(name: string) {
    setForm(p => ({ ...p, name, slug: toSlug(name) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    // Upload any new images first
    const imageUrls: string[] = [];
    for (const file of newImages) {
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
      ...(imageUrls.length > 0 ? { newImageUrls: imageUrls } : {}),
    };

    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      showToast('Product updated successfully.', 'success');
      setNewImages([]);
      // Reload fresh data from server to show current images
      const fresh = await fetch(`/api/admin/products/${id}`).then(r => r.json());
      if (fresh.success && fresh.data?.images) {
        setExistingImages(fresh.data.images);
      }
      setSaving(false);
      return;
    } else {
      if (data.fieldErrors) setErrors(data.fieldErrors);
      showToast('Failed to update product.', 'error');
    }
    setSaving(false);
  }

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-gray-400 font-body">Loading product…</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-deep-navy transition-colors">
          ← Back
        </button>
        <h1 className="font-heading text-2xl text-deep-navy">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
        <Input label="Product Name" required value={form.name} error={errors.name}
          onChange={e => setName(e.target.value)} />
        <Input label="Slug" required value={form.slug} error={errors.slug}
          onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} />
        <Textarea label="Description" required value={form.description} error={errors.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4} />
        <Input label="Price (PKR)" required type="number" value={form.price} error={errors.price}
          onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
        {categoryOptions.length > 0 && (
          <Select label="Category" required options={categoryOptions} value={form.categoryId}
            error={errors.categoryId} placeholder="Select category…"
            onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))} />
        )}
        <Input label="Stock Quantity" type="number" value={form.stockQuantity}
          onChange={e => setForm(p => ({ ...p, stockQuantity: e.target.value }))} />
        <div className="flex gap-6">
          <label className="flex items-center gap-2 font-body text-sm text-dark-gray cursor-pointer min-h-[44px]">
            <input type="checkbox" checked={form.featured}
              onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4" />
            Featured
          </label>
          <label className="flex items-center gap-2 font-body text-sm text-dark-gray cursor-pointer min-h-[44px]">
            <input type="checkbox" checked={form.active}
              onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4" />
            Active (visible to customers)
          </label>
        </div>
        <ImageUpload label="Add New Images (optional)"
          hint="Upload additional images for this product."
          onChange={f => f && setNewImages(p => [...p, f])} />
        {existingImages.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-dark-gray font-body">Current Images</p>
            <div className="flex gap-3 flex-wrap">
              {existingImages.map((img) => (
                <div key={img.id} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={img.imageUrl} alt="Product" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch(`/api/admin/products/images/${img.id}`, { method: 'DELETE' });
                      setExistingImages(p => p.filter(i => i.id !== img.id));
                    }}
                    className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    aria-label="Remove image"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {newImages.length > 0 && (
          <p className="text-xs text-green-600 font-body">{newImages.length} new image(s) ready to upload</p>
        )}
        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" loading={saving}>Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
