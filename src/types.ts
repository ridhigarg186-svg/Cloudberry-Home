export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string; // e.g. "Vases", "Lighting", "Lamps", "Cushions", etc.
  categorySlug: string;
  collections: string[]; // e.g. "The Neutral Edit", "Slow Living"
  roomTags: string[]; // e.g. "Living Room", "Bedroom", "Reading Corner"
  price: number; // in INR
  originalPrice?: number;
  discountPercent?: number;
  shortDescription: string;
  description: string;
  details: {
    dimensions: string;
    material: string;
    finish: string;
    care: string;
    weight?: string;
    origin: string;
  };
  images: string[];
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
  colors?: { name: string; hex: string }[];
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  isLegacy?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface RoomInspiration {
  id: string;
  title: string;
  roomType: string;
  tagline: string;
  description: string;
  image: string;
  stylingTips: string[];
  productIds: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedColor?: string;
  product?: Product;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
  type: 'Home' | 'Work' | 'Other';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedColor?: string;
}

export interface OrderTimelineEvent {
  status: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'failed';
  razorpayPaymentId?: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  courier?: string;
  timeline: OrderTimelineEvent[];
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userLocation: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'percent' | 'fixed' | 'freeship';
  value: number; // percentage (e.g. 10) or fixed in INR (e.g. 500)
  minOrder: number;
  description: string;
}
