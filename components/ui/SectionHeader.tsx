import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, centered, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-2', centered && 'items-center text-center', className)}>
      <h2 className="font-heading text-2xl md:text-3xl text-deep-navy">{title}</h2>
      {subtitle && (
        <p className="font-body text-gray-500 text-base max-w-xl">{subtitle}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
