'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToastProvider } from '@/components/ui/Toast';

function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        window.location.replace('/admin/dashboard');
      } else if (res.status === 429) {
        setError('Too many login attempts. Please try again later.');
      } else {
        setError('Invalid email or password.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-luxury-gold/60">
            <Image src="/logo.jpeg" alt="Divine Bytes" fill className="object-cover scale-110" sizes="64px" />
          </div>
          <div className="text-center">
            <h1 className="font-heading text-2xl text-deep-navy">Divine Bytes</h1>
            <p className="font-body text-gray-500 text-sm">Admin Dashboard</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-5"
        >
          <h2 className="font-heading text-xl text-deep-navy">Sign In</h2>

          {error && (
            <p role="alert" className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">
              {error}
            </p>
          )}

          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            autoComplete="email"
            autoFocus
          />
          <Input
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            autoComplete="current-password"
          />
          <Button type="submit" loading={loading} size="lg" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <ToastProvider>
      <LoginForm />
    </ToastProvider>
  );
}
