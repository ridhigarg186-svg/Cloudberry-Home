import React from 'react';
import { Leaf, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useShop } from '../context/ShopContext';

export const StoryView: React.FC = () => {
  const { setCurrentView } = useShop();

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Heading with Subtle Fade-In */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="h-[1px] w-8 bg-[#C8A46B]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#6E6157] font-semibold">
              Our Journey & Ethos
            </span>
            <span className="h-[1px] w-8 bg-[#C8A46B]" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#201610] leading-tight">
            Beautiful Living, Thoughtfully Chosen
          </h1>

          <p className="font-serif italic text-lg sm:text-xl text-[#C8A46B] font-light">
            "A sanctuary is not built in a day. It is gathered gently, piece by tactile piece."
          </p>
        </motion.div>

        {/* Hero Editorial Vignette with Hover Zoom & Subtle Parallax Feel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="group relative aspect-[16/9] rounded-xl overflow-hidden bg-[#EDE7DE] border border-[#E2D9CC] shadow-md hover:shadow-xl transition-all duration-500"
        >
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85"
            alt="Warm modern living interior with curated Cloudberry decor"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center transition-transform duration-800 ease-out group-hover:scale-105 will-change-transform"
          />
        </motion.div>

        {/* Story Prose */}
        <div className="prose prose-stone max-w-none space-y-6 text-sm sm:text-base text-[#483D35] font-light leading-relaxed">
          <p className="text-lg text-[#201610] font-normal leading-relaxed first-letter:float-left first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:text-[#2A1E17]">
            Cloudberry Home was founded on a simple realization: in an era of rapid trends and disposable homeware, modern living spaces yearn for quiet permanence. We sought objects that carry weight, texture, and soul—items that soften ambient acoustics, reflect candlelight gently, and feel honest beneath your fingertips.
          </p>

          <p>
            Rather than relying on industrial polymer molds, we travel across India to collaborate directly with master craftspersons in their generational workshops. From the historic clay kilns of Khurja in Uttar Pradesh, where terracotta bisques are thrown on foot-powered wheels, to the marble and travertine ateliers of Udaipur, each silhouette honors age-old techniques refined across centuries.
          </p>

          <p>
            Our palette is deliberately restrained: warm cream, ivory, mocha brown, sage green, and muted burnished gold. These are the soothing tones found in unbleached Belgian linen, dried olive leaves, natural river silt, and honeyed sunlight. They do not fight for your attention; rather, they grant your senses room to rest.
          </p>
        </div>

        {/* Artisan Guilds Map / Cards with Staggered Viewport Entrance & Hover Lift */}
        <div className="space-y-6 pt-8 border-t border-[#E2D9CC]">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#6E6157] font-semibold">
              The Artisan Guilds
            </span>
            <h2 className="font-serif text-3xl font-light text-[#201610]">
              Crafted Across India's Heritage Studios
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] space-y-3 shadow-2xs hover:shadow-[0_16px_32px_-8px_rgba(32,22,16,0.12)] hover:border-[#C8A46B]/80 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-2 text-[#6E6157]">
                <MapPin className="h-4 w-4 text-[#C8A46B]" />
                <span className="text-xs uppercase font-semibold">Khurja & Jaipur</span>
              </div>
              <h3 className="font-serif text-lg text-[#201610]">Stoneware & Ceramic Sculptures</h3>
              <p className="text-xs text-[#483D35] font-light leading-relaxed">
                High-fired earthenware sculpted with organic wabi-sabi asymmetries and tactile unglazed bisques that age gracefully.
              </p>
            </div>

            <div className="p-6 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] space-y-3 shadow-2xs hover:shadow-[0_16px_32px_-8px_rgba(32,22,16,0.12)] hover:border-[#C8A46B]/80 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-2 text-[#6E6157]">
                <MapPin className="h-4 w-4 text-[#C8A46B]" />
                <span className="text-xs uppercase font-semibold">Moradabad & Delhi</span>
              </div>
              <h3 className="font-serif text-lg text-[#201610]">Spun & Cast Solid Brass</h3>
              <p className="text-xs text-[#483D35] font-light leading-relaxed">
                Heavy solid brass candleholders, mantels, and clocks hand-polished with a brushed satin lacquer to resist tarnishing.
              </p>
            </div>

            <div className="p-6 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] space-y-3 shadow-2xs hover:shadow-[0_16px_32px_-8px_rgba(32,22,16,0.12)] hover:border-[#C8A46B]/80 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-2 text-[#6E6157]">
                <MapPin className="h-4 w-4 text-[#C8A46B]" />
                <span className="text-xs uppercase font-semibold">Panipat & Bhagalpur</span>
              </div>
              <h3 className="font-serif text-lg text-[#201610]">Linen & Waffle Textiles</h3>
              <p className="text-xs text-[#483D35] font-light leading-relaxed">
                Pre-washed European flax linen and fine combed cotton spun on traditional shuttle looms for cloud-like softness.
              </p>
            </div>
          </div>
        </div>

        {/* Explore Collection CTA */}
        <div className="text-center pt-8 border-t border-[#E2D9CC]">
          <button
            type="button"
            onClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-[0.18em] font-medium rounded-xs hover:bg-[#3D2C22] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 shadow-sm cursor-pointer"
          >
            <span>Explore Handcrafted Homeware</span>
            <ArrowRight className="h-4 w-4 text-[#C8A46B] transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
