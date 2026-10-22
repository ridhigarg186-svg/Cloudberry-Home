import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, X, ChevronDown, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const ShopView: React.FC = () => {
  const {
    products,
    categories,
    collections,
    selectedCategory,
    setSelectedCategory,
    selectedCollection,
    setSelectedCollection,
  } = useShop();

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const roomOptions = ['Living Room', 'Bedroom', 'Dining Room', 'Reading Corner', 'Entryway'];

  const colorPalette = [
    { name: 'Cream / Bone', hex: '#FBF9F5', match: ['bone', 'cream', 'sandstone', 'alabaster', 'ivory'] },
    { name: 'Mocha / Brown', hex: '#4A3728', match: ['mocha', 'walnut', 'taupe', 'bronze'] },
    { name: 'Sage Green', hex: '#8A9A86', match: ['sage', 'moss', 'olive'] },
    { name: 'Muted Gold / Brass', hex: '#C5A880', match: ['brass', 'gold', 'antique'] },
    { name: 'Terracotta Clay', hex: '#C2846D', match: ['terracotta', 'clay'] },
    { name: 'Charcoal', hex: '#423B38', match: ['charcoal', 'smoked'] },
  ];

  // Filtering logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory) {
      const cSlug = selectedCategory.toLowerCase().trim();
      result = result.filter((p) => {
        const pSlug = (p.categorySlug || '').toLowerCase().trim();
        const pCat = (p.category || '').toLowerCase().trim();

        if (pSlug === cSlug || pCat === cSlug) return true;

        if (cSlug === 'living-room-decor') {
          return pSlug === 'living-room-decor' || p.roomTags?.some((r) => r.toLowerCase().includes('living')) || pCat.includes('living');
        }
        if (cSlug === 'bedroom-decor') {
          return pSlug === 'bedroom-decor' || p.roomTags?.some((r) => r.toLowerCase().includes('bedroom')) || pCat.includes('bedroom');
        }
        if (cSlug === 'wall-art') {
          return pSlug === 'wall-art' || pCat.includes('art') || p.tags?.some((t) => t.toLowerCase().includes('art'));
        }
        if (cSlug === 'mirrors') {
          return pSlug === 'mirrors' || pCat.includes('mirror') || p.tags?.some((t) => t.toLowerCase().includes('mirror'));
        }
        if (cSlug === 'vases') {
          return pSlug === 'vases' || pCat.includes('vase') || p.tags?.some((t) => t.toLowerCase() === 'vase');
        }
        if (cSlug === 'planters') {
          return pSlug === 'planters' || pCat.includes('planter') || p.tags?.some((t) => t.toLowerCase() === 'planter' || t.toLowerCase() === 'pots');
        }
        if (cSlug === 'lighting') {
          return pSlug === 'lighting' || pCat.includes('lighting') || p.tags?.some((t) => t.toLowerCase() === 'lighting' || t.toLowerCase() === 'pendant');
        }
        if (cSlug === 'lamps') {
          return pSlug === 'lamps' || pSlug === 'table-lamps' || pSlug === 'floor-lamps' || pCat.includes('lamp') || p.tags?.some((t) => t.toLowerCase().includes('lamp'));
        }
        if (cSlug === 'candles') {
          return pSlug === 'candles' || pCat.includes('candle') || p.tags?.some((t) => t.toLowerCase() === 'candle');
        }
        if (cSlug === 'cushions') {
          return pSlug === 'cushions' || pCat.includes('cushion') || p.tags?.some((t) => t.toLowerCase() === 'cushion');
        }
        if (cSlug === 'throws') {
          return pSlug === 'throws' || pCat.includes('throw') || p.tags?.some((t) => t.toLowerCase() === 'throw' || t.toLowerCase() === 'blanket');
        }
        if (cSlug === 'table-decor') {
          return pSlug === 'table-decor' || pCat.includes('table') || p.tags?.some((t) => t.toLowerCase().includes('table') || t.toLowerCase() === 'centerpiece');
        }
        if (cSlug === 'artificial-flowers') {
          return pSlug === 'artificial-flowers' || pCat.includes('flower') || p.tags?.some((t) => t.toLowerCase().includes('botanical') || t.toLowerCase().includes('olive branch'));
        }
        if (cSlug === 'storage') {
          return pSlug === 'storage' || pCat.includes('storage') || p.tags?.some((t) => t.toLowerCase().includes('storage') || t.toLowerCase() === 'basket');
        }
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

        return (
          p.categorySlug === selectedCategory ||
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          (p.categorySlug && selectedCategory.includes(p.categorySlug)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase()))
        );
      });
    }

    // Collection filter
    if (selectedCollection) {
      const colObj = collections.find((c) => c.slug === selectedCollection);
      const colName = colObj ? colObj.name : selectedCollection;
      result = result.filter((p) =>
        p.collections.some(
          (c) => c.toLowerCase() === colName.toLowerCase() || c.toLowerCase() === selectedCollection.toLowerCase()
        )
      );
    }

    // Room filter
    if (selectedRoom) {
      result = result.filter((p) =>
        p.roomTags.some((r) => r.toLowerCase().includes(selectedRoom.toLowerCase()))
      );
    }

    // Max Price
    result = result.filter((p) => p.price <= maxPrice);

    // In Stock Only
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Color filter
    if (selectedColor) {
      const colorObj = colorPalette.find((c) => c.name === selectedColor);
      if (colorObj) {
        result = result.filter((p) => {
          if (!p.colors) return false;
          return p.colors.some((col) =>
            colorObj.match.some((m) => col.name.toLowerCase().includes(m))
          );
        });
      }
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    return result;
  }, [
    products,
    selectedCategory,
    selectedCollection,
    selectedRoom,
    maxPrice,
    inStockOnly,
    selectedColor,
    sortBy,
    collections,
  ]);

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedCollection(null);
    setSelectedRoom(null);
    setSelectedColor(null);
    setMaxPrice(15000);
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedCategory !== null ||
    selectedCollection !== null ||
    selectedRoom !== null ||
    selectedColor !== null ||
    maxPrice < 15000 ||
    inStockOnly;

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-b border-[#E2D9CC] pb-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#6E6157] font-semibold block mb-1">
                The Complete Catalog
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#201610]">
                {selectedCategory
                  ? categories.find((c) => c.slug === selectedCategory)?.name || 'Curated Category'
                  : selectedCollection
                  ? collections.find((c) => c.slug === selectedCollection)?.name || 'Curated Collection'
                  : 'All Decor & Accents'}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-[#483D35] font-light max-w-sm">
              Discover {filteredProducts.length} mindful home accents crafted in stoneware, travertine, solid brass, and pure flax linen.
            </p>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#E2D9CC] text-xs">
              <span className="text-[#6E6157] uppercase tracking-wider text-[10px] font-medium mr-1">
                Active Filters:
              </span>

              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FCFAF6] border border-[#E2D9CC] rounded-sm text-[#201610] cursor-pointer hover:border-[#C8A46B]"
                >
                  <span>Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}</span>
                  <X className="h-3 w-3 text-[#C8A46B]" />
                </button>
              )}

              {selectedCollection && (
                <button
                  type="button"
                  onClick={() => setSelectedCollection(null)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FCFAF6] border border-[#E2D9CC] rounded-sm text-[#201610] cursor-pointer hover:border-[#C8A46B]"
                >
                  <span>Collection: {collections.find((c) => c.slug === selectedCollection)?.name || selectedCollection}</span>
                  <X className="h-3 w-3 text-[#C8A46B]" />
                </button>
              )}

              {selectedRoom && (
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FCFAF6] border border-[#E2D9CC] rounded-sm text-[#201610] cursor-pointer hover:border-[#C8A46B]"
                >
                  <span>Room: {selectedRoom}</span>
                  <X className="h-3 w-3 text-[#C8A46B]" />
                </button>
              )}

              {selectedColor && (
                <button
                  type="button"
                  onClick={() => setSelectedColor(null)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FCFAF6] border border-[#E2D9CC] rounded-sm text-[#201610] cursor-pointer hover:border-[#C8A46B]"
                >
                  <span>Color: {selectedColor}</span>
                  <X className="h-3 w-3 text-[#C8A46B]" />
                </button>
              )}

              {maxPrice < 15000 && (
                <button
                  type="button"
                  onClick={() => setMaxPrice(15000)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FCFAF6] border border-[#E2D9CC] rounded-sm text-[#201610] cursor-pointer hover:border-[#C8A46B]"
                >
                  <span>Under ₹{maxPrice.toLocaleString('en-IN')}</span>
                  <X className="h-3 w-3 text-[#C8A46B]" />
                </button>
              )}

              {inStockOnly && (
                <button
                  type="button"
                  onClick={() => setInStockOnly(false)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FCFAF6] border border-[#E2D9CC] rounded-sm text-[#201610] cursor-pointer hover:border-[#C8A46B]"
                >
                  <span>In Stock Only</span>
                  <X className="h-3 w-3 text-[#C8A46B]" />
                </button>
              )}

              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[11px] uppercase tracking-wider text-[#6E6157] hover:text-[#201610] underline ml-2 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Toolbar: Filter toggle on mobile + Sorting dropdown */}
        <div className="flex items-center justify-between pb-6">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 bg-[#FCFAF6] border border-[#E2D9CC] rounded-sm text-xs font-medium text-[#201610] cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters ({hasActiveFilters ? 'Active' : 'All'})</span>
          </button>

          <div className="flex items-center gap-2 ml-auto text-xs">
            <span className="text-[#6E6157] uppercase tracking-wider text-[11px]">Sort By:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FCFAF6] border border-[#E2D9CC] rounded-sm px-3 py-1.5 text-xs text-[#201610] focus:outline-none focus:border-[#2A1E17] appearance-none pr-8 cursor-pointer"
              >
                <option value="featured">Featured Curations</option>
                <option value="newest">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 absolute right-2.5 top-2.5 pointer-events-none text-[#6E6157]" />
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <aside
            className={`lg:col-span-1 space-y-6 lg:block ${
              mobileFilterOpen ? 'block' : 'hidden'
            } bg-[#FCFAF6] lg:bg-transparent p-6 lg:p-0 rounded-xl lg:rounded-none border lg:border-none border-[#E2D9CC]`}
          >
            {/* Categories */}
            <div className="space-y-3 pb-5 border-b border-[#E2D9CC]">
              <h3 className="text-xs uppercase tracking-widest text-[#201610] font-semibold">
                Categories ({categories.length})
              </h3>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full flex items-center justify-between text-xs py-1 transition-colors cursor-pointer ${
                    selectedCategory === null
                      ? 'text-[#201610] font-semibold'
                      : 'text-[#483D35] hover:text-[#201610]'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="font-mono text-[11px] text-[#8C7D73]">{products.length}</span>
                </button>
                {categories.map((cat) => {
                  const catCount = cat.isLegacy
                    ? cat.itemCount
                    : products.filter(
                        (p) =>
                          p.categorySlug === cat.slug ||
                          p.category.toLowerCase() === cat.name.toLowerCase() ||
                          (p.categorySlug && cat.slug.includes(p.categorySlug)) ||
                          (p.tags && p.tags.some((t) => t.toLowerCase() === cat.slug.toLowerCase()))
                      ).length;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full flex items-center justify-between text-xs py-1 transition-colors cursor-pointer ${
                        selectedCategory === cat.slug
                          ? 'text-[#201610] font-semibold'
                          : 'text-[#483D35] hover:text-[#201610]'
                      }`}
                    >
                      <span className="truncate pr-2 text-left">{cat.name}</span>
                      <span className="font-mono text-[11px] text-[#8C7D73]">{catCount}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Curated Rooms */}
            <div className="space-y-3 pb-5 border-b border-[#E2D9CC]">
              <h3 className="text-xs uppercase tracking-widest text-[#201610] font-semibold">
                Room Setting
              </h3>
              <div className="space-y-1.5">
                {roomOptions.map((room) => (
                  <button
                    key={room}
                    type="button"
                    onClick={() => setSelectedRoom(selectedRoom === room ? null : room)}
                    className={`w-full flex items-center justify-between text-xs py-1 transition-colors cursor-pointer ${
                      selectedRoom === room
                        ? 'text-[#201610] font-semibold'
                        : 'text-[#483D35] hover:text-[#201610]'
                    }`}
                  >
                    <span>{room}</span>
                    {selectedRoom === room && <Check className="h-3.5 w-3.5 text-[#C8A46B]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 pb-5 border-b border-[#E2D9CC]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-widest text-[#201610] font-semibold">
                  Price Limit
                </h3>
                <span className="font-sans text-xs font-semibold text-[#201610] tabular-nums">
                  Up to ₹{maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="15000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#2A1E17] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6E6157] font-mono">
                <span>₹1,000</span>
                <span>₹15,000+</span>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3 pb-5 border-b border-[#E2D9CC]">
              <h3 className="text-xs uppercase tracking-widest text-[#201610] font-semibold">
                Color Tone
              </h3>
              <div className="space-y-2">
                {colorPalette.map((col) => (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(selectedColor === col.name ? null : col.name)}
                    className={`w-full flex items-center gap-2 text-xs py-1 transition-colors cursor-pointer ${
                      selectedColor === col.name ? 'font-semibold text-[#201610]' : 'text-[#483D35]'
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="flex-1 text-left">{col.name}</span>
                    {selectedColor === col.name && <Check className="h-3 w-3 text-[#C8A46B]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#201610]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded-xs border-[#E2D9CC] text-[#2A1E17] focus:ring-0"
                />
                <span>Show in-stock items only</span>
              </label>
            </div>
          </aside>

          {/* Product Cards Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] p-8 space-y-4">
                <p className="font-serif text-2xl text-[#201610]">No items match your selected filters</p>
                <p className="text-xs text-[#483D35] max-w-md mx-auto">
                  Try broadening your price range or clearing category filters to explore our full selection of artisanal decor.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-[#2A1E17] text-[#FAF6F0] hover:bg-[#3E2D22] text-xs uppercase tracking-wider font-semibold rounded-xs cursor-pointer shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
