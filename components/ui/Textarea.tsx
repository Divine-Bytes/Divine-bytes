'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  currentLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, maxLength, currentLength, className, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-dark-gray font-body">
            {label}
            {required && <span className="ml-1 text-red-500" aria-hidden>*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          maxLength={maxLength}
          aria-invalid={!!error}
          rows={4}
          className={cn(
            'w-full rounded-xl border px-4 py-3 font-body text-dark-gray bg-white resize-none',
            'transition-colors duration-150 outline-none placeholder:text-gray-400',
            'focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20',
            error ? 'border-red-400' : 'border-gray-200',
            className
          )}
          {...props}
        />
        <div className="flex items-center justify-between">
          {error && <p role="alert" className="text-xs text-red-500">{error}</p>}
          {maxLength && (
            <p className="ml-auto text-xs text-gray-400">
              {currentLength ?? 0}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
