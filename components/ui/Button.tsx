'use client';

import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef, ElementType, ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonBaseProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  asChild?: boolean;
}

type ButtonProps = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses = {
  primary: 'bg-deep-navy text-white hover:bg-opacity-90 focus-visible:ring-deep-navy',
  secondary: 'border-2 border-deep-navy text-deep-navy hover:bg-deep-navy hover:text-white focus-visible:ring-deep-navy',
  ghost: 'text-deep-navy hover:bg-deep-navy/10 focus-visible:ring-deep-navy',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
};

const sizeClasses = {
  sm: 'h-9 px-4 text-sm min-w-[44px]',
  md: 'h-11 px-6 text-base min-w-[44px]',
  lg: 'h-14 px-8 text-lg min-w-[44px]',
};

export function buttonClass(variant: keyof typeof variantClasses = 'primary', size: keyof typeof sizeClasses = 'md', extra?: string) {
  return cn(
    'inline-flex items-center justify-center rounded-full font-body font-medium',
    'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed select-none',
    variantClasses[variant],
    sizeClasses[size],
    extra
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, className, children, asChild, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={buttonClass(variant, size, className)}
        {...props}
      >
        {loading && (
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
