import React from 'react';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { RoomInspiration } from '../types';

export const RoomsView: React.FC = () => {
  const { rooms, setShopLookRoom, setSelectedProductId, setCurrentView, products } = useShop();

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Subtle Motion */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-[#E2D9CC] pb-6 mb-12"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#C8A46B]" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#6E6157] font-semibold">
                Spatial Styling Guides
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#201610]">
              Rooms & Living Inspirations
            </h1>
          </div>
          <p className="mt-3 text-xs sm:text-sm text-[#483D35] max-w-xl font-light leading-relaxed">
            Every room tells a distinct story of tranquility and light. Explore our architectural room blueprints, styling philosophies, and shop the exact handcrafted pieces used in each composition.
          </p>
        </motion.div>

        {/* Room Vignettes with Staggered Viewport Entrance */}
        <div className="space-y-16">
          {rooms.map((room: RoomInspiration, idx: number) => {
            const isReversed = idx % 2 === 1;
            const roomProducts = room.productIds
              .map((id) => products.find((p) => p.id === id))
              .filter(Boolean);

            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] overflow-hidden shadow-2xs hover:shadow-[0_20px_40px_-12px_rgba(32,22,16,0.12)] hover:-translate-y-1 transition-all duration-400 ease-out p-6 md:p-8 will-change-transform"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                    isReversed ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Image Column */}
                  <div className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : ''}`}>
                    <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-[#EDE7DE] border border-[#E2D9CC] shadow-sm group">
                      <img
                        src={room.image}
                        alt={room.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-106 will-change-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none transition-opacity group-hover:opacity-85" />

                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-[#FCFAF6]/95 text-[#201610] text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-xs shadow-xs border border-[#E2D9CC]">
                          {room.roomType}
                        </span>
                      </div>

                      <div className="absolute bottom-4 right-4 z-10">
                        <button
                          type="button"
                          onClick={() => setShopLookRoom(room)}
                          className="px-4 py-2 bg-[#FCFAF6] text-[#201610] text-xs uppercase tracking-wider font-semibold rounded-xs shadow-md hover:bg-[#2A1E17] hover:text-[#FAF6F0] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
                        >
                          <ShoppingBag className="h-3.5 w-3.5 text-[#C8A46B]" />
                          <span>Shop This Look</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Editorial & Tips Column */}
                  <div className={`lg:col-span-5 space-y-5 ${isReversed ? 'lg:order-1' : ''}`}>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#6E6157] font-medium block">
                        Composition {idx + 1}
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#201610] mt-1">
                        {room.title}
                      </h2>
                      <p className="font-serif italic text-sm text-[#C8A46B] mt-1">
                        "{room.tagline}"
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-[#483D35] font-light leading-relaxed">
                      {room.description}
                    </p>

                    {/* Stylist Blueprint */}
                    <div className="space-y-2 pt-2 border-t border-[#E2D9CC]">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#201610] block">
                        Architectural Principles:
                      </span>
                      <ul className="space-y-1 text-xs text-[#483D35]">
                        {room.stylingTips.map((tip, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#C8A46B] mt-1.5 shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Styled Pieces Row */}
                    <div className="pt-3 border-t border-[#E2D9CC] flex items-center justify-between">
                      <span className="text-xs text-[#6E6157] font-mono tabular-nums">
                        {roomProducts.length} pieces in room
                      </span>

                      <button
                        type="button"
                        onClick={() => setShopLookRoom(room)}
                        className="text-xs uppercase tracking-wider font-semibold text-[#201610] hover:text-[#C8A46B] inline-flex items-center gap-1.5 cursor-pointer group/btn"
                      >
                        <span>View Styling Details</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#C8A46B] transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
