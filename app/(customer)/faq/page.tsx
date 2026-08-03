'use client';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  { q: 'How long does delivery take?', a: 'Standard delivery takes 2–3 business days across Pakistan. Express delivery is available for Karachi.' },
  { q: 'Can I customise a chocolate box as a gift?', a: 'Absolutely! Our Signature Chocolate Bar can be fully personalised with your choice of chocolate base, filling, a personal name, and even a custom design vision.' },
  { q: 'What payment methods do you accept?', a: 'We accept Bank Transfer and Easypaisa. Both on number 03274056532. A payment screenshot is required after transfer for verification.' },
  { q: 'Are your chocolates suitable for gifting?', a: 'Yes! Divine Bytes chocolates are beautifully packaged and perfect for birthdays, anniversaries, weddings, corporate gifts, and any special occasion.' },
  { q: 'How should I store my chocolates?', a: 'Store in a cool, dry place away from direct sunlight. Ideally between 15–18°C. Avoid refrigeration as it may cause condensation and affect texture.' },
  { q: 'Do you deliver outside Pakistan?', a: 'Currently we deliver within Pakistan only. International shipping is a planned future feature.' },
  { q: 'How do I track my order?', a: 'After placing your order, contact us via WhatsApp with your order number for updates. We will keep you informed at every step.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen(o => !o)} aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-5 text-left font-body font-medium text-dark-gray hover:text-deep-navy transition-colors min-h-[44px]">
        <span>{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.15 }} aria-hidden className="text-luxury-gold text-xl shrink-0">+</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15, ease: 'easeOut' }} className="overflow-hidden">
            <p className="font-body text-gray-500 text-sm pb-5 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">
      <h1 className="font-heading text-3xl md:text-4xl text-deep-navy mb-2">Frequently Asked Questions</h1>
      <p className="font-body text-gray-500 mb-10">Everything you need to know about Divine Bytes.</p>
      <div className="rounded-2xl border border-gray-100 px-6">
        {faqs.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
      </div>
    </div>
  );
}
