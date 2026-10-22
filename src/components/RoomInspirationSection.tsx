import React, { useState } from 'react';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { RoomInspiration } from '../types';

export const RoomInspirationSection: React.FC = () => {
  const { rooms, setShopLookRoom, setCurrentView } = useShop();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  return (
    <section className="py-16 md:py-24 bg-[#F2ECE1] border-b border-[#E2D9CC] overflow-hidden" aria-labelledby="room-inspiration-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Viewport Animation */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#E2D9CC] pb-6"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#C8A46B]" />
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#6E6157]">
                Interior Styling
              </span>
            </div>
            <h2 id="room-inspiration-heading" className="font-serif text-3xl md:text-4xl font-light text-[#201610]">
              Style Your Space
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-[#483D35] max-w-md font-light leading-relaxed">
            Harmonious interior vignettes styled by our resident architects. Click any scene to shop the exact handcrafted pieces used.
          </p>
        </motion.div>

        {/* Room Vignettes Grid: 1 large feature + 4 supporting room cards with Viewport Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room: RoomInspiration, idx: number) => {
            const hasError = imageErrors[room.id];
            const isFeatured = idx === 0;

            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.65, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative flex flex-col bg-[#FCFAF6] rounded-xl overflow-hidden border border-[#E2D9CC] shadow-2xs hover:shadow-[0_20px_40px_-12px_rgba(32,22,16,0.14)] hover:border-[#C8A46B]/80 hover:-translate-y-1.5 transition-all duration-400 ease-out will-change-transform ${
                  isFeatured ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Room Image Container with Deep Zoom */}
                <div
                  className={`relative w-full overflow-hidden bg-[#FCFAF6] ${
                    isFeatured ? 'aspect-[16/9]' : 'aspect-[4/3]'
                  }`}
                >
                  {!hasError ? (
                    <img
                      src={room.image}
                      alt={room.title}
                      referrerPolicy="no-referrer"
                      onError={() => setImageErrors((prev) => ({ ...prev, [room.id]: true }))}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106 will-change-transform"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-[#EDE7DE] p-6 text-center">
                      <span className="font-serif text-xl text-[#201610]">{room.title}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-90" />

                  {/* Room Category Label */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#FCFAF6]/95 backdrop-blur-sm text-[#201610] text-[11px] font-medium tracking-wider uppercase px-3 py-1 rounded-xs shadow-xs border border-[#E2D9CC]">
                      {room.roomType}
                    </span>
                  </div>

                  {/* Prominent "Shop This Look" Button Floating over Image with Hover Lift */}
                  <div className="absolute bottom-4 right-4 z-10">
                    <button
                      type="button"
                      onClick={() => setShopLookRoom(room)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FCFAF6]/95 backdrop-blur-sm text-[#201610] text-xs uppercase tracking-wider font-semibold rounded-xs shadow-md hover:bg-[#2A1E17] hover:text-[#FAF6F0] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer"
                    >
                      <ShoppingBag className="h-3.5 w-3.5 text-[#C8A46B]" />
                      <span>Shop This Look</span>
                    </button>
                  </div>
                </div>

                {/* Card Editorial Info */}
                <div className="p-6 flex flex-col flex-1 justify-between space-y-3 bg-[#FCFAF6]">
                  <div>
                    <h3 className="font-serif text-xl text-[#201610] font-normal group-hover:text-[#3E2D22] transition-colors">
                      {room.title}
                    </h3>
                    <p className="text-xs text-[#6E6157] mt-1 font-light italic">
                      "{room.tagline}"
                    </p>
                    <p className="text-xs sm:text-sm text-[#483D35] mt-2 font-light line-clamp-2 leading-relaxed">
                      {room.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E2D9CC] flex items-center justify-between text-xs text-[#6E6157]">
                    <span className="tabular-nums font-mono text-[11px]">
                      {room.productIds.length} styled pieces
                    </span>
                    <button
                      type="button"
                      onClick={() => setShopLookRoom(room)}
                      className="font-medium text-[#201610] hover:text-[#C8A46B] inline-flex items-center gap-1 uppercase tracking-wider text-[11px] cursor-pointer group/btn"
                    >
                      <span>Explore Vignette</span>
                      <ArrowRight className="h-3 w-3 text-[#C8A46B] transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Rooms CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <button
            type="button"
            onClick={() => {
              setCurrentView('rooms');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs uppercase tracking-[0.2em] font-medium text-[#201610] hover:text-[#3E2D22] inline-flex items-center gap-2 border-b border-[#201610] pb-1 hover:border-[#3E2D22] hover:-translate-y-0.5 transition-all cursor-pointer group"
          >
            <span>View All Interior Styling Guides</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#C8A46B] transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
