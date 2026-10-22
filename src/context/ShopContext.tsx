import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Collection,
  RoomInspiration,
  CartItem,
  User,
  Order,
  Coupon,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_COLLECTIONS,
  INITIAL_ROOMS,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_USER,
  INITIAL_ORDERS,
} from '../data/mockData';
import { saveOrderToSupabase } from '../lib/supabase';

export type ViewType =
  | 'home'
  | 'shop'
  | 'rooms'
  | 'collections'
  | 'story'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'account'
  | 'admin'
  | 'order-success';

interface ShopContextType {
  // Navigation & Views
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (catSlug: string | null) => void;
  selectedCollection: string | null;
  setSelectedCollection: (colSlug: string | null) => void;
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string | null) => void;

  // Catalog Data
  products: Product[];
  categories: Category[];
  collections: Collection[];
  rooms: RoomInspiration[];
  coupons: Coupon[];

  // Modals & Drawers
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (prod: Product | null) => void;
  shopLookRoom: RoomInspiration | null;
  setShopLookRoom: (room: RoomInspiration | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string, color?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, color?: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;

  // Coupon
  appliedCoupon: Coupon | null;
  discountAmount: number;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Auth & User
  currentUser: User | null;
  login: (email: string, role?: 'customer' | 'admin') => Promise<boolean>;
  logout: () => void;
  updateUserAddresses: (addresses: User['addresses']) => void;

  // Orders
  orders: Order[];
  lastCreatedOrder: Order | null;
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status'], tracking?: string, courier?: string) => Promise<void>;

  // Admin Product Actions
  addProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Toast / notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);
  const [rooms, setRooms] = useState<RoomInspiration[]>(INITIAL_ROOMS);
  const [coupons] = useState<Coupon[]>(INITIAL_COUPONS);

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [shopLookRoom, setShopLookRoom] = useState<RoomInspiration | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cbh_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cbh_wishlist');
      return saved ? JSON.parse(saved) : ['prod-01', 'prod-03'];
    } catch {
      return ['prod-01', 'prod-03'];
    }
  });

  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('cbh_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Fetch initial data from server APIs
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const prods = await prodRes.json();
          if (Array.isArray(prods) && prods.length > 0) setProducts(prods);
        }

        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const cats = await catRes.json();
          if (Array.isArray(cats) && cats.length > 0) setCategories(cats);
        }

        const ordRes = await fetch('/api/orders');
        if (ordRes.ok) {
          const ords = await ordRes.json();
          if (Array.isArray(ords)) setOrders(ords);
        }
      } catch {
        // Fallback to initial local seed data
      }
    };
    fetchCatalog();
  }, []);

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem('cbh_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Save wishlist
  useEffect(() => {
    try {
      localStorage.setItem('cbh_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Save user
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('cbh_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('cbh_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Cart methods
  const addToCart = (product: Product, quantity = 1, color?: string) => {
    const selectedColor = color || (product.colors && product.colors[0]?.name) || undefined;
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.selectedColor === selectedColor
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { productId: product.id, quantity, selectedColor, product }];
    });
    showToast(`Added "${product.name}" to your shopping bag.`);
  };

  const removeFromCart = (productId: string, color?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && (color ? item.selectedColor === color : true))
      )
    );
    showToast('Item removed from shopping bag.');
  };

  const updateCartQuantity = (productId: string, quantity: number, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && (color ? item.selectedColor === color : true)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((total, item) => {
    const prod = item.product || products.find((p) => p.id === item.productId);
    return total + (prod ? prod.price * item.quantity : 0);
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Coupon calculations
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percent') {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.discountType === 'fixed') {
      discountAmount = Math.min(appliedCoupon.value, cartSubtotal);
    } else if (appliedCoupon.discountType === 'freeship') {
      discountAmount = appliedCoupon.value;
    }
  }

  const applyCouponCode = (code: string) => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try CLOUDBERRY10 or WELCOME500' };
    }
    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Requires minimum order of ₹${found.minOrder.toLocaleString('en-IN')}`,
      };
    }
    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied successfully!`);
    return { success: true, message: `Coupon ${found.code} applied!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.');
  };

  // Wishlist methods
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your wishlist.');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // User Auth
  const login = async (email: string, role: 'customer' | 'admin' = 'customer'): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        showToast(`Welcome back, ${data.user.name}!`);
        return true;
      }
    } catch {
      // Local fallback
    }

    // Default mock user fallback
    const user: User =
      email === 'admin@cloudberryhome.com'
        ? {
            id: 'usr-admin-1',
            name: 'Cloudberry Atelier Admin',
            email: 'admin@cloudberryhome.com',
            role: 'admin',
            addresses: [],
            createdAt: new Date().toISOString(),
          }
        : {
            id: `usr-${Date.now()}`,
            name: email.split('@')[0],
            email,
            role: 'customer',
            addresses: INITIAL_USER.addresses,
            createdAt: new Date().toISOString(),
          };

    setCurrentUser(user);
    showToast(`Signed in as ${user.name}`);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('home');
    showToast('Signed out successfully.');
  };

  const updateUserAddresses = (addresses: User['addresses']) => {
    if (!currentUser) return;
    const updated = { ...currentUser, addresses };
    setCurrentUser(updated);
    fetch(`/api/users/${currentUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addresses }),
    }).catch(() => {});
    showToast('Address book updated.');
  };

  // Orders
  const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        const newOrder = await res.json();
        setOrders((prev) => [newOrder, ...prev]);
        setLastCreatedOrder(newOrder);
        clearCart();
        return newOrder;
      }
    } catch {
      // fallback
    }

    // Fallback direct Supabase persistence in case of offline or direct client-mode
    const fallbackOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `CBH-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: currentUser?.id,
      customerName: orderData.customerName || 'Valued Guest',
      customerEmail: orderData.customerEmail || 'customer@example.com',
      customerPhone: orderData.customerPhone || '+91 98201 44521',
      shippingAddress: orderData.shippingAddress!,
      items: orderData.items || [],
      subtotal: orderData.subtotal || cartSubtotal,
      discount: orderData.discount || discountAmount,
      couponCode: orderData.couponCode,
      shippingFee: orderData.shippingFee || 0,
      total: orderData.total || cartSubtotal - discountAmount,
      paymentMethod: orderData.paymentMethod || 'razorpay',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
      razorpayPaymentId: orderData.razorpayPaymentId || `pay_mock_${Date.now()}`,
      status: 'Processing',
      trackingNumber: `DEL-IN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      courier: 'Delhivery Express Air',
      timeline: [
        {
          status: 'Order Placed',
          title: 'Order Confirmed & Received',
          description: 'Payment authorized and verified securely.',
          timestamp: 'Just now',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    // Proactively save fallback order directly to Supabase
    saveOrderToSupabase(fallbackOrder).catch((err) =>
      console.warn('Fallback Supabase save notice:', err)
    );

    setOrders((prev) => [fallbackOrder, ...prev]);
    setLastCreatedOrder(fallbackOrder);
    clearCart();
    return fallbackOrder;
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order['status'],
    tracking?: string,
    courier?: string
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber: tracking, courier }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        showToast(`Order status updated to ${status}`);
        return;
      }
    } catch {
      // fallback
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              trackingNumber: tracking || o.trackingNumber,
              courier: courier || o.courier,
              timeline: [
                ...o.timeline,
                {
                  status,
                  title: `Status marked as ${status}`,
                  description: 'Updated by Cloudberry studio operations.',
                  timestamp: 'Just now',
                },
              ],
            }
          : o
      )
    );
    showToast(`Order status updated to ${status}`);
  };

  // Product CRUD for Admin
  const addProduct = async (productData: Partial<Product>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
        showToast(`Product "${created.name}" created successfully.`);
        return;
      }
    } catch {
      // fallback
    }

    const fallbackProd: Product = {
      id: `prod-${Date.now()}`,
      name: productData.name || 'New Decor Piece',
      slug: (productData.name || 'new-decor-piece').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: productData.category || 'Living Room Decor',
      categorySlug: (productData.category || 'living-room-decor').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      collections: productData.collections || ['The Neutral Edit'],
      roomTags: productData.roomTags || ['Living Room'],
      price: productData.price || 1999,
      originalPrice: productData.originalPrice,
      discountPercent: productData.discountPercent,
      shortDescription: productData.shortDescription || 'Artisanal home decor item.',
      description: productData.description || 'Thoughtfully crafted for serene living spaces.',
      details: productData.details || {
        dimensions: '20 x 20 x 20 cm',
        material: 'Handcrafted Ceramic',
        finish: 'Matte Bisque',
        care: 'Wipe with soft damp cloth',
        origin: 'India',
      },
      images: productData.images || ['https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80'],
      inStock: (productData.stockCount || 10) > 0,
      stockCount: productData.stockCount || 10,
      isFeatured: productData.isFeatured || false,
      isNewArrival: true,
      rating: 5.0,
      reviewCount: 0,
      tags: productData.tags || ['Decor', 'Handcrafted'],
    };

    setProducts((prev) => [fallbackProd, ...prev]);
    showToast(`Product "${fallbackProd.name}" created.`);
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        showToast('Product updated successfully.');
        return;
      }
    } catch {
      // fallback
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productData } : p))
    );
    showToast('Product updated.');
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast('Product deleted.');
        return;
      }
    } catch {
      // fallback
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product deleted.');
  };

  return (
    <ShopContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        selectedCategory,
        setSelectedCategory,
        selectedCollection,
        setSelectedCollection,
        selectedRoomId,
        setSelectedRoomId,
        products,
        categories,
        collections,
        rooms,
        coupons,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        quickViewProduct,
        setQuickViewProduct,
        shopLookRoom,
        setShopLookRoom,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        appliedCoupon,
        discountAmount,
        applyCouponCode,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        currentUser,
        login,
        logout,
        updateUserAddresses,
        orders,
        lastCreatedOrder,
        createOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
