import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
  aspectRatio?: 'square' | 'portrait';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  aspectRatio = 'portrait',
}) => {
  const {
    setSelectedProductId,
    setCurrentView,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    showToast,
  } = useShop();

  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const hasSecondaryImage = product.images.length > 1;

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    showToast(`Added "${product.name}" to your shopping bag.`);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 600);
    if (!isFavorited) {
      showToast(`Saved "${product.name}" to your wishlist.`);
    }
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col cursor-pointer bg-[#FCFAF6] p-2.5 sm:p-3 rounded-xl border border-[#E2D9CC] shadow-2xs hover:border-[#C8A46B]/80 hover:-translate-y-1.5 hover:shadow-[0_18px_36px_-10px_rgba(32,22,16,0.12)] transition-all duration-400 ease-out will-change-transform"
    >
      {/* Image Stage Container with Smooth Crossfade & Zoom */}
      <div
        className={`relative w-full overflow-hidden rounded-lg bg-[#FCFAF6] ${
          aspectRatio === 'square' ? 'aspect-square' : 'aspect-[4/5]'
        }`}
      >
        {!imageError ? (
          <div className="relative w-full h-full overflow-hidden">
            {/* Primary Image */}
            <img
              src={product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-108 will-change-transform ${
                hasSecondaryImage ? 'opacity-100 group-hover:opacity-0' : ''
              }`}
              loading="lazy"
            />
            {/* Secondary Image Crossfade on Hover if Available */}
            {hasSecondaryImage && (
              <img
                src={product.images[1]}
                alt={`${product.name} detail view`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-108 will-change-transform"
                loading="lazy"
              />
            )}
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#F5F0E6] to-[#EDE7DE] p-4 text-center">
            <span className="font-serif text-lg text-[#201610]">{product.name}</span>
            <span className="text-xs text-[#6E6157] mt-1">{product.category}</span>
          </div>
        )}

        {/* Badges - clean luxury tag style */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="bg-[#2A1E17] text-[#FAF6F0] text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-xs shadow-xs">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && !product.discountPercent && (
            <span className="bg-[#8A9A86] text-white text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-xs shadow-xs">
              NEW
            </span>
          )}
          {product.stockCount > 0 && product.stockCount <= 5 && (
            <span className="bg-[#C8A46B] text-white text-[9.5px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-xs shadow-xs">
              Only {product.stockCount} left
            </span>
          )}
        </div>

        {/* Wishlist Button with Heart Pop feedback */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 z-10 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-[#FCFAF6]/90 backdrop-blur-sm border border-[#E2D9CC] transition-all duration-200 hover:scale-110 active:scale-95 shadow-xs cursor-pointer ${
            isFavorited ? 'text-[#C8A46B] border-[#C8A46B]' : 'text-[#483D35] hover:text-[#C8A46B]'
          }`}
        >
          <Heart
            className={`h-4 w-4 transition-transform duration-300 ${
              isFavorited ? 'fill-[#C8A46B]' : ''
            } ${heartAnim ? 'animate-heart-bounce' : ''}`}
          />
        </button>

        {/* Hover Quick Action Bar: Smooth Slide-up & Reveal */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-10 flex items-center gap-1.5 opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] font-medium tracking-wider uppercase transition-all duration-200 shadow-md rounded-xs cursor-pointer ${
              justAdded
                ? 'bg-[#6D7E69] text-white'
                : product.inStock
                ? 'bg-[#2A1E17] text-[#FAF6F0] hover:bg-[#3D2C22] hover:-translate-y-0.5'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added</span>
              </>
            ) : product.inStock ? (
              <>
                <ShoppingBag className="h-3.5 w-3.5 text-[#C8A46B]" />
                <span>Add to Bag</span>
              </>
            ) : (
              'Sold Out'
            )}
          </button>

          {/* Quick Preview Button */}
          <button
            type="button"
            onClick={handleQuickViewClick}
            aria-label="Quick preview"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-xs bg-[#FCFAF6] text-[#201610] border border-[#E2D9CC] shadow-md hover:bg-[#EDE7DE] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            title="Quick preview"
          >
            <Eye className="h-4 w-4" />
          </button>

          {/* View Details Icon */}
          <button
            type="button"
            onClick={handleCardClick}
            aria-label="View product page"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-xs bg-[#FCFAF6] text-[#201610] border border-[#E2D9CC] shadow-md hover:bg-[#EDE7DE] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer hidden sm:flex"
            title="View details"
          >
            <ArrowUpRight className="h-4 w-4 text-[#C8A46B]" />
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="mt-3 flex flex-col space-y-1">
        <div className="flex items-center justify-between text-xs text-[#6E6157]">
          <span className="uppercase tracking-widest text-[10px] font-medium transition-colors group-hover:text-[#201610]">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-[#C8A46B] text-[#C8A46B] transition-transform duration-300 group-hover:scale-110" />
            <span className="font-mono text-[11px] text-[#201610] font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-[#8A9A86] text-[10px]">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="font-serif text-base font-normal text-[#201610] group-hover:text-[#3E2D22] transition-colors duration-200 line-clamp-1">
          {product.name}
        </h3>

        {/* Pricing with smooth typographic hierarchy */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-sans text-sm font-semibold text-[#201610] tabular-nums group-hover:text-[#2A1E17] transition-colors">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="font-sans text-xs text-[#8C7D73] line-through tabular-nums">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Color swatches preview with gentle hover pop */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.slice(0, 3).map((col, idx) => (
              <span
                key={idx}
                className="h-2.5 w-2.5 rounded-full border border-black/10 transition-transform duration-200 hover:scale-125"
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-[#6E6157]">+{product.colors.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
