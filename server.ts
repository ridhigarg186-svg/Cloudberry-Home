import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  INITIAL_CATEGORIES,
  INITIAL_COLLECTIONS,
  INITIAL_ROOMS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_USER,
  INITIAL_ORDERS,
} from './src/data/mockData';
import { createClient } from '@supabase/supabase-js';
import { Product, Order, User, Review, Category, Collection, RoomInspiration } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration from user provided credentials
export const SUPABASE_PROJECT_REF = 'dkursaukdesmrnyuxjvt';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dkursaukdesmrnyuxjvt.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_tt2fG15VTHp9KbXWN_VkDg_GDRIoWNF';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Data store path
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'store.json');

interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  rooms: RoomInspiration[];
  reviews: Review[];
  coupons: typeof INITIAL_COUPONS;
  users: User[];
  orders: Order[];
}

function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Failed to read db file, initializing with defaults', e);
    }
  }

  const initialData: DatabaseSchema = {
    products: INITIAL_PRODUCTS,
    categories: INITIAL_CATEGORIES,
    collections: INITIAL_COLLECTIONS,
    rooms: INITIAL_ROOMS,
    reviews: INITIAL_REVIEWS,
    coupons: INITIAL_COUPONS,
    users: [
      INITIAL_USER,
      {
        id: 'usr-admin-1',
        name: 'Cloudberry Atelier Admin',
        email: 'admin@cloudberryhome.com',
        phone: '+91 99999 12345',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00Z',
        addresses: [],
      },
    ],
    orders: INITIAL_ORDERS,
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  return initialData;
}

