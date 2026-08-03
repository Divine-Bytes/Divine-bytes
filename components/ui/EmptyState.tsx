import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  heading: string;
  subtext?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, heading, subtext, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {icon && <div className="mb-4 text-gray-300 text-5xl">{icon}</div>}
      <h3 className="font-heading text-xl text-dark-gray mb-2">{heading}</h3>
      {subtext && <p className="font-body text-gray-500 text-sm max-w-xs mb-6">{subtext}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
