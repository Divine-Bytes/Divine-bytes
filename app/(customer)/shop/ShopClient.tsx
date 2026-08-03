'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Product, Category } from '@/types';

export function ShopClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => { if (d.success) setCategories(d.data); });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadProducts = useCallback(async (reset = false) => {
    setLoading(true);
    const p = reset ? 1 : page;
    const params = new URLSearchParams({ page: String(p), limit: '12' });
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (categoryId) params.set('categoryId', categoryId);
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    if (data.success) {
      if (reset || p === 1) setProducts(data.data.products);
      else setProducts(prev => [...prev, ...data.data.products]);
      setTotal(data.data.pagination.total);
    }
    setLoading(false);
  }, [debouncedSearch, categoryId, page]);

  useEffect(() => { setPage(1); loadProducts(true); }, [debouncedSearch, categoryId]);
  useEffect(() => { if (page > 1) loadProducts(); }, [page]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search chocolates…" value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" aria-label="Search products" />
      </div>
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setCategoryId('')}
            className={cn('px-4 py-2 rounded-full text-sm font-body border transition-colors min-h-[44px]',
              !categoryId ? 'bg-deep-navy text-white border-deep-navy' : 'border-gray-200 text-dark-gray hover:border-deep-navy')}>
            All
          </button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setCategoryId(cat.id)}
              className={cn('px-4 py-2 rounded-full text-sm font-body border transition-colors min-h-[44px]',
                categoryId === cat.id ? 'bg-deep-navy text-white border-deep-navy' : 'border-gray-200 text-dark-gray hover:border-deep-navy')}>
              {cat.name}
            </button>
          ))}
        </div>
      )}
      <ProductGrid products={products} loading={loading && products.length === 0} />
      {products.length < total && !loading && (
        <div className="flex justify-center mt-4">
          <Button variant="secondary" onClick={() => setPage(p => p + 1)}>Load More</Button>
        </div>
      )}
    </div>
  );
}
