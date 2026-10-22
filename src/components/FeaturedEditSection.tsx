import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const FeaturedEditSection: React.FC = () => {
  const { products, setCurrentView, setSelectedCategory } = useShop();
  const [activeTab, setActiveTab] = useState<'all' | 'ceramics' | 'lighting' | 'textiles' | 'table'>('all');

  // Filter products based on tab
  const filteredProducts = products.filter((prod) => {
    if (activeTab === 'all') return prod.isFeatured || prod.isBestSeller;
    if (activeTab === 'ceramics') return prod.category === 'Vases' || prod.category === 'Planters';
    if (activeTab === 'lighting') return prod.category === 'Lamps' || prod.category === 'Lighting';
    if (activeTab === 'textiles') return prod.category === 'Cushions' || prod.category === 'Throws';
    if (activeTab === 'table') return prod.category === 'Table Decor' || prod.category === 'Candles' || prod.category === 'Living Room Decor';
    return true;
  });

  const handleViewAll = () => {
    setSelectedCategory(null);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 md:py-24 bg-[#EDE7DE] border-y border-[#E2D9CC] overflow-hidden" aria-labelledby="featured-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Viewport Animation */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10"
        >
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#6E6157]">
              Curated Highlights
            </span>
            <h2 id="featured-heading" className="font-serif text-3xl md:text-4xl font-light text-[#201610]">
              The Cloudberry Edit
            </h2>
          </div>

          {/* Interactive Filter Tabs with Smooth Indicator */}
          <div className="mt-6 md:mt-0 flex flex-wrap items-center gap-1.5 p-1 bg-[#E2D9CC]/70 rounded-md">
            {[
              { id: 'all', label: 'All Highlights' },
              { id: 'ceramics', label: 'Ceramics & Vases' },
              { id: 'lighting', label: 'Lighting & Lamps' },
              { id: 'textiles', label: 'Cushions & Throws' },
              { id: 'table', label: 'Table Accents' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-xs transition-all duration-250 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#2A1E17] text-[#FAF6F0] shadow-xs'
                      : 'text-[#483D35] hover:text-[#201610] hover:bg-[#E2D9CC]/50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Products Grid with Animated Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA with Subtle Lift */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 text-center"
        >
          <button
            type="button"
            onClick={handleViewAll}
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 border border-[#2A1E17] bg-[#FCFAF6] text-xs uppercase tracking-[0.18em] font-medium text-[#201610] hover:bg-[#2A1E17] hover:text-[#FAF6F0] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 rounded-xs shadow-2xs cursor-pointer"
          >
            <span>Explore All Decor ({products.length} Designs)</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 text-[#C8A46B]" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
