import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { Category } from '../types';

export const CategoriesSection: React.FC = () => {
  const { categories, products, setSelectedCategory, setCurrentView } = useShop();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category.slug);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine item count: retain existing quantities for legacy categories,
  // and compute real product count dynamically for newly added categories
  const getCategoryCount = (cat: Category): number => {
    if (cat.isLegacy) {
      return cat.itemCount;
    }

    const cSlug = (cat.slug || '').toLowerCase().trim();
    const cName = (cat.name || '').toLowerCase().trim();

    const matching = products.filter((p) => {
      const pCat = (p.category || '').toLowerCase().trim();
      const pSlug = (p.categorySlug || '').toLowerCase().trim();

      if (pSlug === cSlug || pCat === cName) return true;

      if (cSlug === 'rugs-carpets') {
        return (
          pSlug === 'rugs-carpets' ||
          pCat.includes('rug') ||
          pCat.includes('carpet') ||
          p.tags?.some((t) => t.toLowerCase().includes('rug') || t.toLowerCase().includes('runner'))
        );
      }
      if (cSlug === 'clocks') {
        return (
          pSlug === 'clocks' ||
          pSlug === 'wall-clocks' ||
          pCat.includes('clock') ||
          p.tags?.some((t) => t.toLowerCase().includes('clock'))
        );
      }
      if (cSlug === 'photo-frames') {
        return (
          pSlug === 'photo-frames' ||
          pCat.includes('frame') ||
          p.tags?.some((t) => t.toLowerCase().includes('frame'))
        );
      }
      if (cSlug === 'wall-shelves') {
        return (
          pSlug === 'wall-shelves' ||
          pCat.includes('shelf') ||
          p.tags?.some((t) => t.toLowerCase().includes('shelf'))
        );
      }
      if (cSlug === 'decorative-bowls-trays') {
        return (
          pSlug === 'decorative-bowls-trays' ||
          pSlug === 'decorative-trays' ||
          pSlug === 'vases-bowls' ||
          pCat.includes('tray') ||
          pCat.includes('bowl') ||
          p.tags?.some((t) => t.toLowerCase().includes('tray') || t.toLowerCase().includes('bowl'))
        );
      }
      if (cSlug === 'votive-holders') {
        return (
          pSlug === 'votive-holders' ||
          pCat.includes('votive') ||
          p.tags?.some((t) => t.toLowerCase().includes('votive') || t.toLowerCase().includes('tealight'))
        );
      }

      return false;
    });

    return matching.length > 0 ? matching.length : (cat.itemCount || 0);
  };

  return (
    <section className="py-16 md:py-24 bg-[#F2ECE1] border-b border-[#E2D9CC] overflow-hidden" aria-labelledby="categories-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Subtle Viewport Motion */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#E2D9CC] pb-6"
        >
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#6E6157]">
              Curated Spaces
            </span>
            <h2 id="categories-heading" className="font-serif text-3xl md:text-4xl font-light text-[#201610]">
              Shop by Category
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-[#483D35] max-w-md font-light leading-relaxed">
            Explore 20 distinctive expressions of warmth and refinement, each piece crafted from noble, tactile materials.
          </p>
        </motion.div>

        {/* 20 Categories Responsive Grid with Staggered Viewport Reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-5.5"
        >
          {categories.map((cat, idx) => {
            const hasError = imageErrors[cat.id];
            const itemCount = getCategoryCount(cat);

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{
                  duration: 0.55,
                  delay: (idx % 5) * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => handleCategoryClick(cat)}
                className="group relative flex flex-col cursor-pointer transition-all duration-400 ease-out hover:-translate-y-1.5 will-change-transform"
              >
                {/* Category Image Card with Consistent Proportion & Hover Zoom */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#FCFAF6] shadow-2xs border border-[#E2D9CC] group-hover:border-[#C8A46B] group-hover:shadow-[0_16px_32px_-8px_rgba(32,22,16,0.18)] transition-all duration-400">
                  {!hasError ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setImageErrors((prev) => ({ ...prev, [cat.id]: true }))
                      }
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 will-change-transform"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-[#EDE7DE] p-3 text-center">
                      <span className="font-serif text-sm text-[#201610]">{cat.name}</span>
                    </div>
                  )}

                  {/* Gradient Scrim for High Contrast Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                  {/* Subtle Floating Arrow on Hover */}
                  <div className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#FCFAF6]/95 text-[#201610] opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#C8A46B] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  {/* Content on Bottom of Image */}
                  <div className="absolute inset-x-3.5 bottom-3 text-[#FCFAF6] select-none">
                    <h3 className="font-serif text-sm sm:text-base font-normal leading-tight group-hover:text-[#E8D7BE] transition-colors drop-shadow-xs">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-[#E2D9CC] tracking-wide font-sans mt-0.5 tabular-nums font-light drop-shadow-2xs">
                      {itemCount} Items
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
