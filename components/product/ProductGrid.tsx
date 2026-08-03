import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Product } from '@/types';

interface ProductGridProps {
  products?: Product[];
  loading?: boolean;
  emptyMessage?: string;
}

export function ProductGrid({ products, loading, emptyMessage = 'No chocolates matched your search.' }: ProductGridProps) {
  if (loading) {
    return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  );
  }

  if (!products?.length) {
    return <EmptyState heading={emptyMessage} subtext="Try a different search or browse all products." />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
