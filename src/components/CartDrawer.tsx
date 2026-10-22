import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
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

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartDrawerOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 1999;
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : 150;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCouponCode(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCartPage = () => {
    setIsCartDrawerOpen(false);
    setCurrentView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF6F0] shadow-2xl flex flex-col h-full border-l border-[#E2D9CC] animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E2D9CC] flex items-center justify-between bg-[#F5F0E6]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#C8A46B]" />
            <h2 className="font-serif text-lg font-normal text-[#201610]">
              Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE7DE] text-[#201610] hover:bg-[#E2D9CC] transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#F2ECE1] p-3.5 border-b border-[#E2D9CC] text-xs">
          <div className="flex items-center gap-2 text-[#201610] mb-1.5 font-medium">
            <Truck className="h-4 w-4 text-[#6D7E69]" />
            {isFreeShipping ? (
              <span className="text-[#6D7E69] font-medium">
                You've unlocked Complimentary Express Delivery across India!
              </span>
            ) : (
              <span>
                Add{' '}
                <strong className="font-semibold text-[#201610] tabular-nums">
                  ₹{amountToFreeShipping.toLocaleString('en-IN')}
                </strong>{' '}
                more for Free Express Shipping
              </span>
            )}
          </div>

          <div className="h-1.5 w-full bg-[#E2D9CC] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6D7E69] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="h-16 w-16 rounded-full bg-[#EDE7DE] flex items-center justify-center text-[#201610] border border-[#E2D9CC]">
                <ShoppingBag className="h-7 w-7 text-[#C8A46B]" />
              </div>
              <p className="font-serif text-xl text-[#201610]">Your shopping bag is empty</p>
              <p className="text-xs text-[#483D35] max-w-xs">
                Explore our curated vases, ambient lighting, and serene textiles to begin styling your space.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setCurrentView('shop');
                }}
                className="mt-2 px-6 py-2.5 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#3D2C22] cursor-pointer transition-colors shadow-sm"
              >
                Start Exploring
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const product = item.product || products.find((p) => p.id === item.productId);
              if (!product) return null;

              return (
                <div
                  key={`${item.productId}-${item.selectedColor || 'default'}`}
                  className="flex gap-4 p-3 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] shadow-2xs"
                >
                  {/* Thumbnail */}
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#EDE7DE] border border-[#E2D9CC]">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-normal text-[#201610] truncate">
                          {product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId, item.selectedColor)}
                          className="text-[#8C7D73] hover:text-red-700 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {item.selectedColor && (
                        <span className="text-[11px] text-[#6E6157] block mt-0.5">
                          Color: {item.selectedColor}
                        </span>
                      )}

                      <span className="font-sans text-xs font-semibold text-[#201610] tabular-nums block mt-1">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#E2D9CC] rounded-xs bg-[#FAF6F0]">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.productId, item.quantity - 1, item.selectedColor)
                          }
                          className="w-7 h-6 flex items-center justify-center text-xs text-[#201610] hover:bg-[#EDE7DE] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono text-xs tabular-nums text-[#201610]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.productId, item.quantity + 1, item.selectedColor)
                          }
                          className="w-7 h-6 flex items-center justify-center text-xs text-[#201610] hover:bg-[#EDE7DE] cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-mono font-medium text-[#201610] tabular-nums">
                        ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer (Subtotal, Coupon & Checkout) */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E2D9CC] bg-[#FCFAF6] space-y-4 shadow-lg">
            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#6D7E69]/15 border border-[#6D7E69]/30 rounded-xs text-xs text-[#201610]">
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-[#6D7E69]" />
                    <span>
                      Coupon <strong>{appliedCoupon.code}</strong> applied (-₹{discountAmount})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-[11px] text-red-600 hover:underline cursor-pointer"
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
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError(null);
                      }}
                      placeholder="Discount code (e.g. CLOUDBERRY10)"
                      className="w-full pl-8 pr-2 py-2 border border-[#E2D9CC] rounded-xs text-xs uppercase bg-[#FAF6F0] text-[#201610] placeholder:text-[#8C7D73] focus:border-[#2A1E17] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#EDE7DE] hover:bg-[#E2D9CC] text-[#201610] text-xs font-medium rounded-xs uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#483D35] pt-1">
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
                <span>Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-[#6D7E69] font-medium uppercase tracking-wider text-[11px]">
                      Complimentary
                    </strong>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-semibold text-[#201610] pt-2 border-t border-[#E2D9CC]">
                <span>Estimated Total</span>
                <span className="font-sans text-base tabular-nums">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[10px] text-[#6E6157] text-right">
                Includes all applicable GST & Pan-India transit insurance.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#3D2C22] transition-colors shadow-sm cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4 text-[#C8A46B]" />
              </button>

              <button
                type="button"
                onClick={handleViewCartPage}
                className="w-full py-2 text-center text-xs uppercase tracking-wider text-[#6E6157] hover:text-[#201610] transition-colors cursor-pointer"
              >
                View Bag & Add Gift Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
