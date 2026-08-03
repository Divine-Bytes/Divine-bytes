'use client';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function ContactPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ fullName: '', phoneNumber: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        showToast('Message sent successfully.', 'success');
        setForm({ fullName: '', phoneNumber: '', message: '' });
      } else {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        showToast('Failed to send message. Please try again.', 'error');
      }
    } catch {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">
      <h1 className="font-heading text-3xl md:text-4xl text-deep-navy mb-2">Get in Touch</h1>
      <p className="font-body text-gray-500 mb-8">We would love to hear from you. Reach out via WhatsApp, Instagram, or send us a message below.</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <a href="https://wa.me/923157713874" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-5 py-3 rounded-xl border border-green-200 bg-green-50 text-green-700 font-body text-sm hover:bg-green-100 transition-colors min-h-[44px]">
          📱 Chat on WhatsApp
        </a>
        <a href="https://www.instagram.com/divine_bytes.pk?igsh=MXJ3N2x3MHZiMms3eg==" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-5 py-3 rounded-xl border border-pink-200 bg-pink-50 text-pink-700 font-body text-sm hover:bg-pink-100 transition-colors min-h-[44px]">
          📸 Follow on Instagram
        </a>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Input label="Full Name" required value={form.fullName} error={errors.fullName}
          onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} autoComplete="name" />
        <Input label="Phone Number" required type="tel" value={form.phoneNumber} error={errors.phoneNumber}
          placeholder="03001234567" onChange={e => setForm(p => ({ ...p, phoneNumber: e.target.value }))} autoComplete="tel" />
        <Textarea label="Message" required value={form.message} error={errors.message}
          placeholder="Tell us how we can help…" onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
        <Button type="submit" loading={loading} size="lg" className="self-start">Send Message</Button>
      </form>
    </div>
  );
}
