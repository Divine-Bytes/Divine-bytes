'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

interface GalleryImage { id: string; imageUrl: string; caption?: string | null; displayOrder: number; }

export default function AdminGalleryPage() {
  const { showToast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() { const r = await fetch('/api/admin/gallery'); const d = await r.json(); if (d.success) setImages(d.data); setLoading(false); }
  useEffect(() => { load(); }, []);

  async function handleUpload() {
    if (!file) { showToast('Please select an image.', 'error'); return; }
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    const upRes = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const upData = await upRes.json();
    if (!upData.success) { showToast('Upload failed.', 'error'); setUploading(false); return; }
    const res = await fetch('/api/admin/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: upData.data.url, caption }) });
    const data = await res.json();
    if (data.success) { showToast('Image added to gallery.', 'success'); setFile(null); setCaption(''); load(); }
    else showToast('Failed to add image.', 'error');
    setUploading(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/gallery/${deleteId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) { showToast('Image removed from gallery.', 'success'); setDeleteId(null); load(); }
    else showToast('Failed to delete image.', 'error');
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <h1 className="font-heading text-2xl text-deep-navy mb-8">Gallery</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8">
        <h2 className="font-heading text-lg text-deep-navy mb-4">Add New Image</h2>
        <div className="flex flex-col gap-4">
          <ImageUpload label="Image" onChange={setFile} />
          <Input label="Caption (Optional)" value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. Signature Chocolate Bar" />
          <Button onClick={handleUpload} loading={uploading} className="self-start">Add to Gallery</Button>
        </div>
      </div>
      {loading ? <p className="text-gray-400 font-body">Loading…</p> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.id} className="relative rounded-2xl overflow-hidden group bg-gray-50 aspect-square">
              <Image src={img.imageUrl} alt={img.caption || 'Gallery image'} fill className="object-cover" sizes="200px" />
              {img.caption && <p className="absolute bottom-0 inset-x-0 text-xs text-white bg-black/50 px-2 py-1 truncate">{img.caption}</p>}
              <button onClick={() => setDeleteId(img.id)} aria-label="Delete image"
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">✕</button>
            </div>
          ))}
          {!images.length && <p className="col-span-full text-center text-gray-400 py-12 font-body">No images in gallery.</p>}
        </div>
      )}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Image">
        <p className="font-body text-gray-500 mb-5">Are you sure you want to remove this image from the gallery?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
