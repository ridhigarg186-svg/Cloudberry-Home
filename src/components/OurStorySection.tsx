import React, { useState } from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, Leaf, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useShop } from '../context/ShopContext';

export const OurStorySection: React.FC = () => {
  const { setCurrentView } = useShop();
  const [imgError, setImgError] = useState(false);

  return (
    <section className="py-20 md:py-28 bg-[#FAF6F0] border-t border-[#E2D9CC] overflow-hidden" aria-labelledby="story-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Vignette with Subtle Hover Zoom & Lift */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative group"
          >
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#FCFAF6] border border-[#E2D9CC] shadow-lg group-hover:shadow-2xl transition-all duration-500">
              {!imgError ? (
                <img
                  src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80"
                  alt="Artisan ceramic craft and warm home decor arrangement"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106 will-change-transform"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center p-8 bg-[#EDE7DE] text-[#201610]">
                  <span className="font-serif text-2xl text-center">Handcrafted with Intention</span>
                </div>
              )}

              {/* Floating aesthetic quote card with subtle glass blur & elevation */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#FCFAF6]/95 backdrop-blur-md p-6 rounded-lg shadow-md border border-[#E2D9CC] transition-transform duration-400 group-hover:-translate-y-1">
                <p className="font-serif italic text-base text-[#201610] leading-snug">
                  "A home is not merely decorated; it is composed through quiet, intentional details that welcome calm into your day."
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-[#6E6157]">
                  <span className="tracking-widest uppercase font-medium text-[10px]">Cloudberry Manifesto</span>
                  <span className="text-[#C8A46B]">Est. 2024</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Narrative with Staggered Viewport Entrance */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-[1px] w-8 bg-[#C8A46B]" />
                <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#6E6157]">
                  Our Philosophy
                </span>
              </div>
              <h2 id="story-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#201610] leading-tight">
                Beautiful Living, Thoughtfully Chosen
              </h2>
            </div>

            <p className="font-sans text-base sm:text-lg text-[#483D35] font-light leading-relaxed">
              At <strong className="text-[#201610] font-medium">Cloudberry Home</strong>, we believe that true luxury is not loud or fast. It is the soothing texture of hand-washed Belgian linen against skin, the warm ambient glow of an alabaster lamp at dusk, and the unhurried organic beauty of a hand-thrown stoneware vessel on your morning table.
            </p>

            <p className="font-sans text-sm sm:text-base text-[#483D35] font-light leading-relaxed">
              We curate and co-create home decor with master craftspeople across Rajasthan, Uttar Pradesh, and Bengal—honoring ancestral stonework, brass smithing, and pottery guilds. Every curve, glaze, and thread is chosen with a singular intention: to help you cultivate a home that feels peaceful, grounded, and deeply restorative.
            </p>

            {/* 4 Pillars of Craftsmanship with Micro-Hover Dynamics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E2D9CC]">
              <div className="space-y-1.5 p-3 rounded-lg hover:bg-[#F5F0E6] transition-colors duration-200">
                <div className="flex items-center gap-2 text-[#201610]">
                  <Leaf className="h-4 w-4 text-[#8A9A86]" />
                  <h3 className="font-serif text-base font-medium">Tactile Noble Materials</h3>
                </div>
                <p className="text-xs text-[#6E6157] font-light leading-normal">
                  Natural Roman travertine, unglazed stoneware, pure soy wax, and European flax linen.
                </p>
              </div>

              <div className="space-y-1.5 p-3 rounded-lg hover:bg-[#F5F0E6] transition-colors duration-200">
                <div className="flex items-center gap-2 text-[#201610]">
                  <HeartHandshake className="h-4 w-4 text-[#C8A46B]" />
                  <h3 className="font-serif text-base font-medium">Artisan Fair Trade</h3>
                </div>
                <p className="text-xs text-[#6E6157] font-light leading-normal">
                  Supporting generational craft communities with ethical wages and safe workshop practices.
                </p>
              </div>

              <div className="space-y-1.5 p-3 rounded-lg hover:bg-[#F5F0E6] transition-colors duration-200">
                <div className="flex items-center gap-2 text-[#201610]">
                  <Sparkles className="h-4 w-4 text-[#C8A46B]" />
                  <h3 className="font-serif text-base font-medium">Warm Neutral Palette</h3>
                </div>
                <p className="text-xs text-[#6E6157] font-light leading-normal">
                  Harmonious tones of cream, ivory, mocha, sage, and muted gold designed to outlast passing trends.
                </p>
              </div>

              <div className="space-y-1.5 p-3 rounded-lg hover:bg-[#F5F0E6] transition-colors duration-200">
                <div className="flex items-center gap-2 text-[#201610]">
                  <ShieldCheck className="h-4 w-4 text-[#8A9A86]" />
                  <h3 className="font-serif text-base font-medium">Insured Pan-India Transit</h3>
                </div>
                <p className="text-xs text-[#6E6157] font-light leading-normal">
                  Plastic-free honeycomb packaging engineered to protect fragile stone & ceramics across India.
                </p>
              </div>
            </div>

            {/* Read Full Story Button with Lift & Arrow Animation */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentView('story');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-[0.15em] font-medium rounded-xs hover:bg-[#3D2C22] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer shadow-sm"
              >
                <span>Read Our Full Story & Guilds</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#C8A46B] transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
