'use client';

import { useState, useRef } from 'react';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { ChocolateBase, type CustomizationData } from '@/types';

interface CustomizationPanelProps {
  onChange: (data: CustomizationData | null) => void;
}

const baseOptions = [
  { value: ChocolateBase.DARK, label: 'Dark Chocolate' },
  { value: ChocolateBase.MILK, label: 'Milk Chocolate' },
  { value: ChocolateBase.WHITE, label: 'White Chocolate' },
];

type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

export function CustomizationPanel({ onChange }: CustomizationPanelProps) {
  const [base, setBase] = useState('');
  const [name, setName] = useState('');
  const [vision, setVision] = useState('');
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Refs hold canonical values so notify() never reads stale state from async callbacks
  const baseRef = useRef('');
  const nameRef = useRef('');
  const visionRef = useRef('');
  const imageUrlRef = useRef<string | undefined>(undefined);
  const imagePreviewRef = useRef<string | undefined>(undefined);

  function notify() {
    if (!baseRef.current) {
      onChange(null);
      return;
    }
    onChange({
      chocolateBase: baseRef.current as ChocolateBase,
      personalizedName: nameRef.current || undefined,
      customerVision: visionRef.current || undefined,
      inspirationPreview: imagePreviewRef.current,
      inspirationImageUrl: imageUrlRef.current,
    });
  }

  async function handleImageChange(file: File | null) {
    setUploadError(null);

    if (!file) {
      imageUrlRef.current = undefined;
      imagePreviewRef.current = undefined;
      setImagePreview(undefined);
      setUploadStatus('idle');
      notify();
      return;
    }

    const preview = URL.createObjectURL(file);
    imagePreviewRef.current = preview;
    setImagePreview(preview);
    setUploadStatus('uploading');

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();

      if (data.success && data.data?.url) {
        imageUrlRef.current = data.data.url;
        setUploadStatus('done');
      } else {
        imageUrlRef.current = undefined;
        setUploadStatus('error');
        setUploadError('Image upload failed. Please try again.');
      }
    } catch {
      imageUrlRef.current = undefined;
      setUploadStatus('error');
      setUploadError('Image upload failed. Please try again.');
    }

    notify();
  }

  return (
    <div className="flex flex-col gap-5 p-5 rounded-2xl border border-gray-100 bg-warm-white">
      <h3 className="font-heading text-lg text-deep-navy">Customize Your Bar</h3>

      <Select
        label="Chocolate Base" required placeholder="Select base..."
        options={baseOptions} value={base}
        onChange={(e) => {
          baseRef.current = e.target.value;
          setBase(e.target.value);
          notify();
        }}
      />

      <Input
        label="Personalized Name" placeholder="e.g. Happy Birthday Sarah" maxLength={50} value={name}
        onChange={(e) => {
          nameRef.current = e.target.value;
          setName(e.target.value);
          notify();
        }}
      />

      <Textarea
        label="Your Vision" placeholder="e.g. Pink birthday theme with edible gold details…"
        maxLength={500} value={vision} currentLength={vision.length}
        onChange={(e) => {
          visionRef.current = e.target.value;
          setVision(e.target.value);
          notify();
        }}
      />

      <div>
        <ImageUpload
          label="Inspiration Image (Optional)"
          hint="Upload a reference image for your design."
          onChange={handleImageChange}
          previewUrl={imagePreview}
        />
        {uploadStatus === 'uploading' && (
          <p className="text-xs text-luxury-gold mt-1 font-body">Uploading image…</p>
        )}
        {uploadStatus === 'error' && uploadError && (
          <p className="text-xs text-red-500 mt-1 font-body">{uploadError}</p>
        )}
        {uploadStatus === 'done' && (
          <p className="text-xs text-green-600 mt-1 font-body">✓ Image ready</p>
        )}
      </div>

      <p className="text-xs text-gray-400 font-body">
        Our team will review your customization and contact you if clarification is needed before production begins.
      </p>
    </div>
  );
}
