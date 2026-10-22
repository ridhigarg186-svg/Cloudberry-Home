import React, { useState } from 'react';
import { Mail, Check, ArrowRight, Instagram, Facebook, PinIcon as Pinterest, Shield, X, ArrowUp } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { categories, collections, setSelectedCategory, setSelectedCollection, setCurrentView, showToast } = useShop();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setSubscribed(true);
    showToast('Welcome to the Cloudberry Circle! Your gift code is WELCOME500.');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const policyContent: Record<string, { title: string; body: string }> = {
    shipping: {
      title: 'Pan-India Shipping Policy',
      body: 'We provide complimentary standard express delivery across all serviceable pincodes in India for orders valued at ₹1,999 and above. For orders under ₹1,999, a nominal flat express shipping fee of ₹150 is applied at checkout. Orders are packed using 100% recyclable honeycomb paperboard and dispatched via Delhivery Express Air or BlueDart within 24-48 hours. Metro shipments (Mumbai, Delhi NCR, Bengaluru, Kolkata, Chennai, Hyderabad) typically arrive within 2-4 business days.',
    },
    returns: {
      title: '7-Day Return & Replacement Policy',
      body: 'We take great pride in our artisan craftsmanship. If your piece arrives with any transit defect or does not match your space, you may request a hassle-free doorstep return or replacement within 7 calendar days of delivery. All fragile items (ceramics, alabaster stone lamps, and mirrors) are 100% insured during transit—if damaged on arrival, simply contact our concierge with photos for an immediate priority replacement.',
    },
    privacy: {
      title: 'Privacy & Data Protection',
      body: 'Cloudberry Home strictly respects your personal privacy. We never sell, rent, or lease your personal information, address records, or payment details to any third parties. All transactions are securely processed via Razorpay with 256-bit bank-grade encryption. Information collected during checkout is used solely for order fulfillment, courier dispatch, and optional journal newsletters.',
    },
    terms: {
      title: 'Terms & Conditions',
      body: 'By browsing or placing an order with Cloudberry Home, you agree to our terms of service. Because each stoneware, travertine, and wood item is handcrafted using raw noble materials, natural variations in clay texture, stone veining, and wood grain are celebrated features of authentic artisanal production, making each piece uniquely yours.',
    },
  };

  return (
    <footer className="bg-[#1E1610] text-[#FCFAF6] border-t border-[#2A1E17] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Brand Promise Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-[#2A1E17]">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#C8A46B] font-semibold block">
              The Cloudberry Journal
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#FCFAF6] leading-tight">
              Join Our Circle of Mindful Living
            </h3>
            <p className="text-xs sm:text-sm text-[#D8CCC0] font-light leading-relaxed max-w-md">
              Receive thoughtful notes on seasonal interior styling, quiet spaces, and private invitations to small-batch artisan releases.
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            {subscribed ? (
              <div className="p-4 bg-[#2A1E17] rounded-sm border border-[#C8A46B]/40 text-xs text-[#FCFAF6] flex items-center gap-3 animate-in fade-in duration-300">
                <Check className="h-4 w-4 text-[#C8A46B] shrink-0" />
                <span>
                  Thank you for subscribing! Use exclusive code{' '}
                  <strong className="text-[#C8A46B] font-mono text-sm">WELCOME500</strong> for ₹500 off on your first order.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-lg">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#8C7D73]" />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#2A1E17] border border-[#3E2D22] text-[#FCFAF6] placeholder:text-[#8C7D73] focus:border-[#C8A46B] focus:outline-none rounded-xs transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C8A46B] hover:bg-[#B8935A] text-[#1E1610] text-xs uppercase tracking-widest font-semibold rounded-xs transition-all duration-200 shrink-0 cursor-pointer shadow-xs hover:-translate-y-0.5"
                >
                  Subscribe
                </button>
              </form>
            )}
            <span className="text-[10px] text-[#8C7D73] mt-2 block">
              Instant ₹500 voucher on signup · Unsubscribe anytime with one click.
            </span>
          </div>
        </div>

        {/* 4 Column Footer Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12 border-b border-[#2A1E17] text-xs">
          {/* Col 1: Brand Manifesto */}
          <div className="col-span-2 space-y-4 pr-6">
            <span className="font-serif text-2xl font-light tracking-wide text-[#FCFAF6] block">
              Cloudberry Home
            </span>
            <p className="text-xs text-[#D8CCC0] font-light leading-relaxed max-w-sm">
              Artisanal stoneware, ambient alabaster lamps, European flax linen, and mindful home decor. Thoughtfully designed and hand-sculpted in partnership with generational Indian guild craftspeople.
            </p>

            {/* Social Icons with Subtle Lift */}
            <div className="pt-2 flex items-center space-x-3 text-[#C8A46B]">
              <a
                href="#instagram"
                aria-label="Instagram"
                className="h-8 w-8 rounded-full bg-[#2A1E17] border border-[#3E2D22] flex items-center justify-center hover:text-[#FCFAF6] hover:border-[#C8A46B] hover:-translate-y-0.5 transition-all duration-200"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#facebook"
                aria-label="Facebook"
                className="h-8 w-8 rounded-full bg-[#2A1E17] border border-[#3E2D22] flex items-center justify-center hover:text-[#FCFAF6] hover:border-[#C8A46B] hover:-translate-y-0.5 transition-all duration-200"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#pinterest"
                aria-label="Pinterest"
                className="h-8 w-8 rounded-full bg-[#2A1E17] border border-[#3E2D22] flex items-center justify-center hover:text-[#FCFAF6] hover:border-[#C8A46B] hover:-translate-y-0.5 transition-all duration-200"
              >
                <Pinterest className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Shop Categories with Hover Slide */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-[#C8A46B] font-semibold block">
              Shop Decor
            </span>
            <ul className="space-y-2 text-[#D8CCC0] font-light">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(c.slug);
                      setCurrentView('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#FCFAF6] hover:translate-x-1 transition-all duration-200 text-left cursor-pointer inline-flex items-center gap-1 group"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#C8A46B] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{c.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Curated Collections with Hover Slide */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-[#C8A46B] font-semibold block">
              Collections
            </span>
            <ul className="space-y-2 text-[#D8CCC0] font-light">
              {collections.map((col) => (
                <li key={col.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCollection(col.slug);
                      setCurrentView('collections');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#FCFAF6] hover:translate-x-1 transition-all duration-200 text-left cursor-pointer inline-flex items-center gap-1 group"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#C8A46B] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{col.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Support & Policies with Hover Slide */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-[#C8A46B] font-semibold block">
              Client Concierge
            </span>
            <ul className="space-y-2 text-[#D8CCC0] font-light">
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicyModal('shipping')}
                  className="hover:text-[#FCFAF6] hover:translate-x-1 transition-all duration-200 cursor-pointer inline-flex items-center gap-1 group text-left"
                >
                  <span className="h-1 w-1 rounded-full bg-[#C8A46B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Pan-India Shipping Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicyModal('returns')}
                  className="hover:text-[#FCFAF6] hover:translate-x-1 transition-all duration-200 cursor-pointer inline-flex items-center gap-1 group text-left"
                >
                  <span className="h-1 w-1 rounded-full bg-[#C8A46B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Returns & Replacements</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicyModal('privacy')}
                  className="hover:text-[#FCFAF6] hover:translate-x-1 transition-all duration-200 cursor-pointer inline-flex items-center gap-1 group text-left"
                >
                  <span className="h-1 w-1 rounded-full bg-[#C8A46B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicyModal('terms')}
                  className="hover:text-[#FCFAF6] hover:translate-x-1 transition-all duration-200 cursor-pointer inline-flex items-center gap-1 group text-left"
                >
                  <span className="h-1 w-1 rounded-full bg-[#C8A46B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Terms & Conditions</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('account');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FCFAF6] hover:translate-x-1 transition-all duration-200 cursor-pointer inline-flex items-center gap-1 group text-left"
                >
                  <span className="h-1 w-1 rounded-full bg-[#C8A46B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Track Your Shipment</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Dedicated Admin Dashboard Footer Strip with Subtle Hover Elevation */}
        <div className="my-8 p-5 bg-[#2A1E17] rounded-xl border border-[#3E2D22] hover:border-[#C8A46B]/40 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="h-10 w-10 rounded-full bg-[#3E2D22] flex items-center justify-center text-[#C8A46B] shrink-0 border border-[#C8A46B]/40">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm font-medium text-[#FCFAF6]">
                  Studio Operations & Admin Dashboard
                </span>
                <span className="text-[9px] uppercase tracking-wider bg-[#8A9A86]/20 text-[#8A9A86] px-1.5 py-0.5 rounded-xs font-semibold">
                  Store Manager
                </span>
              </div>
              <p className="text-[11px] text-[#D8CCC0] font-light">
                Add & edit decor items, update inventory stock, dispatch Delhivery courier tracking, and edit website banners.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#C8A46B] hover:bg-[#B8935A] hover:-translate-y-0.5 text-[#1E1610] text-xs uppercase tracking-wider font-semibold rounded-xs transition-all whitespace-nowrap shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Open Admin Dashboard</span>
          </button>
        </div>

        {/* Bottom Strip: Safe Indian Payments, Copyright, and Back to Top */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8C7D73] font-light">
          <div>
            © {new Date().getFullYear()} Cloudberry Home Private Limited. All Rights Reserved. Handcrafted in India.
          </div>

          <div className="flex items-center gap-6">
            {/* Payment Badges */}
            <div className="flex items-center gap-2 text-[11px] text-[#D8CCC0]">
              <span className="hidden sm:inline">Supported:</span>
              <span className="px-2 py-0.5 bg-[#2A1E17] border border-[#3E2D22] rounded-xs font-mono text-[#FCFAF6] text-[10px]">UPI</span>
              <span className="px-2 py-0.5 bg-[#2A1E17] border border-[#3E2D22] rounded-xs font-mono text-[#FCFAF6] text-[10px]">Cards</span>
              <span className="px-2 py-0.5 bg-[#2A1E17] border border-[#3E2D22] rounded-xs font-mono text-[#FCFAF6] text-[10px]">Netbanking</span>
              <span className="px-2 py-0.5 bg-[#2A1E17] border border-[#3E2D22] rounded-xs font-mono text-[#FCFAF6] text-[10px]">COD</span>
            </div>

            {/* Back to top button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs text-[#D8CCC0] hover:text-[#C8A46B] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {activePolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FCFAF6] rounded-xl shadow-2xl p-6 sm:p-8 border border-[#E2D9CC] text-[#201610] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2D9CC]">
              <h3 className="font-serif text-2xl text-[#201610]">
                {policyContent[activePolicyModal]?.title}
              </h3>
              <button
                type="button"
                onClick={() => setActivePolicyModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE7DE] text-[#201610] hover:bg-[#E2D9CC] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4 text-xs sm:text-sm text-[#483D35] font-light leading-relaxed">
              {policyContent[activePolicyModal]?.body}
            </div>

            <div className="pt-4 border-t border-[#E2D9CC] text-right">
              <button
                type="button"
                onClick={() => setActivePolicyModal(null)}
                className="px-5 py-2 bg-[#2A1E17] text-[#FAF6F0] hover:bg-[#3D2C22] text-xs uppercase tracking-wider font-semibold rounded-xs cursor-pointer transition-colors"
              >
                Close Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
