import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Divine Bytes terms and conditions of service.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
      <h1 className="font-heading text-3xl text-deep-navy mb-8">Terms &amp; Conditions</h1>
      <div className="font-body text-dark-gray space-y-6">
        <section><h2 className="font-heading text-xl text-deep-navy mb-2">Orders</h2>
          <p className="text-gray-600 text-sm leading-relaxed">By placing an order, you confirm that all information provided is accurate and complete. Divine Bytes reserves the right to cancel any order where payment is not verified within 24 hours.</p></section>
        <section><h2 className="font-heading text-xl text-deep-navy mb-2">Payments</h2>
          <p className="text-gray-600 text-sm leading-relaxed">All prices are listed in Pakistani Rupees (PKR). Payment must be completed before order preparation begins. We accept Bank Transfer and Easypaisa to 03274056532. A payment screenshot must be uploaded at checkout.</p></section>
        <section><h2 className="font-heading text-xl text-deep-navy mb-2">Customisation Orders</h2>
          <p className="text-gray-600 text-sm leading-relaxed">Customisation requests are reviewed manually by the Divine Bytes team. We reserve the right to contact customers for clarification before production. Final designs may vary slightly from inspiration images.</p></section>
        <section><h2 className="font-heading text-xl text-deep-navy mb-2">Delivery</h2>
          <p className="text-gray-600 text-sm leading-relaxed">Delivery timelines are estimates. Divine Bytes is not responsible for delays caused by incorrect addresses or factors outside our control.</p></section>
        <section><h2 className="font-heading text-xl text-deep-navy mb-2">Refunds</h2>
          <p className="text-gray-600 text-sm leading-relaxed">Due to the perishable and handcrafted nature of our products, we do not accept returns. If your order arrives damaged, please contact us within 24 hours with photographs.</p></section>
      </div>
    </div>
  );
}
