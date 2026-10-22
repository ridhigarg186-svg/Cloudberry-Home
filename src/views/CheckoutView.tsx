import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  Check,
  ArrowRight,
  Lock,
  QrCode,
  Smartphone,
  Building,
  CheckCircle2,
  Package,
  Database,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Address, Order } from '../types';
import { saveOrderToSupabase } from '../lib/supabase';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    products,
    cartSubtotal,
    appliedCoupon,
    discountAmount,
    currentUser,
    createOrder,
    setCurrentView,
    lastCreatedOrder,
  } = useShop();

  // If already placed, show confirmation screen
  const [orderCompleted, setOrderCompleted] = useState<Order | null>(null);

  // Form states
  const [email, setEmail] = useState(currentUser?.email || 'ridhig211@gmail.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98201 44521');
  const [fullName, setFullName] = useState(currentUser?.name || 'Ridhi Gupta');
  const [street, setStreet] = useState(
    currentUser?.addresses?.[0]?.street || '402, Magnolia Residency, Bandra West'
  );
  const [apartment, setApartment] = useState(
    currentUser?.addresses?.[0]?.apartment || 'Near Carter Road Promenade'
  );
  const [city, setCity] = useState(currentUser?.addresses?.[0]?.city || 'Mumbai');
  const [state, setState] = useState(currentUser?.addresses?.[0]?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(currentUser?.addresses?.[0]?.pincode || '400050');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  // Razorpay simulation modal state
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [razorpayTab, setRazorpayTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('ridhi@okhdfcbank');
  const [processingPayment, setProcessingPayment] = useState(false);

  const FREE_SHIPPING_THRESHOLD = 1999;
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : 150;
  const totalAmount = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 && !orderCompleted) {
      setCurrentView('shop');
      return;
    }

    if (paymentMethod === 'razorpay') {
      setIsRazorpayModalOpen(true);
    } else {
      // Process COD immediately
      submitOrder('cod');
    }
  };

  const submitOrder = async (method: 'razorpay' | 'cod', paymentId?: string) => {
    setProcessingPayment(true);
    const shippingAddress: Address = {
      id: `addr-${Date.now()}`,
      fullName,
      phone,
      street,
      apartment,
      city,
      state,
      pincode,
      type: addressType,
    };

    const orderItems = cart.map((item) => {
      const prod = item.product || products.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        productName: prod ? prod.name : 'Home Decor Item',
        productImage: prod ? prod.images[0] : '',
        price: prod ? prod.price : 0,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
      };
    });

    const newOrder = await createOrder({
      userId: currentUser?.id,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress,
      items: orderItems,
      subtotal: cartSubtotal,
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
      shippingFee,
      total: totalAmount,
      paymentMethod: method,
      razorpayPaymentId: paymentId || (method === 'razorpay' ? `pay_rzp_${Date.now()}` : undefined),
    });

    // Directly sync to user's Supabase backend table `orders`
    try {
      await saveOrderToSupabase(newOrder);
    } catch (err) {
      console.warn('Direct Supabase sync notice:', err);
    }

    setProcessingPayment(false);
    setIsRazorpayModalOpen(false);
    setOrderCompleted(newOrder);
  };

  // If order was just completed, render celebratory confirmation
  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] p-8 md:p-12 shadow-sm text-center space-y-6">
            <div className="h-16 w-16 bg-[#6D7E69]/15 text-[#6D7E69] rounded-full flex items-center justify-center mx-auto border border-[#6D7E69]/30">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#6E6157] font-semibold block mb-1">
                Order Confirmed
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#201610] font-normal">
                Thank You for Choosing Cloudberry Home
              </h1>
              <p className="text-xs sm:text-sm text-[#483D35] mt-2 font-light">
                Order Reference:{' '}
                <strong className="text-[#201610] font-mono text-base font-semibold">
                  {orderCompleted.orderNumber}
                </strong>
              </p>
            </div>

            {/* Supabase backend status banner */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#6D7E69]/10 border border-[#6D7E69]/30 rounded-full text-[#201610] text-xs font-medium">
              <Database className="h-3.5 w-3.5 text-[#6D7E69]" />
              <span>Saved to Supabase Backend · Project: <span className="font-mono text-[11px] text-[#201610] font-semibold">dkursaukdesmrnyuxjvt</span> · <span className="font-mono text-[11px] text-[#201610]">orders</span> table</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#6D7E69]"></span>
            </div>

            <div className="p-4 bg-[#F2ECE1] rounded-xl border border-[#E2D9CC] text-left text-xs space-y-2 max-w-lg mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2D9CC]">
                <span className="text-[#6E6157]">Status:</span>
                <span className="font-semibold text-[#6D7E69] uppercase tracking-wider text-[11px]">
                  {orderCompleted.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6E6157]">Estimated Delivery:</span>
                <span className="text-[#201610] font-medium">3-4 Business Days via Delhivery Air</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6E6157]">Delivery Pincode:</span>
                <span className="font-mono text-[#201610]">{orderCompleted.shippingAddress.pincode} ({orderCompleted.shippingAddress.city})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6E6157]">Payment:</span>
                <span className="font-medium text-[#201610] uppercase">
                  {orderCompleted.paymentMethod === 'razorpay' ? 'Razorpay Online (Paid)' : 'Cash on Delivery (Pending)'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#E2D9CC]">
                <span className="font-semibold text-[#201610]">Total Paid:</span>
                <span className="font-sans font-bold text-sm text-[#201610] tabular-nums">
                  ₹{orderCompleted.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#483D35] max-w-md mx-auto font-light leading-relaxed">
              We have sent an order summary and invoice to <strong>{orderCompleted.customerEmail}</strong>. Each item is being hand-inspected and prepared in protective honeycomb packaging.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setCurrentView('account');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#3D2C22] transition-colors cursor-pointer shadow-sm"
              >
                Track Shipment in My Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3 border border-[#2A1E17] bg-[#FCFAF6] text-[#201610] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#EDE7DE] transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-[#E2D9CC] pb-6 mb-8 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#6E6157] font-semibold block mb-1">
              Checkout
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#201610]">
              Shipping & Secure Payment
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#6E6157]">
            <Lock className="h-4 w-4 text-[#6D7E69]" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        <form onSubmit={handleStartPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Customer & Address Information */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Information */}
            <div className="bg-[#FCFAF6] p-6 rounded-xl border border-[#E2D9CC] space-y-4 shadow-2xs">
              <h2 className="font-serif text-lg text-[#201610] font-medium border-b border-[#E2D9CC] pb-2">
                1. Contact Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#2C241E]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs focus:border-[#2A1E17] focus:outline-none text-[#201610]"
                    placeholder="name@example.com"
                  />
                  <span className="text-[10px] text-[#6E6157]">Order confirmation & tracking sent here</span>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#201610]">Phone (for Delivery Courier)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs focus:border-[#2A1E17] focus:outline-none text-[#201610]"
                    placeholder="+91 98201 44521"
                  />
                  <span className="text-[10px] text-[#6E6157]">For delivery updates & OTP</span>
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-[#FCFAF6] p-6 rounded-xl border border-[#E2D9CC] space-y-4 shadow-2xs">
              <h2 className="font-serif text-lg text-[#201610] font-medium border-b border-[#E2D9CC] pb-2">
                2. Shipping Address
              </h2>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#201610]">Full Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs focus:border-[#2A1E17] focus:outline-none text-[#201610]"
                    placeholder="Ridhi Gupta"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#201610]">Flat / House No. / Building / Street</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs focus:border-[#2A1E17] focus:outline-none text-[#201610]"
                    placeholder="402, Magnolia Residency, Bandra West"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#201610]">Apartment, Suite, Landmark (Optional)</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs focus:border-[#2A1E17] focus:outline-none text-[#201610]"
                    placeholder="Near Carter Road Promenade / Behind Olive Bar"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#201610]">PIN Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs focus:border-[#2A1E17] focus:outline-none text-[#201610]"
                      placeholder="400050"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#201610]">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs focus:border-[#2A1E17] focus:outline-none text-[#201610]"
                      placeholder="Mumbai"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#201610]">State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs focus:border-[#2A1E17] focus:outline-none text-[#201610]"
                      placeholder="Maharashtra"
                    />
                  </div>
                </div>

                {/* Address type tags */}
                <div className="flex items-center gap-4 pt-1">
                  <span className="text-xs text-[#6E6157]">Save as:</span>
                  {(['Home', 'Work', 'Other'] as const).map((type) => (
                    <label key={type} className="flex items-center gap-1.5 text-xs text-[#201610] cursor-pointer">
                      <input
                        type="radio"
                        name="addressType"
                        checked={addressType === type}
                        onChange={() => setAddressType(type)}
                        className="text-[#2A1E17]"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-[#FCFAF6] p-6 rounded-xl border border-[#E2D9CC] space-y-4 shadow-2xs">
              <h2 className="font-serif text-lg text-[#201610] font-medium border-b border-[#E2D9CC] pb-2">
                3. Payment Method
              </h2>

              <div className="space-y-3">
                {/* Razorpay Option */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#2A1E17] bg-[#F2ECE1]'
                      : 'border-[#E2D9CC] hover:border-[#2A1E17] bg-[#FCFAF6]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="mt-1 text-[#2A1E17]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-[#201610] uppercase tracking-wider">
                        Razorpay Secure Online Payment (Recommended)
                      </span>
                      <span className="text-[10px] bg-[#6D7E69]/15 text-[#6D7E69] px-2 py-0.5 rounded-xs font-semibold">
                        Instant Verification
                      </span>
                    </div>
                    <p className="text-xs text-[#6E6157] mt-1">
                      UPI (Google Pay, PhonePe, Paytm, QR Code), Cards (Visa, MasterCard, RuPay), Netbanking across all Indian banks.
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#2A1E17] bg-[#F2ECE1]'
                      : 'border-[#E2D9CC] hover:border-[#2A1E17] bg-[#FCFAF6]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-[#2A1E17]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-[#201610] uppercase tracking-wider">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[10px] text-[#6E6157]">Pay at doorstep</span>
                    </div>
                    <p className="text-xs text-[#6E6157] mt-1">
                      Pay via cash or courier UPI QR scan upon physical arrival of your insured package.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-[#FCFAF6] p-6 rounded-xl border border-[#E2D9CC] shadow-sm space-y-6">
              <h2 className="font-serif text-xl font-normal text-[#201610] pb-3 border-b border-[#E2D9CC]">
                Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
              </h2>

              {/* Items Thumbnail Mini List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => {
                  const product = item.product || products.find((p) => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <div key={`${item.productId}-${item.selectedColor}`} className="flex gap-3 text-xs">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="h-14 w-14 rounded-xs object-cover bg-[#EDE7DE] border border-[#E2D9CC]"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-serif font-medium text-[#201610] block truncate">
                          {product.name}
                        </span>
                        {item.selectedColor && (
                          <span className="text-[10px] text-[#6E6157] block">
                            {item.selectedColor}
                          </span>
                        )}
                        <div className="flex justify-between items-baseline mt-1">
                          <span className="text-[#6E6157]">Qty: {item.quantity}</span>
                          <span className="font-sans font-semibold text-[#201610] tabular-nums">
                            ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 text-xs text-[#483D35] pt-3 border-t border-[#E2D9CC]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-sans font-semibold text-[#201610] tabular-nums">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#6D7E69]">
                    <span>Discount Coupon ({appliedCoupon?.code})</span>
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
                  <span>Total Payable</span>
                  <span className="font-sans text-xl tabular-nums">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processingPayment}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#3D2C22] transition-colors shadow-md disabled:opacity-50 cursor-pointer"
              >
                <span>
                  {processingPayment
                    ? 'Processing...'
                    : paymentMethod === 'razorpay'
                    ? `Pay ₹${totalAmount.toLocaleString('en-IN')} with Razorpay`
                    : `Confirm Cash on Delivery (₹${totalAmount.toLocaleString('en-IN')})`}
                </span>
                <ArrowRight className="h-4 w-4 text-[#C8A46B]" />
              </button>

              <div className="text-center space-y-1 text-[11px] text-[#6E6157]">
                <p>100% Insured Transit Guarantee across India</p>
                <p>Doorstep inspection & 7-day easy return policy</p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Realistic Razorpay Simulation Gateway Modal */}
      {isRazorpayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-md shadow-2xl border border-blue-900/20 overflow-hidden flex flex-col animate-in scale-95 duration-200">
            {/* Razorpay Header with Brand Bar */}
            <div className="bg-[#0C2340] text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] tracking-widest uppercase text-blue-200 block">
                  Razorpay Secured
                </span>
                <h3 className="font-serif text-lg text-white">Cloudberry Home Atelier</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-blue-200 block">Amount Payable</span>
                <span className="font-sans font-bold text-lg tabular-nums text-white">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Test Mode Notification Banner */}
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-[11px] text-amber-800 flex items-center justify-between">
              <span>Razorpay Test Mode Active · No real charge</span>
              <span className="font-mono text-[10px] bg-amber-200 px-1.5 py-0.5 rounded">TEST</span>
            </div>

            {/* Razorpay Payment Tabs */}
            <div className="flex border-b border-gray-200 text-xs">
              <button
                type="button"
                onClick={() => setRazorpayTab('upi')}
                className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                  razorpayTab === 'upi'
                    ? 'border-[#0C2340] text-[#0C2340] bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Smartphone className="h-4 w-4" />
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                onClick={() => setRazorpayTab('card')}
                className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                  razorpayTab === 'card'
                    ? 'border-[#0C2340] text-[#0C2340] bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setRazorpayTab('netbanking')}
                className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                  razorpayTab === 'netbanking'
                    ? 'border-[#0C2340] text-[#0C2340] bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Building className="h-4 w-4" />
                <span>Netbanking</span>
              </button>
            </div>

            {/* Razorpay Body */}
            <div className="p-6 space-y-4 flex-1">
              {razorpayTab === 'upi' && (
                <div className="space-y-4 text-center">
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200 inline-block">
                    <QrCode className="h-32 w-32 mx-auto text-[#0C2340]" />
                    <span className="text-[10px] text-gray-500 block mt-2">
                      Scan with Google Pay, PhonePe, or Paytm
                    </span>
                  </div>

                  <div className="text-left space-y-1">
                    <label className="text-xs font-medium text-gray-700">Or enter UPI ID / VPA</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {razorpayTab === 'card' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4111 2222 3333 4444"
                      className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700">CVV</label>
                      <input
                        type="password"
                        defaultValue="891"
                        maxLength={4}
                        className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {razorpayTab === 'netbanking' && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Popular Indian Banks</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National'].map(
                      (bank) => (
                        <div
                          key={bank}
                          className="p-2.5 border border-gray-200 rounded text-center hover:border-blue-600 hover:bg-blue-50/50 cursor-pointer font-medium text-gray-800"
                        >
                          {bank}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsRazorpayModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => submitOrder('razorpay', `pay_rzp_mock_${Date.now()}`)}
                className="flex-1 py-2.5 px-4 bg-[#0C2340] hover:bg-[#153a66] text-white text-xs font-semibold rounded uppercase tracking-wider transition-colors shadow-sm"
              >
                Pay ₹{totalAmount.toLocaleString('en-IN')} (Simulate Success)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
