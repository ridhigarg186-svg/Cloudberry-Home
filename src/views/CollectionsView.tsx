import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const CollectionsView: React.FC = () => {
  const { collections, products, selectedCollection } = useShop();

  const [activeSlug, setActiveSlug] = useState<string>(
    selectedCollection || collections[0].slug
  );

  const currentCol = collections.find((c) => c.slug === activeSlug) || collections[0];

  // Filter products for this collection
  const collectionProducts = products.filter((p) =>
    p.collections.some(
      (c) =>
        c.toLowerCase() === currentCol.name.toLowerCase() ||
        c.toLowerCase() === currentCol.slug.toLowerCase()
    )
  );

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Subtle Motion */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-[#E2D9CC] pb-6 mb-10"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#C8A46B]" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#6E6157] font-semibold">
                Curated Capsules
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#201610]">
              Special Collections
            </h1>
          </div>
          <p className="mt-3 text-xs sm:text-sm text-[#483D35] max-w-xl font-light leading-relaxed">
            Five singular design philosophies bringing together stone, clay, brass, and linen to compose living spaces of serenity.
          </p>
        </motion.div>

        {/* Collection Selector Tabs with Smooth State Changes */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {collections.map((col) => {
            const isActive = activeSlug === col.slug;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => setActiveSlug(col.slug)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-xs transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#2A1E17] text-[#FAF6F0] shadow-sm hover:bg-[#3D2C22]'
                    : 'bg-[#FCFAF6] border border-[#E2D9CC] text-[#483D35] hover:border-[#2A1E17] hover:text-[#201610]'
                }`}
              >
                {col.name}
              </button>
            );
          })}
        </div>

        {/* Hero Spotlight for the Active Collection with Smooth Crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCol.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="group relative aspect-[16/7] sm:aspect-[16/6] rounded-xl overflow-hidden bg-[#EDE7DE] border border-[#E2D9CC] shadow-sm mb-12"
          >
            <img
              src={currentCol.image}
              alt={currentCol.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104 will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent transition-opacity group-hover:opacity-90" />

            <div className="absolute inset-x-6 sm:inset-x-10 bottom-6 sm:bottom-10 text-white max-w-2xl space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#E8D7BE] font-medium block">
                {currentCol.tagline}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#FCFAF6]">
                {currentCol.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF6F0] font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
                {currentCol.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Collection Products Grid with Staggered Viewport Entrance */}
        <div className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-[#E2D9CC] pb-3">
            <h3 className="font-serif text-xl text-[#201610]">
              Pieces in this Collection ({collectionProducts.length})
            </h3>
            <span className="text-xs text-[#6E6157]">
              All items handcrafted and available for pan-India delivery
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collectionProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
