import React, { useState } from 'react';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Check,
  MapPin,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailView: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    showToast,
  } = useShop();

  // Find product
  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors?.[0]?.name
  );
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('400050');
  const [pincodeStatus, setPincodeStatus] = useState<{
    checked: boolean;
    valid: boolean;
    city?: string;
    deliveryDate?: string;
  }>({
    checked: true,
    valid: true,
    city: 'Mumbai',
    deliveryDate: 'Expected delivery by 18 Oct via Delhivery Express Air',
  });

  const [activeAccordion, setActiveAccordion] = useState<string>('dimensions');
  const [justAdded, setJustAdded] = useState(false);

  // Review Form state
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.categorySlug === product.categorySlug))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setPincodeStatus({ checked: true, valid: false });
      return;
    }

    const firstTwo = cleanPin.substring(0, 2);
    let city = 'Metro Region';
    if (['40', '41', '42'].includes(firstTwo)) city = 'Mumbai / Pune';
    else if (['11', '12', '20'].includes(firstTwo)) city = 'Delhi NCR';
    else if (['56', '57'].includes(firstTwo)) city = 'Bengaluru';
    else if (['60', '61'].includes(firstTwo)) city = 'Chennai';
    else if (['70', '71'].includes(firstTwo)) city = 'Kolkata';
    else if (['50', '51'].includes(firstTwo)) city = 'Hyderabad';

    // Calculate delivery date (3-4 days ahead)
    const today = new Date();
    const estDate = new Date(today);
    estDate.setDate(today.getDate() + 3);
    const dateStr = estDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

    setPincodeStatus({
      checked: true,
      valid: true,
      city,
      deliveryDate: `Expected delivery to ${city} by ${dateStr} via Delhivery Air`,
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: reviewName,
          userLocation: reviewLocation,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });
    } catch {
      // fallback
    }
    setSubmittingReview(false);
    setIsReviewFormOpen(false);
    showToast('Thank you for sharing your review with Cloudberry Home!');
    setReviewName('');
    setReviewComment('');
    setReviewTitle('');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-[#6E6157] mb-8 font-light">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="hover:text-[#201610] transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="h-3 w-3 text-[#8C7D73]" />
          <button
            type="button"
            onClick={() => setCurrentView('shop')}
            className="hover:text-[#201610] transition-colors cursor-pointer"
          >
            Shop
          </button>
          <ChevronRight className="h-3 w-3 text-[#8C7D73]" />
          <span className="text-[#483D35]">{product.category}</span>
          <ChevronRight className="h-3 w-3 text-[#8C7D73]" />
          <span className="text-[#201610] font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* 2-Column Contiguous Purchase Layout with Balanced Alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Left: Gallery Column on Pure Warm White Backdrop */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Main Stage Image with Soft Natural Lighting & Subtle Shadows */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#FCFAF6] border border-[#E2D9CC] shadow-sm group">
              <img
                key={activeImageIndex}
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-106 will-change-transform animate-in fade-in duration-300"
              />

              {/* Warm Soft Ambient Light Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-amber-100/10 pointer-events-none mix-blend-soft-light" />

              {/* Discount Badge */}
              {product.discountPercent && product.discountPercent > 0 && (
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <span className="bg-[#2A1E17] text-[#FAF6F0] text-xs font-medium tracking-wider uppercase px-3 py-1.5 rounded-xs shadow-xs border border-[#3D2C22]">
                    {product.discountPercent}% OFF
                  </span>
                </div>
              )}

              {/* Wishlist Toggle Button with Heart Bounce */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#FCFAF6]/90 backdrop-blur-md shadow-sm border border-[#E2D9CC] transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
                  isFavorited ? 'text-[#C8A46B] border-[#C8A46B]' : 'text-[#483D35] hover:text-[#201610]'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`h-5 w-5 transition-transform duration-300 ${isFavorited ? 'fill-[#C8A46B] animate-heart-bounce' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Strip with Balanced Spacing & Active Elevation */}
            {product.images.length > 1 && (
              <div className="mt-4 sm:mt-5 flex items-center gap-3 sm:gap-3.5 overflow-x-auto pb-2 scrollbar-thin">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-20 w-20 sm:h-22 sm:w-22 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer bg-[#FCFAF6] ${
                      activeImageIndex === idx
                        ? 'border-[#2A1E17] shadow-md ring-2 ring-[#C8A46B]/60 ring-offset-2 ring-offset-[#FAF6F0] scale-102'
                        : 'border-transparent opacity-75 hover:opacity-100 hover:border-[#E2D9CC] hover:scale-102'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover transition-transform duration-300 hover:scale-108" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Contiguous Purchase Module in Pure Warm White */}
          <div className="lg:col-span-5 flex flex-col space-y-6 sm:space-y-7 bg-[#FCFAF6] p-6 sm:p-8 lg:p-9 rounded-2xl border border-[#E2D9CC] shadow-sm">
            {/* Category, Title & Rating Header */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.24em] font-medium text-[#6E6157]">
                {product.category}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] text-[#201610] font-normal leading-[1.2]">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2.5 pt-1 text-xs text-[#6E6157]">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-[#C8A46B] text-[#C8A46B]'
                          : 'text-[#E2D9CC]'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono text-xs font-semibold text-[#201610] tabular-nums">
                  {product.rating.toFixed(1)}
                </span>
                <span>·</span>
                <span>{product.reviewCount} verified collector reviews</span>
              </div>
            </div>

            {/* Price Block with Consistent Padding */}
            <div className="p-4 sm:p-4.5 bg-[#F5F0E6] rounded-xl border border-[#E2D9CC] flex flex-wrap items-baseline justify-between gap-2 shadow-2xs">
              <div className="flex items-baseline gap-3">
                <span className="font-sans text-2xl sm:text-[26px] font-semibold text-[#201610] tabular-nums">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="font-sans text-sm text-[#8C7D73] line-through tabular-nums">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="text-xs font-medium text-[#201610] bg-[#EDE7DE] px-2 py-0.5 rounded-xs border border-[#E2D9CC]">
                    Save {product.discountPercent}%
                  </span>
                )}
              </div>

              <span className="text-xs text-[#6E6157]">Inclusive of all taxes</span>
            </div>

            {/* Product Description */}
            <p className="font-sans text-sm sm:text-[14.5px] text-[#483D35] font-light leading-relaxed">
              {product.description}
            </p>

            {/* Color Swatches with Balanced Margins */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#201610]">
                    Color Tone:{' '}
                    <strong className="font-semibold text-[#C8A46B]">
                      {selectedColor || product.colors[0].name}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full border-2 p-0.5 transition-all duration-200 cursor-pointer ${
                        (selectedColor || product.colors![0].name) === c.name
                          ? 'border-[#2A1E17] scale-110 shadow-sm ring-2 ring-[#C8A46B]/50 ring-offset-2 ring-offset-[#FAF6F0]'
                          : 'border-transparent hover:scale-105'
                      }`}
                      title={c.name}
                    >
                      <span
                        className="block h-full w-full rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Stock Status */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-[#E2D9CC]">
              <div className="flex items-center gap-3.5">
                <span className="text-xs font-medium text-[#201610]">Quantity:</span>
                <div className="flex items-center border border-[#E2D9CC] rounded-md bg-[#FAF6F0] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-sm text-[#201610] hover:bg-[#EDE7DE] transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono text-xs font-medium tabular-nums text-[#201610]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="w-9 h-9 flex items-center justify-center text-sm text-[#201610] hover:bg-[#EDE7DE] transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <span className="text-xs text-[#6D7E69] font-medium flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#6D7E69]" />
                {product.stockCount > 0 ? `In Stock (${product.stockCount} units available)` : 'Sold Out'}
              </span>
            </div>

            {/* Purchase Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex items-center justify-center gap-2 py-3.5 sm:py-4 px-6 text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 rounded-xs shadow-sm cursor-pointer ${
                  justAdded
                    ? 'bg-[#6D7E69] text-white'
                    : product.inStock
                    ? 'bg-[#2A1E17] text-[#FAF6F0] hover:bg-[#3D2C22] hover:-translate-y-0.5 hover:shadow-lg'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Added to Bag</span>
                  </>
                ) : product.inStock ? (
                  <>
                    <ShoppingBag className="h-4 w-4 text-[#C8A46B]" />
                    <span>Add to Bag</span>
                  </>
                ) : (
                  'Sold Out'
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex items-center justify-center py-3.5 sm:py-4 px-6 border border-[#2A1E17] bg-[#FAF6F0] text-xs uppercase tracking-[0.16em] font-semibold text-[#201610] hover:bg-[#2A1E17] hover:text-[#FAF6F0] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 rounded-xs shadow-2xs cursor-pointer"
              >
                Buy Now
              </button>
            </div>

            {/* Indian Pincode Delivery Estimator */}
            <div className="p-4 sm:p-4.5 bg-[#FAF6F0] rounded-xl border border-[#E2D9CC] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-medium text-[#201610]">
                <MapPin className="h-4 w-4 text-[#C8A46B]" />
                <span>Delivery Estimator across India</span>
              </div>

              <form onSubmit={checkPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit PIN (e.g. 400050)"
                  className="flex-1 px-3 py-1.5 text-xs bg-[#FCFAF6] border border-[#E2D9CC] rounded-xs focus:border-[#2A1E17] focus:outline-none font-mono text-[#201610]"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2A1E17] text-[#FAF6F0] text-xs font-medium uppercase tracking-wider rounded-xs hover:bg-[#3D2C22] cursor-pointer"
                >
                  Check
                </button>
              </form>

              {pincodeStatus.checked && (
                <div className="text-xs pt-1">
                  {pincodeStatus.valid ? (
                    <div className="space-y-1">
                      <p className="text-[#6D7E69] flex items-center gap-1.5 font-medium">
                        <Check className="h-3.5 w-3.5" />
                        {pincodeStatus.deliveryDate}
                      </p>
                      <p className="text-[11px] text-[#6E6157]">
                        Complimentary delivery for orders over ₹1,999 · Cash on Delivery available
                      </p>
                    </div>
                  ) : (
                    <p className="text-red-600 text-[11px]">
                      Please enter a valid 6-digit Indian PIN code.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E2D9CC] text-center text-xs text-[#483D35]">
              <div className="flex flex-col items-center gap-1 p-2">
                <Truck className="h-4 w-4 text-[#C8A46B]" />
                <span className="text-[11px] font-medium text-[#201610]">Insured Transit</span>
                <span className="text-[10px] text-[#6E6157]">Zero Breakage Guarantee</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2">
                <RotateCcw className="h-4 w-4 text-[#C8A46B]" />
                <span className="text-[11px] font-medium text-[#201610]">7-Day Returns</span>
                <span className="text-[10px] text-[#6E6157]">Hassle-free doorstep pickup</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2">
                <ShieldCheck className="h-4 w-4 text-[#C8A46B]" />
                <span className="text-[11px] font-medium text-[#201610]">Artisan Authentic</span>
                <span className="text-[10px] text-[#6E6157]">Pure Noble Materials</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-2 pt-4 border-t border-[#E2D9CC]">
              {/* Accordion 1: Dimensions */}
              <div className="border border-[#E2D9CC] rounded-xs bg-[#FCFAF6] overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setActiveAccordion(activeAccordion === 'dimensions' ? '' : 'dimensions')
                  }
                  className="w-full flex items-center justify-between p-3.5 text-xs font-medium uppercase tracking-wider text-[#201610] cursor-pointer"
                >
                  <span>Dimensions & Specifications</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#8C7D73] transition-transform ${
                      activeAccordion === 'dimensions' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'dimensions' && (
                  <div className="p-4 pt-0 text-xs text-[#483D35] space-y-2 border-t border-[#E2D9CC] bg-[#FAF6F0] font-light">
                    <div className="flex justify-between py-1 border-b border-[#E2D9CC]">
                      <span className="text-[#6E6157]">Dimensions:</span>
                      <span className="font-mono text-[#201610]">{product.details.dimensions}</span>
                    </div>
                    {product.details.weight && (
                      <div className="flex justify-between py-1 border-b border-[#E2D9CC]">
                        <span className="text-[#6E6157]">Weight:</span>
                        <span className="font-mono text-[#201610]">{product.details.weight}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1">
                      <span className="text-[#6E6157]">Origin:</span>
                      <span className="text-[#201610] font-medium">{product.details.origin}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Materials & Craft */}
              <div className="border border-[#E2D9CC] rounded-xs bg-[#FCFAF6] overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setActiveAccordion(activeAccordion === 'materials' ? '' : 'materials')
                  }
                  className="w-full flex items-center justify-between p-3.5 text-xs font-medium uppercase tracking-wider text-[#201610] cursor-pointer"
                >
                  <span>Material & Finish</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#8C7D73] transition-transform ${
                      activeAccordion === 'materials' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'materials' && (
                  <div className="p-4 pt-0 text-xs text-[#483D35] space-y-2 border-t border-[#E2D9CC] bg-[#FAF6F0] font-light">
                    <p>
                      <strong className="text-[#201610]">Material Composition:</strong> {product.details.material}
                    </p>
                    <p>
                      <strong className="text-[#201610]">Artisanal Finish:</strong> {product.details.finish}
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Care Instructions */}
              <div className="border border-[#E2D9CC] rounded-xs bg-[#FCFAF6] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'care' ? '' : 'care')}
                  className="w-full flex items-center justify-between p-3.5 text-xs font-medium uppercase tracking-wider text-[#201610] cursor-pointer"
                >
                  <span>Care & Maintenance</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#8C7D73] transition-transform ${
                      activeAccordion === 'care' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'care' && (
                  <div className="p-4 pt-0 text-xs text-[#483D35] border-t border-[#E2D9CC] bg-[#FAF6F0] font-light leading-relaxed">
                    {product.details.care}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-20 pt-12 border-t border-[#E2D9CC]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#6E6157] font-semibold">
                Customer Voices
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#201610]">
                Collector Reviews ({product.reviewCount})
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
              className="mt-4 md:mt-0 px-5 py-2.5 bg-[#FCFAF6] border border-[#2A1E17] text-xs uppercase tracking-wider font-semibold text-[#201610] hover:bg-[#2A1E17] hover:text-[#FAF6F0] transition-colors rounded-xs cursor-pointer shadow-2xs"
            >
              {isReviewFormOpen ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* Review Submission Form */}
          {isReviewFormOpen && (
            <form
              onSubmit={handleReviewSubmit}
              className="mb-10 p-6 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] max-w-2xl space-y-4 animate-in slide-in-from-top-4 shadow-sm"
            >
              <h3 className="font-serif text-lg text-[#201610]">Share Your Experience</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#201610]">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Natasha Kapoor"
                    className="w-full px-3 py-2 text-xs bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs focus:border-[#2A1E17] focus:outline-none text-[#201610]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#201610]">City / State</label>
                  <input
                    type="text"
                    required
                    value={reviewLocation}
                    onChange={(e) => setReviewLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="w-full px-3 py-2 text-xs bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs focus:border-[#2A1E17] focus:outline-none text-[#201610]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#201610]">Rating (1-5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= reviewRating
                            ? 'fill-[#C8A46B] text-[#C8A46B]'
                            : 'text-[#E2D9CC]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-[#6E6157] ml-2">{reviewRating} of 5 Stars</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#201610]">Review Headline</label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Sublime craftsmanship and gorgeous glaze"
                  className="w-full px-3 py-2 text-xs bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs focus:border-[#2A1E17] focus:outline-none text-[#201610]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#201610]">Your Review</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How does this piece look in your home? Note the texture, lighting, and packaging..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs focus:border-[#2A1E17] focus:outline-none text-[#201610]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2.5 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#3D2C22] transition-colors cursor-pointer shadow-xs"
              >
                {submittingReview ? 'Submitting...' : 'Post Verified Review'}
              </button>
            </form>
          )}

          {/* Sample Verified Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#C8A46B] text-[#C8A46B]" />
                    ))}
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-[#201610] mt-1">
                    Transformed our living room vignette completely
                  </h4>
                </div>
                <span className="text-[10px] text-[#6D7E69] bg-[#6D7E69]/15 px-2 py-0.5 rounded-xs font-medium">
                  Verified Collector
                </span>
              </div>
              <p className="text-xs text-[#483D35] font-light leading-relaxed">
                "The weight and tactile stoneware feel are magnificent. Arrived in eco-friendly honeycomb paper with zero plastic. Exceeded expectations in every dimension."
              </p>
              <div className="text-[11px] text-[#6E6157] border-t border-[#E2D9CC] pt-2 flex justify-between">
                <span>Pooja Singhania · Mumbai</span>
                <span>2 weeks ago</span>
              </div>
            </div>

            <div className="p-6 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#C8A46B] text-[#C8A46B]" />
                    ))}
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-[#201610] mt-1">
                    Quiet luxury at an honest price
                  </h4>
                </div>
                <span className="text-[10px] text-[#6D7E69] bg-[#6D7E69]/15 px-2 py-0.5 rounded-xs font-medium">
                  Verified Collector
                </span>
              </div>
              <p className="text-xs text-[#483D35] font-light leading-relaxed">
                "Finding refined home decor without loud logos in India used to be difficult. Cloudberry Home is exactly what Indian homes have needed."
              </p>
              <div className="text-[11px] text-[#6E6157] border-t border-[#E2D9CC] pt-2 flex justify-between">
                <span>Arjun Sundaram · Bengaluru</span>
                <span>1 month ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#E2D9CC]">
            <div className="space-y-1 mb-8">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#6E6157] font-semibold">
                Harmonious Pairings
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#201610]">
                Complete The Aesthetic
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
