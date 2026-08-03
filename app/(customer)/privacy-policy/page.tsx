import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Divine Bytes privacy policy — how we collect, use, and protect your information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
      <h1 className="font-heading text-3xl text-deep-navy mb-8">Privacy Policy</h1>
      <div className="prose prose-stone font-body text-dark-gray space-y-6">
        <section><h2 className="font-heading text-xl text-deep-navy mb-2">Information We Collect</h2>
          <p className="text-gray-600 text-sm leading-relaxed">When you place an order, we collect your name, phone number, email address (optional), and delivery address. This information is used solely to fulfil your order and contact you if needed.</p></section>
        <section><h2 className="font-heading text-xl text-deep-navy mb-2">How We Use Your Information</h2>
          <p className="text-gray-600 text-sm leading-relaxed">Your information is used to process orders, arrange delivery, and communicate order updates. We do not sell or share your personal information with third parties.</p></section>
        <section><h2 className="font-heading text-xl text-deep-navy mb-2">Payment Information</h2>
          <p className="text-gray-600 text-sm leading-relaxed">We do not store any banking credentials or payment PINs. Payment screenshots uploaded for verification are stored securely and used only to confirm payment.</p></section>
        <section><h2 className="font-heading text-xl text-deep-navy mb-2">Cookies</h2>
          <p className="text-gray-600 text-sm leading-relaxed">We use only essential cookies to maintain your shopping cart and admin session. No tracking or advertising cookies are used.</p></section>
        <section><h2 className="font-heading text-xl text-deep-navy mb-2">Contact Us</h2>
          <p className="text-gray-600 text-sm leading-relaxed">For any privacy-related questions, please contact us via WhatsApp or through our contact page.</p></section>
      </div>
    </div>
  );
}
