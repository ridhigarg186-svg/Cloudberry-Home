import React, { useState } from 'react';
import { X, ShoppingBag, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

export const ShopThisLookModal: React.FC = () => {
  const {
    shopLookRoom,
    setShopLookRoom,
    products,
    addToCart,
    setSelectedProductId,
    setCurrentView,
    showToast,
  } = useShop();

  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  if (!shopLookRoom) return null;

  // Find the products for this room
  const roomProducts: Product[] = shopLookRoom.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  const handleAddSingle = (prod: Product) => {
    addToCart(prod, 1);
    setAddedItems((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [prod.id]: false }));
    }, 1600);
  };

  const handleAddAll = () => {
    roomProducts.forEach((prod) => {
      if (prod.inStock) {
        addToCart(prod, 1);
      }
    });
    showToast(`Added all available pieces from ${shopLookRoom.title} to your bag!`);
    setShopLookRoom(null);
  };

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
    setShopLookRoom(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const lookTotalPrice = roomProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-[#FCFAF6] shadow-2xl border border-[#E2D9CC] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 md:px-8 border-b border-[#E2D9CC] flex items-center justify-between bg-[#F5F0E6]">
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-[#C8A46B]" />
            <div>
              <span className="text-[10px] tracking-widest uppercase text-[#6E6157] font-medium">
                Shop The Vignette · {shopLookRoom.roomType}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl text-[#201610]">
                {shopLookRoom.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShopLookRoom(null)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE7DE] text-[#201610] hover:bg-[#E2D9CC] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 md:p-8 space-y-8 flex-1 bg-[#FCFAF6]">
          {/* Top Banner: Image & Tips */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 aspect-[16/9] rounded-lg overflow-hidden bg-[#EDE7DE] border border-[#E2D9CC] shadow-sm">
              <img
                src={shopLookRoom.image}
                alt={shopLookRoom.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="md:col-span-5 space-y-4">
              <p className="text-xs sm:text-sm text-[#483D35] leading-relaxed font-light">
                {shopLookRoom.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-[#E2D9CC]">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#201610] block">
                  Stylist Notes:
                </span>
                <ul className="space-y-1.5 text-xs text-[#483D35]">
                  {shopLookRoom.stylingTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C8A46B] mt-1.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Styled Items List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2D9CC] pb-3">
              <h3 className="font-serif text-lg text-[#201610]">
                Featured Pieces in this Room ({roomProducts.length})
              </h3>
              <div className="text-xs text-[#6E6157]">
                Bundle Total:{' '}
                <strong className="text-sm font-sans font-semibold text-[#201610] tabular-nums">
                  ₹{lookTotalPrice.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roomProducts.map((prod) => {
                const isItemAdded = addedItems[prod.id];
                return (
                  <div
                    key={prod.id}
                    className="flex gap-4 p-3 bg-[#FAF6F0] rounded-xl border border-[#E2D9CC] hover:border-[#C8A46B]/80 transition-all shadow-2xs"
                  >
                    <div
                      onClick={() => handleProductClick(prod.id)}
                      className="h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg bg-[#EDE7DE] border border-[#E2D9CC]"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#6E6157] font-medium block">
                          {prod.category}
                        </span>
                        <h4
                          onClick={() => handleProductClick(prod.id)}
                          className="font-serif text-sm font-normal text-[#201610] hover:text-[#C8A46B] cursor-pointer truncate"
                        >
                          {prod.name}
                        </h4>
                        <div className="font-sans text-xs font-semibold text-[#201610] tabular-nums mt-0.5">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleProductClick(prod.id)}
                          className="text-[11px] text-[#6E6157] hover:text-[#201610] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Details</span>
                          <ArrowRight className="h-2.5 w-2.5 text-[#C8A46B]" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddSingle(prod)}
                          disabled={!prod.inStock}
                          className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold rounded-xs transition-colors shadow-xs cursor-pointer ${
                            isItemAdded
                              ? 'bg-[#6D7E69] text-white'
                              : prod.inStock
                              ? 'bg-[#2A1E17] text-[#FAF6F0] hover:bg-[#3D2C22]'
                              : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          {isItemAdded ? (
                            <span className="flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              Added
                            </span>
                          ) : prod.inStock ? (
                            <span className="flex items-center gap-1">
                              <ShoppingBag className="h-3 w-3 text-[#C8A46B]" />
                              Add
                            </span>
                          ) : (
                            'Sold Out'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with "Add All to Bag" */}
        <div className="p-4 sm:px-8 border-t border-[#E2D9CC] bg-[#F5F0E6] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#483D35] text-center sm:text-left">
            <span>Includes all {roomProducts.length} handcrafted pieces for this complete look.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShopLookRoom(null)}
              className="flex-1 sm:flex-none px-5 py-2.5 border border-[#E2D9CC] text-xs uppercase tracking-wider text-[#201610] hover:bg-[#EDE7DE] rounded-xs transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleAddAll}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#3D2C22] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 shadow-sm cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#C8A46B]" />
              <span>Add Entire Look to Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
