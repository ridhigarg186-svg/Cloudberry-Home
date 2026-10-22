import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Trash2, Tag, Check, Truck, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartView: React.FC = () => {
  const {
    cart,
    products,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    appliedCoupon,
    discountAmount,
    applyCouponCode,
    removeCoupon,
    setCurrentView,
  } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [giftNote, setGiftNote] = useState('');
  const [isGiftNoteOpen, setIsGiftNoteOpen] = useState(false);

  const FREE_SHIPPING_THRESHOLD = 1999;
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : 150;
  const totalAmount = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    applyCouponCode(couponCode);
    setCouponCode('');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-[#E2D9CC] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#6E6157] font-semibold block mb-1">
              Your Selection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#201610]">
              Shopping Bag
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('shop')}
            className="text-xs uppercase tracking-wider text-[#6E6157] hover:text-[#201610] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-24 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] p-8 space-y-4 max-w-xl mx-auto shadow-sm">
            <div className="h-16 w-16 rounded-full bg-[#EDE7DE] flex items-center justify-center text-[#201610] mx-auto border border-[#E2D9CC]">
              <ShoppingBag className="h-7 w-7 text-[#C8A46B]" />
            </div>
            <h2 className="font-serif text-2xl text-[#201610]">Your Shopping Bag is Empty</h2>
            <p className="text-xs text-[#483D35]">
              Your home sanctuary awaits. Browse our curated stoneware vases, alabaster lamps, and Belgian linen cushions.
            </p>
            <button
              type="button"
              onClick={() => setCurrentView('shop')}
              className="mt-4 px-8 py-3 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#3D2C22] transition-colors cursor-pointer shadow-sm"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Cart Items Table */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Banner */}
              <div className="p-4 bg-[#F2ECE1] rounded-xl border border-[#E2D9CC] flex items-center gap-3 text-xs text-[#201610]">
                <Truck className="h-5 w-5 text-[#6D7E69] shrink-0" />
                {isFreeShipping ? (
                  <span>
                    Congratulations! Your order qualifies for <strong>Complimentary Express Pan-India Delivery</strong>.
                  </span>
                ) : (
                  <span>
                    Add <strong>₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> more of curated decor to unlock complimentary express delivery.
                  </span>
                )}
              </div>

              {/* Items Card List in Pure Warm White */}
              <div className="bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] divide-y divide-[#E2D9CC] shadow-2xs">
                {cart.map((item) => {
                  const product = item.product || products.find((p) => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <div
                      key={`${item.productId}-${item.selectedColor || 'default'}`}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                    >
                      <div className="flex gap-4 items-center flex-1 min-w-0">
                        <div className="h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-[#EDE7DE] border border-[#E2D9CC]">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-[#6E6157] font-medium block">
                            {product.category}
                          </span>
                          <h3 className="font-serif text-base text-[#201610] truncate">
                            {product.name}
                          </h3>
                          {item.selectedColor && (
                            <span className="text-xs text-[#6E6157] block">
                              Color: {item.selectedColor}
                            </span>
                          )}
                          <span className="font-sans text-xs font-semibold text-[#201610] tabular-nums block">
                            ₹{product.price.toLocaleString('en-IN')} each
                          </span>
                        </div>
                      </div>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E2D9CC]">
                        <div className="flex items-center border border-[#E2D9CC] rounded-xs bg-[#FAF6F0]">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity - 1, item.selectedColor)
                            }
                            className="w-8 h-8 flex items-center justify-center text-sm text-[#201610] hover:bg-[#EDE7DE] cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-9 text-center font-mono text-xs tabular-nums text-[#201610]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity + 1, item.selectedColor)
                            }
                            className="w-8 h-8 flex items-center justify-center text-sm text-[#201610] hover:bg-[#EDE7DE] cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-sans text-sm font-semibold text-[#201610] tabular-nums block">
                            ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId, item.selectedColor)}
                            className="text-[11px] text-[#8C7D73] hover:text-red-700 transition-colors mt-0.5 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gift Note Option */}
              <div className="p-5 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] space-y-3 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setIsGiftNoteOpen(!isGiftNoteOpen)}
                  className="flex items-center justify-between w-full text-xs uppercase tracking-wider font-semibold text-[#201610] cursor-pointer"
                >
                  <span>Complimentary Handwritten Gift Note</span>
                  <span className="text-[#C8A46B] text-xs font-normal">
                    {isGiftNoteOpen ? 'Hide' : '+ Add Note'}
                  </span>
                </button>
                {isGiftNoteOpen && (
                  <div className="pt-2 animate-in fade-in">
                    <textarea
                      rows={3}
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder="Write your personal message to accompany this bespoke package on handwritten cotton paper..."
                      className="w-full p-3 text-xs bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs focus:border-[#2A1E17] focus:outline-none text-[#201610]"
                    />
                    <p className="text-[10px] text-[#6E6157] mt-1">
                      Enclosed in an ivory wax-sealed envelope with natural sprig of lavender.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 bg-[#FCFAF6] p-6 rounded-xl border border-[#E2D9CC] shadow-sm space-y-6">
                <h2 className="font-serif text-xl font-normal text-[#201610] pb-3 border-b border-[#E2D9CC]">
                  Order Summary
                </h2>

                {/* Coupon Box */}
                <div>
                  <span className="text-xs font-medium text-[#201610] block mb-1.5">
                    Promotional Code
                  </span>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 bg-[#6D7E69]/15 border border-[#6D7E69]/30 rounded-xs text-xs">
                      <div className="flex items-center gap-1.5 text-[#201610]">
                        <Check className="h-3.5 w-3.5 text-[#6D7E69]" />
                        <span>Code <strong>{appliedCoupon.code}</strong> applied</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-red-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#8C7D73]" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="CLOUDBERRY10"
                          className="w-full pl-8 pr-2 py-2 text-xs bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs uppercase focus:border-[#2A1E17] focus:outline-none text-[#201610]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#EDE7DE] hover:bg-[#E2D9CC] text-[#201610] text-xs font-medium uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {/* Suggest coupon chips */}
                  {!appliedCoupon && (
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] text-[#6E6157]">
                      <span>Try:</span>
                      <button
                        type="button"
                        onClick={() => applyCouponCode('CLOUDBERRY10')}
                        className="underline hover:text-[#201610] cursor-pointer"
                      >
                        CLOUDBERRY10
                      </button>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => applyCouponCode('WELCOME500')}
                        className="underline hover:text-[#201610] cursor-pointer"
                      >
                        WELCOME500
                      </button>
                    </div>
                  )}
                </div>

                {/* Calculation List */}
                <div className="space-y-2.5 text-xs text-[#483D35] pt-2 border-t border-[#E2D9CC]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-sans font-semibold text-[#201610] tabular-nums">
                      ₹{cartSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#6D7E69]">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Pan-India Shipping</span>
                    <span>
                      {shippingFee === 0 ? (
                        <strong className="text-[#6D7E69] font-medium uppercase tracking-wider text-[11px]">
                          Free Delivery
                        </strong>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-semibold text-[#201610] pt-3 border-t border-[#E2D9CC]">
                    <span>Total Amount</span>
                    <span className="font-sans text-lg tabular-nums">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#6E6157] block text-right">
                    Includes GST & Transit Insurance.
                  </span>
                </div>

                {/* Checkout CTA */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('checkout');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#3D2C22] transition-colors shadow-sm cursor-pointer"
                >
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="h-4 w-4 text-[#C8A46B]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
