import React, { useState } from 'react';
import { X, ShoppingBag, Star, Check, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    setSelectedProductId,
    setCurrentView,
  } = useShop();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    quickViewProduct?.colors?.[0]?.name
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!quickViewProduct) return null;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleGoToProduct = () => {
    setSelectedProductId(quickViewProduct.id);
    setCurrentView('product-detail');
    setQuickViewProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-xl bg-[#FCFAF6] shadow-2xl border border-[#E2D9CC] max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#FCFAF6]/90 text-[#201610] hover:bg-[#EDE7DE] shadow-sm border border-[#E2D9CC] cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Product Media Column on Soft Greige */}
        <div className="w-full md:w-1/2 bg-[#EDE7DE] p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E2D9CC]">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#FCFAF6] border border-[#E2D9CC] group">
            <img
              key={selectedImageIndex}
              src={quickViewProduct.images[selectedImageIndex] || quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106 animate-in fade-in duration-250"
            />
          </div>

          {/* Thumbnails */}
          {quickViewProduct.images.length > 1 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
              {quickViewProduct.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImageIndex(i)}
                  className={`h-14 w-14 shrink-0 rounded-xs overflow-hidden border-2 transition-colors cursor-pointer bg-[#FCFAF6] ${
                    selectedImageIndex === i ? 'border-[#2A1E17]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-[#FCFAF6]">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#6E6157] font-medium">
                {quickViewProduct.category}
              </span>
              <h2 className="font-serif text-2xl font-normal text-[#201610] mt-1">
                {quickViewProduct.name}
              </h2>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(quickViewProduct.rating)
                          ? 'fill-[#C8A46B] text-[#C8A46B]'
                          : 'text-[#E2D9CC]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono text-[#201610] tabular-nums">
                  {quickViewProduct.rating.toFixed(1)}
                </span>
                <span className="text-xs text-[#6E6157]">
                  ({quickViewProduct.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-sans text-xl font-semibold text-[#201610] tabular-nums">
                ₹{quickViewProduct.price.toLocaleString('en-IN')}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="font-sans text-sm text-[#8C7D73] line-through tabular-nums">
                  ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {quickViewProduct.discountPercent && (
                <span className="text-xs font-medium text-[#201610] bg-[#EDE7DE] border border-[#E2D9CC] px-2 py-0.5 rounded-xs">
                  Save {quickViewProduct.discountPercent}%
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#483D35] font-light leading-relaxed">
              {quickViewProduct.shortDescription}
            </p>

            {/* Color Swatches */}
            {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-medium text-[#201610]">
                  Color: <span className="text-[#C8A46B] font-normal">{selectedColor || quickViewProduct.colors[0].name}</span>
                </label>
                <div className="flex items-center gap-2">
                  {quickViewProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`h-7 w-7 rounded-full border p-0.5 transition-transform cursor-pointer ${
                        (selectedColor || quickViewProduct.colors![0].name) === c.name
                          ? 'border-[#2A1E17] scale-110 shadow-xs'
                          : 'border-transparent hover:scale-105'
                      }`}
                      title={c.name}
                    >
                      <span
                        className="block h-full w-full rounded-full border border-black/10"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-medium text-[#201610]">Quantity</label>
              <div className="flex items-center border border-[#E2D9CC] rounded-xs w-28 bg-[#FAF6F0]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-8 flex items-center justify-center text-[#201610] hover:bg-[#EDE7DE] cursor-pointer"
                >
                  -
                </button>
                <span className="flex-1 text-center font-mono text-xs tabular-nums text-[#201610]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(quickViewProduct.stockCount, quantity + 1))}
                  className="w-9 h-8 flex items-center justify-center text-[#201610] hover:bg-[#EDE7DE] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-6 border-t border-[#E2D9CC] mt-4">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!quickViewProduct.inStock}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-widest font-semibold transition-all duration-300 rounded-xs shadow-sm cursor-pointer ${
                added
                  ? 'bg-[#6D7E69] text-white'
                  : quickViewProduct.inStock
                  ? 'bg-[#2A1E17] text-[#FAF6F0] hover:bg-[#3D2C22] hover:-translate-y-0.5 hover:shadow-md'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" />
                  Added to Shopping Bag
                </>
              ) : quickViewProduct.inStock ? (
                <>
                  <ShoppingBag className="h-4 w-4 text-[#C8A46B]" />
                  Add to Shopping Bag
                </>
              ) : (
                'Sold Out'
              )}
            </button>

            <button
              type="button"
              onClick={handleGoToProduct}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs uppercase tracking-wider text-[#6E6157] hover:text-[#201610] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
            >
              <span>View Full Details & Specifications</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#C8A46B] transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
