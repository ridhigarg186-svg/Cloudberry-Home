import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { Collection } from '../types';

export const SpecialCollectionsSection: React.FC = () => {
  const { collections, setSelectedCollection, setCurrentView } = useShop();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleCollectionClick = (col: Collection) => {
    setSelectedCollection(col.slug);
    setCurrentView('collections');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 md:py-24 bg-[#EDE7DE] border-b border-[#E2D9CC] overflow-hidden" aria-labelledby="collections-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#E2D9CC] pb-6"
        >
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#6E6157]">
              Curated Capsules
            </span>
            <h2 id="collections-heading" className="font-serif text-3xl md:text-4xl font-light text-[#201610]">
              Special Collections
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-[#483D35] max-w-md font-light leading-relaxed">
            Thoughtfully grouped around distinct design philosophies, moods, and color harmonies for effortless home curation.
          </p>
        </motion.div>

        {/* 5 Collections Layout: 2 top cards + 3 bottom cards */}
        <div className="space-y-6">
          {/* Top 2 Featured Collections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.slice(0, 2).map((col, idx) => {
              const hasError = imageErrors[col.id];
              return (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.65, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => handleCollectionClick(col)}
                  className="group relative h-[380px] sm:h-[420px] rounded-xl overflow-hidden cursor-pointer shadow-sm bg-[#FCFAF6] border border-[#E2D9CC] hover:border-[#C8A46B] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(32,22,16,0.18)] transition-all duration-400 ease-out will-change-transform"
                >
                  {!hasError ? (
                    <img
                      src={col.image}
                      alt={col.name}
                      referrerPolicy="no-referrer"
                      onError={() => setImageErrors((prev) => ({ ...prev, [col.id]: true }))}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 will-change-transform"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-[#EDE7DE] p-8 text-center">
                      <span className="font-serif text-2xl text-[#201610]">{col.name}</span>
                    </div>
                  )}

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

                  {/* Floating Content */}
                  <div className="absolute inset-x-6 bottom-6 text-[#FCFAF6] space-y-2">
                    <span className="text-xs tracking-widest uppercase text-[#E8D7BE] font-medium block">
                      {col.tagline}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal leading-tight group-hover:text-[#FCFAF6] transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#FAF6F0] line-clamp-2 max-w-md font-light">
                      {col.description}
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#FCFAF6] group-hover:text-[#C8A46B] transition-colors">
                      <span>Explore Collection</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#C8A46B] transition-transform duration-300 group-hover:translate-x-1.5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom 3 Collections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.slice(2, 5).map((col, idx) => {
              const hasError = imageErrors[col.id];
              return (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.65, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => handleCollectionClick(col)}
                  className="group relative h-[320px] sm:h-[360px] rounded-xl overflow-hidden cursor-pointer shadow-sm bg-[#FCFAF6] border border-[#E2D9CC] hover:border-[#C8A46B] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(32,22,16,0.18)] transition-all duration-400 ease-out will-change-transform"
                >
                  {!hasError ? (
                    <img
                      src={col.image}
                      alt={col.name}
                      referrerPolicy="no-referrer"
                      onError={() => setImageErrors((prev) => ({ ...prev, [col.id]: true }))}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 will-change-transform"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-[#EDE7DE] p-6 text-center">
                      <span className="font-serif text-xl text-[#201610]">{col.name}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

                  <div className="absolute inset-x-5 bottom-5 text-[#FCFAF6] space-y-1.5">
                    <span className="text-[11px] tracking-widest uppercase text-[#E8D7BE] font-medium block">
                      {col.tagline}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-normal leading-tight group-hover:text-[#FCFAF6] transition-colors">
                      {col.name}
                    </h3>
                    <div className="pt-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#FCFAF6] group-hover:text-[#C8A46B] transition-colors">
                      <span>Shop Capsule</span>
                      <ArrowRight className="h-3 w-3 text-[#C8A46B] transition-transform duration-300 group-hover:translate-x-1.5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
