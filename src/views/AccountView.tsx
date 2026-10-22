import React, { useState } from 'react';
import {
  Package,
  MapPin,
  Heart,
  LogOut,
  Plus,
  Trash2,
  Truck,
  ShoppingBag,
  X,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Address, Order } from '../types';

export const AccountView: React.FC = () => {
  const {
    currentUser,
    logout,
    orders,
    wishlist,
    products,
    updateUserAddresses,
    addToCart,
    toggleWishlist,
    setCurrentView,
    setSelectedProductId,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders');

  // Track order modal
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Add Address Modal
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newFullName, setNewFullName] = useState(currentUser?.name || '');
  const [newPhone, setNewPhone] = useState(currentUser?.phone || '');
  const [newStreet, setNewStreet] = useState('');
  const [newApartment, setNewApartment] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [newType, setNewType] = useState<'Home' | 'Work' | 'Other'>('Home');

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] py-20 text-center">
        <h2 className="font-serif text-2xl text-[#201610]">Please Sign In to Access Your Account</h2>
        <button
          type="button"
          onClick={() => setCurrentView('home')}
          className="mt-4 px-6 py-2.5 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#3D2C22] transition-colors cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Filter orders for this user
  const userOrders = orders.filter(
    (o) =>
      o.userId === currentUser.id ||
      o.customerEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  // Wishlist products
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      fullName: newFullName,
      phone: newPhone,
      street: newStreet,
      apartment: newApartment,
      city: newCity,
      state: newState,
      pincode: newPincode,
      type: newType,
      isDefault: currentUser.addresses.length === 0,
    };
    updateUserAddresses([...currentUser.addresses, newAddr]);
    setIsAddAddressOpen(false);
    // Reset
    setNewStreet('');
    setNewApartment('');
    setNewCity('');
    setNewState('');
    setNewPincode('');
  };

  const handleDeleteAddress = (id: string) => {
    const updated = currentUser.addresses.filter((a) => a.id !== id);
    updateUserAddresses(updated);
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = currentUser.addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    updateUserAddresses(updated);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Banner */}
        <div className="bg-[#FCFAF6] p-6 sm:p-8 rounded-xl border border-[#E2D9CC] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-[#EDE7DE] text-[#201610] flex items-center justify-center font-serif text-2xl font-normal shrink-0 border border-[#E2D9CC]">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#6E6157] font-semibold block">
                Cloudberry Collector
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#201610]">
                {currentUser.name}
              </h1>
              <p className="text-xs text-[#6E6157] mt-0.5">
                {currentUser.email} · {currentUser.phone || '+91 98201 44521'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser.role === 'admin' && (
              <button
                type="button"
                onClick={() => setCurrentView('admin')}
                className="px-4 py-2 bg-[#6D7E69] text-white text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#5C6B58] transition-colors cursor-pointer"
              >
                Go to Admin Portal
              </button>
            )}
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 border border-[#E2D9CC] text-[#201610] hover:bg-[#EDE7DE] text-xs uppercase tracking-wider font-medium rounded-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Account Tabs */}
        <div className="flex border-b border-[#E2D9CC] mb-8 space-x-8 text-xs font-medium uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 transition-colors relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'text-[#201610] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#201610]'
                : 'text-[#6E6157] hover:text-[#201610]'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Order History ({userOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 transition-colors relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'addresses'
                ? 'text-[#201610] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#201610]'
                : 'text-[#6E6157] hover:text-[#201610]'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Saved Addresses ({currentUser.addresses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 transition-colors relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'wishlist'
                ? 'text-[#201610] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#201610]'
                : 'text-[#6E6157] hover:text-[#201610]'
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>Wishlist ({wishlist.length})</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {userOrders.length === 0 ? (
              <div className="text-center py-16 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] p-8 space-y-3 shadow-2xs">
                <p className="font-serif text-xl text-[#201610]">No past orders found</p>
                <p className="text-xs text-[#6E6157]">
                  When you place an order, live courier tracking and invoices will appear here.
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentView('shop')}
                  className="mt-2 px-6 py-2.5 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#3D2C22] cursor-pointer"
                >
                  Explore Store
                </button>
              </div>
            ) : (
              userOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] p-6 space-y-5 shadow-2xs"
                >
                  {/* Order Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2D9CC] gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-[#201610]">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-xs ${
                            ord.status === 'Delivered'
                              ? 'bg-[#6D7E69]/15 text-[#6D7E69]'
                              : ord.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <span className="text-xs text-[#6E6157] block">
                        Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {ord.paymentMethod === 'razorpay' ? 'Razorpay Online' : 'Cash on Delivery'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-sans font-bold text-base text-[#201610] tabular-nums">
                        ₹{ord.total.toLocaleString('en-IN')}
                      </span>
                      <button
                        type="button"
                        onClick={() => setTrackingOrder(ord)}
                        className="px-3.5 py-1.5 bg-[#F2ECE1] hover:bg-[#EDE7DE] text-[#201610] text-xs font-semibold rounded-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Truck className="h-3.5 w-3.5 text-[#C8A46B]" />
                        <span>Track Shipment</span>
                      </button>
                    </div>
                  </div>

                  {/* Items Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center p-2 bg-[#FAF6F0] rounded-xs border border-[#E2D9CC]">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            referrerPolicy="no-referrer"
                            className="h-12 w-12 rounded-xs object-cover bg-[#EDE7DE] shrink-0 border border-[#E2D9CC]"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-serif text-xs font-normal text-[#201610] truncate">
                            {item.productName}
                          </h4>
                          <span className="text-[10px] text-[#6E6157]">
                            Qty: {item.quantity} · ₹{item.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery summary */}
                  <div className="text-xs text-[#6E6157] flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-[#E2D9CC] gap-2">
                    <span>
                      Courier: <strong>{ord.courier || 'Delhivery Express Air'}</strong> · AWB Tracking: <strong className="font-mono text-[#201610]">{ord.trackingNumber || 'DEL-IN-89124'}</strong>
                    </span>
                    <span>Delivered to: {ord.shippingAddress.city}, {ord.shippingAddress.pincode}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-[#6E6157]">
                Manage your saved delivery locations across India for swift checkout.
              </p>
              <button
                type="button"
                onClick={() => setIsAddAddressOpen(true)}
                className="px-4 py-2 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#3D2C22] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentUser.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-6 bg-[#FCFAF6] rounded-xl border space-y-3 relative ${
                    addr.isDefault ? 'border-[#2A1E17] shadow-xs' : 'border-[#E2D9CC]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#201610]">{addr.fullName}</span>
                      <span className="text-[10px] uppercase tracking-wider bg-[#EDE7DE] text-[#483D35] px-2 py-0.5 rounded-xs font-medium">
                        {addr.type}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] text-[#6D7E69] bg-[#6D7E69]/15 px-2 py-0.5 rounded-xs font-semibold">
                          Default
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-[#8C7D73] hover:text-red-700 cursor-pointer"
                      aria-label="Delete address"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#483D35] font-light leading-relaxed">
                    {addr.street}
                    {addr.apartment && <>, {addr.apartment}</>}
                    <br />
                    {addr.city}, {addr.state} - <strong className="font-mono">{addr.pincode}</strong>
                    <br />
                    Phone: {addr.phone}
                  </p>

                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefaultAddress(addr.id)}
                      className="text-[11px] text-[#C8A46B] hover:text-[#201610] underline pt-1 cursor-pointer"
                    >
                      Set as Default Delivery Address
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] p-8 space-y-3 shadow-2xs">
                <p className="font-serif text-xl text-[#201610]">Your wishlist is empty</p>
                <p className="text-xs text-[#6E6157]">
                  Tap the heart icon on any product to save it to your bespoke wishlist.
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentView('shop')}
                  className="mt-2 px-6 py-2.5 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#3D2C22] cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] space-y-3 flex flex-col justify-between shadow-2xs"
                  >
                    <div
                      onClick={() => {
                        setSelectedProductId(prod.id);
                        setCurrentView('product-detail');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="cursor-pointer"
                    >
                      <div className="aspect-[4/5] rounded-lg overflow-hidden bg-[#EDE7DE] mb-3 border border-[#E2D9CC]">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-[#6E6157] font-medium block">
                        {prod.category}
                      </span>
                      <h4 className="font-serif text-sm text-[#201610] truncate font-normal">
                        {prod.name}
                      </h4>
                      <span className="font-sans text-xs font-semibold text-[#201610] tabular-nums block mt-1">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#E2D9CC]">
                      <button
                        type="button"
                        onClick={() => addToCart(prod, 1)}
                        className="w-full py-2 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#3D2C22] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <ShoppingBag className="h-3.5 w-3.5 text-[#C8A46B]" />
                        <span>Move to Bag</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleWishlist(prod.id)}
                        className="w-full text-center text-[11px] text-[#8C7D73] hover:text-red-700 transition-colors cursor-pointer"
                      >
                        Remove from Wishlist
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Order Shipment Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FCFAF6] rounded-xl shadow-2xl border border-[#E2D9CC] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 bg-[#1E1610] text-[#FCFAF6] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C8A46B] font-semibold block">
                  Live Dispatch Tracking
                </span>
                <h3 className="font-serif text-lg text-[#FCFAF6]">
                  Order {trackingOrder.orderNumber}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setTrackingOrder(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Courier Info Strip */}
            <div className="p-4 bg-[#F2ECE1] border-b border-[#E2D9CC] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#6E6157] block">Carrier Partner:</span>
                <strong className="text-[#201610]">{trackingOrder.courier || 'Delhivery Express Air'}</strong>
              </div>
              <div className="text-right">
                <span className="text-[#6E6157] block">AWB Tracking Number:</span>
                <strong className="font-mono text-[#201610]">{trackingOrder.trackingNumber || 'DEL-IN-8912401'}</strong>
              </div>
            </div>

            {/* Step-by-Step Live Timeline */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="relative border-l-2 border-[#E2D9CC] ml-4 space-y-6">
                {trackingOrder.timeline.map((event, idx) => (
                  <div key={idx} className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-[#6D7E69] border-2 border-[#FCFAF6] flex items-center justify-center shadow-xs" />
                    <div>
                      <div className="flex items-baseline justify-between">
                        <h4 className="font-serif text-sm font-semibold text-[#201610]">
                          {event.title}
                        </h4>
                        <span className="text-[10px] font-mono text-[#6E6157]">
                          {event.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-[#483D35] mt-0.5 font-light leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Anticipated future steps */}
                {trackingOrder.status !== 'Delivered' && (
                  <div className="relative pl-6 opacity-60">
                    <span className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full bg-[#E2D9CC] border-2 border-[#FCFAF6]" />
                    <div>
                      <h4 className="font-serif text-xs font-medium text-[#6E6157]">
                        Out for Doorstep Delivery
                      </h4>
                      <p className="text-[11px] text-[#8C7D73]">
                        Assigned to delivery associate in {trackingOrder.shippingAddress.city}.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#FAF6F0] border-t border-[#E2D9CC] text-right">
              <button
                type="button"
                onClick={() => setTrackingOrder(null)}
                className="px-5 py-2 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#3D2C22] cursor-pointer"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FCFAF6] rounded-xl shadow-2xl border border-[#E2D9CC] overflow-hidden">
            <div className="p-6 border-b border-[#E2D9CC] flex items-center justify-between">
              <h3 className="font-serif text-xl text-[#201610]">Add New Delivery Address</h3>
              <button
                type="button"
                onClick={() => setIsAddAddressOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE7DE] text-[#201610] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-medium text-[#201610]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[#201610]">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#201610]">Street / Building</label>
                <input
                  type="text"
                  required
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="Flat No, Building Name, Street"
                  className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#201610]">Apartment / Landmark</label>
                <input
                  type="text"
                  value={newApartment}
                  onChange={(e) => setNewApartment(e.target.value)}
                  placeholder="Near Park, Behind Landmark"
                  className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-[#201610]">PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs font-mono text-[#201610]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[#201610]">City</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[#201610]">State</label>
                  <input
                    type="text"
                    required
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <span className="text-[#6E6157]">Tag:</span>
                {(['Home', 'Work', 'Other'] as const).map((t) => (
                  <label key={t} className="flex items-center gap-1 cursor-pointer text-[#201610]">
                    <input
                      type="radio"
                      name="newType"
                      checked={newType === t}
                      onChange={() => setNewType(t)}
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#E2D9CC]">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="px-4 py-2 border border-[#E2D9CC] text-[#201610] rounded-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2A1E17] text-[#FAF6F0] hover:bg-[#3D2C22] rounded-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
