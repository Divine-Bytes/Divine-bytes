'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string; name: string; price: unknown; active: boolean; featured: boolean;
  category?: { name: string } | null;
}

export function AdminProductsClient({ products: initial }: { products: Product[] }) {
  const { showToast } = useToast();
  const [products, setProducts] = useState(initial);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/products/${deleteId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('Product removed from catalogue.', 'success');
      setProducts(p => p.map(prod => prod.id === deleteId ? { ...prod, active: false } : prod));
      setDeleteId(null);
    } else {
      showToast('Failed to remove product.', 'error');
    }
    setDeleting(false);
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-left bg-gray-50">
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-dark-gray">{p.name}</td>
                  <td className="p-4 text-gray-500">{p.category?.name ?? '—'}</td>
                  <td className="p-4">{formatPrice(Number(p.price))}</td>
                  <td className="p-4">{p.featured ? '⭐' : '—'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link href={`/admin/products/${p.id}/edit`}
                        className="text-xs text-luxury-gold hover:underline font-body">Edit</Link>
                      <button onClick={() => setDeleteId(p.id)}
                        className="text-xs text-red-400 hover:underline font-body">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!products.length && <p className="text-center text-gray-400 py-12 font-body">No products yet.</p>}
        </div>
      </div>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Remove Product">
        <p className="font-body text-gray-500 mb-5">This will hide the product from the catalogue. It can be re-enabled by editing the product.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Remove</Button>
        </div>
      </Modal>
    </>
  );
}
