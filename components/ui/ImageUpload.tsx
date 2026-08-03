'use client';

import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  value?: File | null;
  previewUrl?: string | null;
  label?: string;
  hint?: string;
  error?: string;
  accept?: string;
  className?: string;
}

const MAX_SIZE_MB = 5;

export function ImageUpload({ onChange, previewUrl, label, hint, error, accept = 'image/*', className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(previewUrl ?? null);
  const [clientError, setClientError] = useState<string | null>(null);

  function handleFile(file: File | null) {
    if (!file) { onChange(null); setLocalPreview(null); return; }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setClientError(`File size must not exceed ${MAX_SIZE_MB} MB.`);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setClientError('Only image files are accepted.');
      return;
    }
    setClientError(null);
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    onChange(file);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0] ?? null);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0] ?? null);
  }

  const displayError = error || clientError;
  const preview = localPreview ?? previewUrl;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && <span className="text-sm font-medium text-dark-gray font-body">{label}</span>}
      <div
        role="button"
        tabIndex={0}
        aria-label={label ?? 'Upload image'}
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed',
          'min-h-[140px] cursor-pointer transition-colors duration-150',
          dragOver ? 'border-luxury-gold bg-luxury-gold/5' : 'border-gray-200 hover:border-luxury-gold',
          displayError && 'border-red-400'
        )}
      >
        {preview ? (
          <div className="relative w-full aspect-video">
            <Image src={preview} alt="Preview" fill className="object-contain rounded-xl" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300" aria-hidden>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-sm text-gray-400 font-body">Drag & drop or <span className="text-luxury-gold underline">browse</span></p>
            <p className="text-xs text-gray-300">JPEG, PNG, WebP, GIF · max {MAX_SIZE_MB} MB</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept={accept} className="sr-only" onChange={onInputChange} tabIndex={-1} />
      </div>
      {hint && !displayError && <p className="text-xs text-gray-400">{hint}</p>}
      {displayError && <p role="alert" className="text-xs text-red-500">{displayError}</p>}
    </div>
  );
}
