import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    categories,
    setSelectedProductId,
    setSelectedCategory,
    setCurrentView,
  } = useShop();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const popularTerms = [
    'Ceramic Vase',
    'Table Lamp',
    'Belgian Linen',
    'Travertine Bowl',
    'Soy Candle',
    'Arch Mirror',
    'Plaster Art',
  ];

  const matchingProducts = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
        );
      })
    : [];

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    setCurrentView('product-detail');
    setIsSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentView('shop');
    setIsSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FAF6F0]/98 backdrop-blur-md animate-in fade-in duration-200">
      {/* Search Header */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-6 pb-4 border-b border-[#E2D9CC]">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 flex items-center">
            <Search className="h-6 w-6 text-[#6E6157] mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search vases, lighting, cushions, candles, wall art..."
              className="w-full bg-transparent font-serif text-xl sm:text-2xl text-[#201610] placeholder:text-[#8A7C70] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-[#6E6157] hover:text-[#201610] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE7DE] text-[#201610] hover:bg-[#E2D9CC] transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Popular searches bar */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 text-xs">
          <span className="text-[#6E6157] uppercase tracking-wider text-[10px] shrink-0 font-medium">
            Popular:
          </span>
          {popularTerms.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className="px-2.5 py-1 rounded-xs bg-[#EDE7DE] hover:bg-[#E2D9CC] text-[#201610] transition-colors shrink-0 cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Area */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 overflow-y-auto flex-1">
        {query.trim() === '' ? (
          <div className="space-y-8 pt-4">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#6E6157] font-semibold mb-4">
                Explore Top Categories
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.slice(0, 8).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.slug)}
                    className="p-3 bg-[#FCFAF6] rounded-lg border border-[#E2D9CC] text-left hover:border-[#C8A46B] transition-colors flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <div>
                      <span className="font-serif text-sm text-[#201610] block group-hover:text-[#C8A46B] transition-colors">
                        {cat.name}
                      </span>
                      <span className="text-[11px] text-[#6E6157] tabular-nums">
                        {cat.itemCount} pieces
                      </span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-[#8A7C70] group-hover:text-[#201610] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : matchingProducts.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-[#483D35]">
                Found <strong className="text-[#201610]">{matchingProducts.length}</strong> pieces for "{query}"
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {matchingProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleProductSelect(prod.id)}
                  className="flex gap-4 p-3 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] hover:border-[#C8A46B] cursor-pointer transition-all group shadow-2xs"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#EDE7DE] border border-[#E2D9CC]">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col justify-between min-w-0">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#6E6157] font-medium block">
                        {prod.category}
                      </span>
                      <h4 className="font-serif text-sm text-[#201610] group-hover:text-[#C8A46B] truncate font-medium transition-colors">
                        {prod.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs font-semibold text-[#201610] tabular-nums">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                      <div className="flex items-center gap-0.5 text-[10px] text-[#483D35]">
                        <Star className="h-3 w-3 fill-[#C8A46B] text-[#C8A46B]" />
                        <span>{prod.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 space-y-3">
            <p className="font-serif text-xl text-[#201610]">
              No pieces found matching "{query}"
            </p>
            <p className="text-xs text-[#483D35] max-w-sm mx-auto">
              Try searching for general terms like "ceramic", "lamp", "linen", "cushion", or browse our room inspirations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
