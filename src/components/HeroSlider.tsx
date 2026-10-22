import React, { useState } from 'react';
import { ArrowRight, Sparkles, Plus, Eye, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';

interface Hotspot {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  top: string;
  left: string;
  image: string;
  slug: string;
}

interface LivingRoomScene {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  hotspots: Hotspot[];
}

export const HeroSlider: React.FC = () => {
  const { setCurrentView, setSelectedCategory, products, setQuickViewProduct, addToCart } = useShop();
  const [imageError, setImageError] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Single curated, high-end living room photograph
  const livingRoomScene: LivingRoomScene = {
    id: 'scene-1',
    badge: 'Vignette 01 · Main Lounge',
    title: 'The Living Sanctuary',
    subtitle: 'Belgian Linen Sofa & Organic Stoneware',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=88',
    alt: 'Luxury minimalist living room with cream sofa, low oak coffee table, and natural light',
    hotspots: [
      {
        id: 'hotspot-1',
        name: 'Elysian Belgian Linen Sofa',
        category: 'Living Room Decor',
        price: 14999,
        originalPrice: 18999,
        top: '58%',
        left: '38%',
        image:
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
        slug: 'elysian-travertine-coffee-table',
      },
      {
        id: 'hotspot-2',
        name: 'Kyoto Artisanal Stoneware Vase',
        category: 'Vases & Pottery',
        price: 2499,
        originalPrice: 3299,
        top: '72%',
        left: '68%',
        image:
          'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
        slug: 'aethel-ceramic-ribbed-vase',
      },
    ],
  };

  const handleHotspotAction = (spot: Hotspot) => {
    const matchedProduct =
      products.find((p) => p.slug === spot.slug || p.name.includes(spot.name.split(' ')[0])) ||
      products[0];
    if (matchedProduct) {
      setQuickViewProduct(matchedProduct);
    }
  };

  const handleHotspotAdd = (e: React.MouseEvent, spot: Hotspot) => {
    e.stopPropagation();
    const matchedProduct =
      products.find((p) => p.slug === spot.slug || p.name.includes(spot.name.split(' ')[0])) ||
      products[0];
    if (matchedProduct) {
      addToCart(matchedProduct, 1);
    }
  };

  return (
    <section
      className="relative w-full bg-[#FAF6F0] border-b border-[#E2D9CC] overflow-hidden"
      aria-label="Homepage Feature Hero"
    >
      {/* 
        Two-Column Layout with EQUAL 50% WIDTH:
        - Left 50%: Staggered animated Headline, Subtitle, and Call-to-Action Buttons with balanced whitespace
        - Right 50%: Single curated Living Room photograph with cinematic ambient animation, warm sunlight flares, and interactive shoppable decor pins
      */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-[580px] lg:min-h-[680px] xl:min-h-[760px] items-stretch">
        {/* Left Column: Exactly 50% Width with balanced whitespace below header & logo */}
        <div className="w-full flex flex-col justify-center pt-14 sm:pt-18 lg:pt-24 xl:pt-28 pb-12 sm:pb-16 lg:pb-20 px-8 sm:px-12 lg:px-16 xl:px-20 bg-[#FAF6F0] lg:border-r border-[#E2D9CC] z-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 sm:space-y-7 max-w-xl"
          >
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="h-[1px] w-8 bg-[#C8A46B]" />
              <span className="text-xs uppercase tracking-[0.24em] font-medium text-[#6E6157]">
                Spring / Summer 2026 Collection
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-[#201610] leading-[1.12] text-balance"
            >
              Make Room for Beautiful Living
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-sans text-base sm:text-lg text-[#483D35] max-w-lg leading-relaxed font-light"
            >
              Every Detail Tells a Story.
            </motion.p>

            {/* Action Buttons: Neatly aligned with headline and description */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-1"
            >
              <button
                type="button"
                onClick={() => {
                  setCurrentView('collections');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-[0.16em] font-medium transition-all duration-300 hover:bg-[#3E2D22] shadow-sm rounded-xs cursor-pointer hover:shadow-md hover:-translate-y-0.5 border border-[#2A1E17]"
              >
                <span>Explore Collections</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 text-[#C8A46B]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-7 py-3.5 border border-[#483D35]/35 text-[#201610] text-xs uppercase tracking-[0.16em] font-medium hover:border-[#201610] hover:bg-[#EDE7DE] transition-all rounded-xs cursor-pointer hover:-translate-y-0.5 bg-[#FAF6F0]"
              >
                Shop New Arrivals
              </button>
            </motion.div>

            {/* Micro Feature Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="pt-4 flex items-center gap-6 text-xs text-[#483D35] font-light border-t border-[#E2D9CC]"
            >
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C8A46B]" />
                <span>Noble Natural Materials</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C8A46B]" />
                <span>Artisan Guild Handcrafted</span>
              </div>
              <div className="flex items-center gap-1.5 hidden sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C8A46B]" />
                <span>Pan-India Delivery</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 
          Right Column: Exactly 50% Width
          SINGLE CURATED PICTURE OF THE LIVING ROOM with refined soft cream, chocolate, and champagne accents
        */}
        <div className="w-full flex flex-col justify-center p-3 sm:p-5 lg:p-6 xl:p-8 bg-[#F5F0E6] relative">
          {/* Header Controls for Living Room View */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C8A46B] animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#483D35]">
                Curated Living Room · Shoppable Vignette
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#6E6157]">
              <Sparkles className="h-3.5 w-3.5 text-[#C8A46B]" />
              <span className="hidden sm:inline font-medium">Click pins to shop decor</span>
            </div>
          </div>

          {/* Single Living Room Picture Container */}
          <div className="w-full h-full min-h-[480px] sm:min-h-[560px] lg:min-h-[620px] xl:min-h-[690px] flex flex-col">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full min-h-[480px] sm:min-h-[560px] lg:min-h-[620px] xl:min-h-[690px] rounded-xl overflow-hidden shadow-lg bg-[#EDE7DE] border border-[#E2D9CC] group flex flex-col justify-end"
            >
              {!imageError ? (
                <motion.img
                  src={livingRoomScene.image}
                  alt={livingRoomScene.alt}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  animate={{
                    scale: [1, 1.04, 1],
                    x: [0, -3, 0],
                  }}
                  transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#F5F0E6] to-[#E2D9CC] p-6 text-center">
                  <span className="font-serif text-2xl text-[#201610]">
                    The Living Sanctuary
                  </span>
                </div>
              )}

              {/* Champagne Gold Ambient Light Overlay */}
              <motion.div
                animate={{
                  opacity: [0.12, 0.3, 0.12],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-gradient-to-tr from-amber-700/10 via-[#C8A46B]/20 to-amber-100/20 pointer-events-none mix-blend-soft-light"
              />

              {/* Dark vignette bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

              {/* Top Badge: Picture Tag */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FCFAF6]/90 backdrop-blur-md border border-[#E2D9CC] text-[#201610] text-[11px] font-medium tracking-wide shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#C8A46B]" />
                <span>{livingRoomScene.badge}</span>
              </div>

              {/* Hotspots for the single picture */}
              {livingRoomScene.hotspots.map((spot) => {
                const isActive = activeHotspot === spot.id;
                return (
                  <div
                    key={spot.id}
                    style={{ top: spot.top, left: spot.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin"
                  >
                    {/* Outer Pulsing Glow */}
                    <motion.span
                      animate={{
                        scale: [1, 2.1, 1],
                        opacity: [0.75, 0, 0.75],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                      className="absolute -inset-1 rounded-full bg-[#C8A46B]/50 pointer-events-none"
                    />

                    {/* Hotspot Pin Button */}
                    <button
                      type="button"
                      onClick={() => setActiveHotspot(isActive ? null : spot.id)}
                      className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#2A1E17]/90 text-[#FCFAF6] border-2 border-[#FCFAF6] shadow-lg hover:bg-[#C8A46B] hover:text-[#201610] hover:scale-110 transition-all duration-300 cursor-pointer focus:outline-none"
                      aria-label={`View ${spot.name}`}
                    >
                      <Plus
                        className={`h-4 w-4 transition-transform duration-300 ${
                          isActive ? 'rotate-45 text-[#C8A46B]' : ''
                        }`}
                      />
                    </button>

                    {/* Mini Preview Popup */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.88, y: 8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.88, y: 8 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-[#FCFAF6]/98 backdrop-blur-md rounded-xl shadow-2xl border border-[#E2D9CC] text-[#201610] z-30"
                        >
                          <div className="flex gap-3 items-center">
                            <img
                              src={spot.image}
                              alt={spot.name}
                              className="h-14 w-14 rounded-lg object-cover border border-[#E2D9CC]"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] uppercase tracking-wider text-[#6E6157] font-medium block truncate">
                                {spot.category}
                              </span>
                              <h3 className="font-serif text-sm font-semibold text-[#201610] leading-snug truncate">
                                {spot.name}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-sm font-medium text-[#201610]">
                                  ₹{spot.price.toLocaleString('en-IN')}
                                </span>
                                {spot.originalPrice && (
                                  <span className="text-[10px] text-[#8C7D73] line-through">
                                    ₹{spot.originalPrice.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2.5 border-t border-[#E2D9CC]">
                            <button
                              type="button"
                              onClick={() => handleHotspotAction(spot)}
                              className="flex items-center justify-center gap-1.5 py-1.5 px-2 text-[10px] font-medium tracking-wider uppercase bg-[#EDE7DE] hover:bg-[#E2D9CC] text-[#201610] rounded-xs transition-colors cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Preview</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleHotspotAdd(e, spot)}
                              className="flex items-center justify-center gap-1.5 py-1.5 px-2 text-[10px] font-medium tracking-wider uppercase bg-[#2A1E17] hover:bg-[#3E2D22] text-[#FAF6F0] rounded-xs transition-colors cursor-pointer"
                            >
                              <ShoppingBag className="h-3.5 w-3.5 text-[#C8A46B]" />
                              <span>Add</span>
                            </button>
                          </div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-solid border-t-[#FCFAF6] border-t-8 border-x-transparent border-x-8 border-b-0" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Bottom Caption Bar */}
              <div className="relative p-4 sm:p-5 lg:p-6 z-10 text-white drop-shadow-md">
                <div className="font-serif text-base sm:text-lg lg:text-xl text-[#FCFAF6] font-medium">
                  {livingRoomScene.title}
                </div>
                <div className="text-xs sm:text-sm text-[#E8D7BE] tracking-wide mt-0.5">
                  {livingRoomScene.subtitle}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