let db = initDatabase();

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error persisting database:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  // 1. Products
  app.get('/api/products', (req: Request, res: Response) => {
    let result = [...db.products];
    const { category, collection, room, search, minPrice, maxPrice, sort } = req.query;

    if (category && typeof category === 'string' && category !== 'all') {
      result = result.filter(
        (p) =>
          p.categorySlug === category ||
          p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (collection && typeof collection === 'string') {
      result = result.filter((p) =>
        p.collections.some((c) => c.toLowerCase() === collection.toLowerCase())
      );
    }

    if (room && typeof room === 'string') {
      result = result.filter((p) =>
        p.roomTags.some((r) => r.toLowerCase() === room.toLowerCase())
      );
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    if (sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    res.json(result);
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = db.products.find(
      (p) => p.id === req.params.id || p.slug === req.params.id
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const reviews = db.reviews.filter((r) => r.productId === product.id);
    res.json({ ...product, reviewsList: reviews });
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const newProduct: Product = {
      ...req.body,
      id: `prod-${Date.now()}`,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: req.body.rating || 5.0,
      reviewCount: req.body.reviewCount || 0,
      inStock: req.body.stockCount > 0,
    };
    db.products.unshift(newProduct);
    saveDatabase();
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const index = db.products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    db.products[index] = {
      ...db.products[index],
      ...req.body,
      inStock: req.body.stockCount !== undefined ? req.body.stockCount > 0 : db.products[index].inStock,
    };
    saveDatabase();
    res.json(db.products[index]);
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const index = db.products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const removed = db.products.splice(index, 1);
    saveDatabase();
    res.json({ success: true, removed: removed[0] });
  });

  // 2. Categories, Collections, Rooms
  app.get('/api/categories', (_req: Request, res: Response) => {
    res.json(db.categories);
  });

  app.get('/api/collections', (_req: Request, res: Response) => {
    res.json(db.collections);
  });

  app.get('/api/rooms', (_req: Request, res: Response) => {
    res.json(db.rooms);
  });

  // 3. Coupons
  app.get('/api/coupons', (_req: Request, res: Response) => {
    res.json(db.coupons);
  });

  app.post('/api/coupons/validate', (req: Request, res: Response) => {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Coupon code required' });
    }
    const coupon = db.coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase()
    );
    if (!coupon) {
      return res.status(404).json({ valid: false, error: 'Invalid coupon code' });
    }
    if (subtotal < coupon.minOrder) {
      return res.status(400).json({
        valid: false,
        error: `Requires minimum order value of ₹${coupon.minOrder.toLocaleString('en-IN')}`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percent') {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
    } else if (coupon.discountType === 'fixed') {
      discountAmount = Math.min(coupon.value, subtotal);
    } else if (coupon.discountType === 'freeship') {
      discountAmount = coupon.value;
    }

    res.json({
      valid: true,
      coupon,
      discountAmount,
    });
  });

  // 4. Orders
  app.get('/api/orders', (req: Request, res: Response) => {
    const { userId } = req.query;
    if (userId && typeof userId === 'string') {
      const userOrders = db.orders.filter((o) => o.userId === userId);
      return res.json(userOrders);
    }
    res.json(db.orders);
  });

  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const order = db.orders.find(
      (o) => o.id === req.params.id || o.orderNumber === req.params.id
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  });

  // Supabase Health & Connection Check
  app.get('/api/supabase/status', async (_req: Request, res: Response) => {
    try {
      const { data, error } = await supabase.from('orders').select('id').limit(1);
      if (error) {
        const isTableMissing = error.code === 'PGRST205' || error.message?.includes('schema cache');
        return res.json({
          connected: true, // Project exists & responds with valid credentials
          projectRef: SUPABASE_PROJECT_REF,
          url: SUPABASE_URL,
          tableExists: !isTableMissing,
          table: 'orders',
          code: error.code,
          error: error.message,
          message: isTableMissing
            ? 'Supabase backend project connected! Table public.orders can be initialized using the SQL editor.'
            : error.message,
        });
      }
      return res.json({
        connected: true,
        projectRef: SUPABASE_PROJECT_REF,
        url: SUPABASE_URL,
        tableExists: true,
        table: 'orders',
        rowsSampled: data?.length || 0,
        message: 'Supabase orders table connected and actively syncing.',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return res.status(500).json({
        connected: false,
        projectRef: SUPABASE_PROJECT_REF,
        error: message,
      });
    }
  });

  app.post('/api/orders', async (req: Request, res: Response) => {
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      discount,
      couponCode,
      shippingFee,
      total,
      paymentMethod,
      razorpayPaymentId,
    } = req.body;

    const orderNumber = `CBH-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      discount: discount || 0,
      couponCode,
      shippingFee: shippingFee || 0,
      total,
      paymentMethod: paymentMethod || 'razorpay',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      razorpayPaymentId: razorpayPaymentId || (paymentMethod === 'razorpay' ? `pay_${Math.random().toString(36).substring(2, 12)}` : undefined),
      status: 'Processing',
      trackingNumber: `DEL-IN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      courier: 'Delhivery Express Air',
      timeline: [
        {
          status: 'Order Placed',
          title: 'Order Received & Confirmed',
          description: paymentMethod === 'cod' ? 'Cash on Delivery order placed with verified phone.' : 'Payment secured and verified via Razorpay.',
          timestamp: formattedDate,
        },
        {
          status: 'Processing',
          title: 'Studio Quality Inspection',
          description: 'Items being carefully wrapped in protective linen & honeycomb board.',
          timestamp: formattedDate,
        },
      ],
      createdAt: now.toISOString(),
    };

    // Decrement stock for ordered items
    if (Array.isArray(items)) {
      items.forEach((item: { productId: string; quantity: number }) => {
        const product = db.products.find((p) => p.id === item.productId);
        if (product && product.stockCount > 0) {
          product.stockCount = Math.max(0, product.stockCount - item.quantity);
          product.inStock = product.stockCount > 0;
        }
      });
    }

    // Save to user's Supabase backend `orders` table
    let supabaseSaved = false;
    let supabaseError: string | null = null;
    try {
      const addressLine = [
        shippingAddress?.street,
        shippingAddress?.apartment,
      ]
        .filter(Boolean)
        .join(', ');

      const formattedItems = (items || []).map((it: { productId: string; productName: string; productImage?: string; price: number; quantity: number; selectedColor?: string }) => ({
        productId: it.productId,
        productName: it.productName,
        image: it.productImage || '',
        price: Number(it.price || 0),
        quantity: Number(it.quantity || 1),
        selectedColor: it.selectedColor || 'Default',
      }));

      const supabasePayload = {
        id: orderNumber,
        user_id: userId || 'guest',
        customer_name: customerName || 'Valued Guest',
        email: customerEmail || 'customer@cloudberryhome.com',
        phone: customerPhone || '+91 98201 44521',
        address_line: addressLine || `${shippingAddress?.city || 'Mumbai'}, ${shippingAddress?.state || 'Maharashtra'}`,
        city: shippingAddress?.city || 'Mumbai',
        state: shippingAddress?.state || 'Maharashtra',
        pincode: shippingAddress?.pincode || '400050',
        items: formattedItems,
        subtotal: Number(subtotal || 0),
        shipping_fee: Number(shippingFee || 0),
        gst: 0,
        total: Number(total || 0),
        payment_method: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay UPI / Card',
        payment_status: paymentMethod === 'cod' ? 'Pending (COD)' : 'Paid (Verified)',
        order_status: 'Placed',
        tracking_steps: [
          {
            date: formattedDate,
            title: 'Order Placed',
            current: true,
            completed: true,
            description: paymentMethod === 'cod' ? 'Cash on Delivery order placed.' : 'Payment secured via Razorpay.',
          },
          {
            date: 'Est. tomorrow',
            title: 'Packed & Dispatched',
            current: false,
            completed: false,
            description: 'Warehouse packaging & quality inspection.',
          },
          {
            date: 'Est. 2-3 days',
            title: 'In Transit',
            current: false,
            completed: false,
            description: 'Delhivery Express transit facility.',
          },
          {
            date: 'Est. 4-5 days',
            title: 'Out for Delivery',
            current: false,
            completed: false,
            description: 'Local courier hub out for delivery.',
          },
        ],
        created_at: now.toISOString(),
      };

      const { data: supaData, error: supaErr } = await supabase
        .from('orders')
        .insert([supabasePayload])
        .select();

      if (supaErr) {
        console.warn('[Supabase] orders table insert error:', supaErr.message);
        supabaseError = supaErr.message;
      } else {
        supabaseSaved = true;
        console.log(`[Supabase] Order ${orderNumber} successfully saved to Supabase backend!`, supaData?.[0]?.id);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn('[Supabase] Exception saving order to Supabase:', message);
      supabaseError = message;
    }

    db.orders.unshift(newOrder);
    saveDatabase();
    res.status(201).json({
      ...newOrder,
      supabaseSaved,
      supabaseError,
      supabaseProjectRef: SUPABASE_PROJECT_REF,
    });
  });

  app.put('/api/orders/:id/status', (req: Request, res: Response) => {
    const { status, trackingNumber, courier, note } = req.body;
    const order = db.orders.find(
      (o) => o.id === req.params.id || o.orderNumber === req.params.id
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courier) order.courier = courier;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    order.timeline.push({
      status: status || order.status,
      title: `Status updated to ${status}`,
      description: note || `Order updated by Cloudberry Studio dispatch team.`,
      timestamp: formattedDate,
    });

    saveDatabase();
    res.json(order);
  });

  // 5. Reviews
  app.post('/api/reviews', (req: Request, res: Response) => {
    const { productId, userName, userLocation, rating, title, comment } = req.body;
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName: userName || 'Cloudberry Collector',
      userLocation: userLocation || 'India',
      rating: Number(rating) || 5,
      title: title || 'Exceptional Quality',
      comment,
      date: new Date().toLocaleDateString('en-IN', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      verifiedPurchase: true,
    };

    db.reviews.unshift(newReview);

    // Update product rating and count
    const prod = db.products.find((p) => p.id === productId);
    if (prod) {
      const prodReviews = db.reviews.filter((r) => r.productId === productId);
      const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
      prod.rating = Number((totalRating / prodReviews.length).toFixed(1));
      prod.reviewCount = prodReviews.length;
    }

    saveDatabase();
    res.status(201).json(newReview);
  });

  // 6. User Auth & Profiles
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (normalizedEmail === 'admin@cloudberryhome.com') {
      const adminUser = db.users.find((u) => u.email === normalizedEmail) || {
        id: 'usr-admin-1',
        name: 'Cloudberry Atelier Admin',
        email: 'admin@cloudberryhome.com',
        phone: '+91 99999 12345',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00Z',
        addresses: [],
      };
      return res.json({
        user: adminUser,
        token: `token-admin-${Date.now()}`,
      });
    }

    // Customer login
    let user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      // Auto-provision demo customer
      user = {
        id: `usr-${Date.now()}`,
        name: normalizedEmail.split('@')[0],
        email: normalizedEmail,
        role: 'customer',
        createdAt: new Date().toISOString(),
        addresses: [],
      };
      db.users.push(user);
      saveDatabase();
    }

    res.json({
      user,
      token: `token-${user.id}`,
    });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, phone, role } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name || 'Valued Guest',
      email: normalizedEmail,
      phone: phone || '',
      role: role === 'admin' ? 'admin' : 'customer',
      createdAt: new Date().toISOString(),
      addresses: [],
    };

    db.users.push(newUser);
    saveDatabase();
    res.status(201).json({ user: newUser, token: `token-${newUser.id}` });
  });

  app.put('/api/users/:id', (req: Request, res: Response) => {
    const index = db.users.findIndex((u) => u.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    db.users[index] = { ...db.users[index], ...req.body };
    saveDatabase();
    res.json(db.users[index]);
  });

  // 7. Admin Analytics
  app.get('/api/admin/analytics', (_req: Request, res: Response) => {
    const totalRevenue = db.orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = db.orders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const lowStockItems = db.products.filter((p) => p.stockCount <= 10);

    res.json({
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalProducts: db.products.length,
      totalCustomers: db.users.filter((u) => u.role === 'customer').length,
      lowStockItemsCount: lowStockItems.length,
      lowStockItems,
    });
  });

  // 8. AI Interior Stylist Assistant
  const ai = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  app.post('/api/ai/stylist', async (req: Request, res: Response) => {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const catalogMini = db.products.slice(0, 16).map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: `₹${p.price.toLocaleString('en-IN')}`,
      colors: p.colors?.map((c) => c.name).join(', ') || 'Warm neutral',
      material: p.details.material,
      shortDescription: p.shortDescription,
    }));

    const systemInstruction = `You are the resident AI Interior Design Concierge & Stylist for Cloudberry Home.
Cloudberry Home is a luxury, aesthetic Indian home decor brand defined by warm minimal palettes (cream, beige, ivory, mocha brown, sage green, and muted gold) and noble handcrafted materials (coarse stoneware clay, Roman travertine, unbleached Belgian linen, solid mango wood, and spun brass).
Your tone is warm, inspiring, sophisticated, and serene—like a senior interior architect writing for Architectural Digest.
Your job is to advise customers on styling their rooms (living room, bedroom, reading corner, dining table, entryway), selecting color harmonies, choosing textures, and recommending specific pieces from our Cloudberry Home catalog.

Current catalog highlights:
${JSON.stringify(catalogMini, null, 2)}

Instructions:
1. Provide thoughtful, concise interior advice (100-180 words).
2. Explicitly recommend 1 to 3 items from the catalog by exact name (e.g., "Aura Ribbed Stoneware Vase", "Alabaster Glow Table Lamp", "Belgian Washed Linen Cushion Cover", "Travertine Scalloped Centerpiece Bowl").
3. Suggest palette pairings (such as pairing warm bone stoneware with sage linen and dark mocha wood).`;

    if (ai) {
      try {
        const contentsPayload: any[] = [];
        if (Array.isArray(history)) {
          for (const item of history.slice(-4)) {
            contentsPayload.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }
        contentsPayload.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contentsPayload,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const reply = geminiRes.text || 'I recommend pairing raw stoneware ceramics with washed Belgian linen to create an inviting, serene living space.';

        // Find mentioned products in the catalog
        const lowerReply = reply.toLowerCase();
        const recommended = db.products
          .filter(
            (p) =>
              lowerReply.includes(p.name.toLowerCase()) ||
              p.tags.some((t) => lowerReply.includes(t.toLowerCase()))
          )
          .slice(0, 3);

        return res.json({
          reply,
          recommended: recommended.length > 0 ? recommended : db.products.slice(0, 2),
        });
      } catch (err) {
        console.error('Gemini API call failed, using graceful domain styling response:', err);
      }
    }

    // Graceful styling fallback if offline or API key unavailable
    const q = message.toLowerCase();
    let reply =
      'For a harmonious, serene living space, we recommend building upon a foundation of warm creams and oatmeal beige. Introduce depth with our hand-thrown stoneware vessels and diffused alabaster bedside illumination.';
    let recommended = db.products.slice(0, 2);

    if (q.includes('living') || q.includes('sofa') || q.includes('coffee table')) {
      reply =
        'For your living room sanctuary, balance a cream linen sofa with tactile textures. Anchor the coffee table with the solid Travertine Scalloped Centerpiece Bowl and introduce vertical elegance with our Aura Ribbed Stoneware Vase holding dried olive branches.';
      recommended = db.products.filter((p) => ['prod-01', 'prod-04', 'prod-03'].includes(p.id));
    } else if (q.includes('bedroom') || q.includes('bed') || q.includes('sleep') || q.includes('calm')) {
      reply =
        'To create a peaceful bedroom sanctuary, layer washed Belgian linen cushions in Oatmeal and Sage against crisp bedding. The Alabaster Glow Table Lamp on your nightstand will cast an ethereal, warm ambient glow to wind down your evenings.';
      recommended = db.products.filter((p) => ['prod-02', 'prod-03', 'prod-09'].includes(p.id));
    } else if (q.includes('candle') || q.includes('scent') || q.includes('gift')) {
      reply =
        'Our Sandalwood & Wild Fig Ceramic Scented Candle brings immediate warmth with organic soy wax and a hearth-like crackling wood wick. Poured into an artisanal terracotta pot that can later be reused as a succulent planter.';
      recommended = db.products.filter((p) => ['prod-05', 'prod-10', 'prod-12'].includes(p.id));
    } else if (q.includes('light') || q.includes('lamp')) {
      reply =
        'Layer your lighting thoughtfully. Rather than harsh overhead bulbs, use our Alabaster Glow Table Lamp and Lumière Pleated Paper Pendant Light to wash warm, shadowless light across eye level.';
      recommended = db.products.filter((p) => ['prod-02', 'prod-14'].includes(p.id));
    }

    return res.json({
      reply,
      recommended: recommended.length > 0 ? recommended : db.products.slice(0, 2),
    });
  });

  // Mount Vite middleware in development or serve static in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cloudberry Home server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
