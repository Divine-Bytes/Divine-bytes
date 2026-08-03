'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useToast } from '@/components/ui/Toast';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [form, setForm] = useState({ businessName: '', contactNumber: '', instagramLink: '', deliveryInformation: '', businessAddress: '', logoUrl: '', heroImageUrl: '' });

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => { if (d.success && d.data) setForm({ businessName: d.data.businessName ?? '', contactNumber: d.data.contactNumber ?? '', instagramLink: d.data.instagramLink ?? '', deliveryInformation: d.data.deliveryInformation ?? '', businessAddress: d.data.businessAddress ?? '', logoUrl: d.data.logoUrl ?? '', heroImageUrl: d.data.heroImageUrl ?? '' }); setLoading(false); });
  }, []);

  async function uploadFile(file: File) {
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    return data.success ? data.data.url : null;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    let { logoUrl, heroImageUrl } = form;
    if (logoFile) { const url = await uploadFile(logoFile); if (url) logoUrl = url; }
    if (heroFile) { const url = await uploadFile(heroFile); if (url) heroImageUrl = url; }
    const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, logoUrl, heroImageUrl }) });
    const data = await res.json();
    if (data.success) showToast('Settings saved successfully.', 'success');
    else showToast('Failed to save settings.', 'error');
    setSaving(false);
  }

  if (loading) return <div className="p-8"><p className="text-gray-400 font-body">Loading…</p></div>;

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl text-deep-navy mb-8">Website Settings</h1>
      <form onSubmit={handleSave} noValidate className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
        <Input label="Business Name" required value={form.businessName} onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))} />
        <Input label="Contact Number" required value={form.contactNumber} onChange={e => setForm(p => ({ ...p, contactNumber: e.target.value }))} />
        <Input label="Instagram Link" type="url" value={form.instagramLink} onChange={e => setForm(p => ({ ...p, instagramLink: e.target.value }))} />
        <Textarea label="Delivery Information" value={form.deliveryInformation} onChange={e => setForm(p => ({ ...p, deliveryInformation: e.target.value }))} />
        <Input label="Business Address" value={form.businessAddress} onChange={e => setForm(p => ({ ...p, businessAddress: e.target.value }))} />
        <ImageUpload label="Logo" hint="Upload a new logo to replace the current one." onChange={setLogoFile} previewUrl={form.logoUrl || null} />
        <ImageUpload label="Hero Image" hint="Homepage hero background image." onChange={setHeroFile} previewUrl={form.heroImageUrl || null} />
        <Button type="submit" loading={saving} size="lg">Save Settings</Button>
      </form>
    </div>
  );
}
