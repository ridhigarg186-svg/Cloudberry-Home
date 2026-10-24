import { createClient } from '@supabase/supabase-js';
import { Order } from '../types';

export const SUPABASE_PROJECT_REF = 'dkursaukdesmrnyuxjvt';

export function normalizeSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return 'https://dkursaukdesmrnyuxjvt.supabase.co';
  }
  let clean = rawUrl.trim();
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    if (clean.includes('.supabase.co')) {
      clean = `https://${clean}`;
    } else {
      clean = `https://${clean}.supabase.co`;
    }
  }
  return clean;
}

const rawClientUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) ||
  'https://dkursaukdesmrnyuxjvt.supabase.co';

export const SUPABASE_URL = normalizeSupabaseUrl(rawClientUrl);

const rawClientKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)) ||
  'sb_publishable_tt2fG15VTHp9KbXWN_VkDg_GDRIoWNF';

export const SUPABASE_ANON_KEY = (rawClientKey && rawClientKey.trim()) || 'sb_publishable_tt2fG15VTHp9KbXWN_VkDg_GDRIoWNF';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_ORDERS_SQL = `-- Cloudberry Home: Supabase Orders Table Definition
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/dkursaukdesmrnyuxjvt/sql/new

CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    customer_name TEXT,
    email TEXT,
    phone TEXT,
    address_line TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    items JSONB,
    subtotal NUMERIC,
    shipping_fee NUMERIC DEFAULT 0,
    gst NUMERIC DEFAULT 0,
    total NUMERIC,
    payment_method TEXT,
    payment_status TEXT,
    order_status TEXT DEFAULT 'Placed',
    tracking_steps JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public checkout submissions to insert into orders
CREATE POLICY "Allow checkout insert on orders" ON public.orders
    FOR INSERT WITH CHECK (true);

-- Allow reading orders
CREATE POLICY "Allow public read on orders" ON public.orders
    FOR SELECT USING (true);
`;

export interface SupabaseOrderRow {
  id: string;
  user_id?: string;
  customer_name: string;
  email: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{
    productId: string;
    productName: string;
    image?: string;
    price: number;
    quantity: number;
    selectedColor?: string;
  }>;
  subtotal: number;
  shipping_fee: number;
  gst?: number;
  total: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  tracking_steps?: Array<{
    date: string;
    title: string;
    current: boolean;
    completed: boolean;
    description: string;
  }>;
  created_at?: string;
}

/**
 * Maps the Cloudberry application Order to the user's Supabase backend \`orders\` table schema
 */
export function mapOrderToSupabase(order: Partial<Order>): SupabaseOrderRow {
  const addressLine = [
    order.shippingAddress?.street,
    order.shippingAddress?.apartment,
  ]
    .filter(Boolean)
    .join(', ');

  const trackingSteps = (order.timeline || [
    {
      status: 'Order Placed',
      title: 'Order Placed',
      description: 'Order confirmed and saved to Cloudberry & Supabase backend',
      timestamp: 'Just now',
    },
    {
      status: 'Processing',
      title: 'Studio Quality Inspection',
      description: 'Carefully wrapped in eco-friendly honeycomb paper & protective linen.',
      timestamp: 'Est. tomorrow',
    },
    {
      status: 'Shipped',
      title: 'Dispatched via Delhivery Express',
      description: 'In transit from Cloudberry Central Atelier.',
      timestamp: 'Est. 2-3 days',
    },
    {
      status: 'Delivered',
      title: 'Delivered to Doorstep',
      description: 'Contactless delivery with verification.',
      timestamp: 'Est. 4-5 days',
    },
  ]).map((t, idx) => ({
    date: t.timestamp || 'Pending',
    title: t.title || t.status,
    current: idx === 0,
    completed: idx === 0,
    description: t.description || '',
  }));

  const items = (order.items || []).map((it) => ({
    productId: it.productId,
    productName: it.productName,
    image: it.productImage || '',
    price: Number(it.price || 0),
    quantity: Number(it.quantity || 1),
    selectedColor: it.selectedColor || 'Default',
  }));

  const orderId = order.orderNumber || order.id || `CBH-${Math.floor(10000 + Math.random() * 90000)}`;

  return {
    id: orderId,
    user_id: order.userId || 'guest',
    customer_name: order.customerName || 'Valued Guest',
    email: order.customerEmail || 'customer@cloudberryhome.com',
    phone: order.customerPhone || '+91 98201 44521',
    address_line: addressLine || 'India',
    city: order.shippingAddress?.city || 'Mumbai',
    state: order.shippingAddress?.state || 'Maharashtra',
    pincode: order.shippingAddress?.pincode || '400050',
    items,
    subtotal: Number(order.subtotal || 0),
    shipping_fee: Number(order.shippingFee || 0),
    gst: 0,
    total: Number(order.total || 0),
    payment_method:
      order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay UPI / Card',
    payment_status: order.paymentMethod === 'cod' ? 'Pending (COD)' : 'Paid (Verified)',
    order_status: 'Placed',
    tracking_steps: trackingSteps,
    created_at: order.createdAt || new Date().toISOString(),
  };
}

/**
 * Saves order details directly into the Supabase \`orders\` table
 */
export async function saveOrderToSupabase(order: Partial<Order>) {
  try {
    const supabasePayload = mapOrderToSupabase(order);
    const { data, error } = await supabase
      .from('orders')
      .insert([supabasePayload])
      .select();

    if (error) {
      console.warn('Supabase insert notice:', error.message || error);
      return {
        success: false,
        error: error.message,
        code: error.code,
        projectRef: SUPABASE_PROJECT_REF,
        data: null,
      };
    }

    return {
      success: true,
      error: null,
      projectRef: SUPABASE_PROJECT_REF,
      data: data?.[0],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('Supabase client exception:', message);
    return {
      success: false,
      error: message,
      projectRef: SUPABASE_PROJECT_REF,
      data: null,
    };
  }
}
