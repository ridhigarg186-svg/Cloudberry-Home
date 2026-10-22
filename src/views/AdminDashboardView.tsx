import React, { useState } from 'react';
import {
  Shield,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  X,
  Truck,
  DollarSign,
  Search,
  Database,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, Order } from '../types';
import {
  SUPABASE_PROJECT_REF,
  SUPABASE_URL,
  SUPABASE_ORDERS_SQL,
} from '../lib/supabase';

export const AdminDashboardView: React.FC = () => {
  const {
    products,
    categories,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    showToast,
    setCurrentView,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'content'>('products');

  // Product Add / Edit Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Vases');
  const [prodPrice, setProdPrice] = useState(2499);
  const [prodOriginalPrice, setProdOriginalPrice] = useState(2999);
  const [prodStock, setProdStock] = useState(15);
  const [prodImageUrl, setProdImageUrl] = useState(
    'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1000&q=80'
  );
  const [prodShortDesc, setProdShortDesc] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodMaterial, setProdMaterial] = useState('Handcrafted Stoneware');
  const [prodDimensions, setProdDimensions] = useState('25 cm H x 16 cm W');
  const [prodOrigin, setProdOrigin] = useState('Jaipur, Rajasthan');

  // Filter & Search
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Order tracking update modal
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState<Order['status']>('Processing');
  const [newTrackingNo, setNewTrackingNo] = useState('');
  const [newCourier, setNewCourier] = useState('Delhivery Express Air');

  // Announcement Banner content
  const [bannerText, setBannerText] = useState(
    'Complimentary express delivery across India on orders over ₹1,999 · Use code CLOUDBERRY10 for 10% off'
  );

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const lowStockItems = products.filter((p) => p.stockCount <= 10);

  // Supabase Backend Connectivity State
  const [supabaseStatus, setSupabaseStatus] = useState<{
    loading: boolean;
    checked: boolean;
    connected?: boolean;
    tableExists?: boolean;
    rowsSampled?: number;
    message?: string;
  }>({ loading: false, checked: false });
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);

  const checkSupabaseConnection = async () => {
    setSupabaseStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/supabase/status');
      const data = await res.json();
      setSupabaseStatus({
        loading: false,
        checked: true,
        connected: data.connected,
        tableExists: data.tableExists,
        rowsSampled: data.rowsSampled,
        message: data.message || data.error,
      });
      if (data.tableExists) {
        showToast('Supabase orders table verified and actively syncing!');
      } else {
        showToast('Supabase connected! Copy SQL snippet to initialize public.orders table.');
      }
    } catch {
      setSupabaseStatus({
        loading: false,
        checked: true,
        connected: false,
        message: 'Could not contact server endpoint.',
      });
    }
  };

  const handleCopySql = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(SUPABASE_ORDERS_SQL);
    }
    setCopiedSql(true);
    showToast('Supabase table SQL copied to clipboard!');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const openAddProductModal = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory('Vases');
    setProdPrice(2499);
    setProdOriginalPrice(2999);
    setProdStock(15);
    setProdImageUrl('https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1000&q=80');
    setProdShortDesc('Handcrafted luxury home decor piece.');
    setProdDesc('Thoughtfully sculpted from natural clay for serene living spaces.');
    setProdMaterial('Handcrafted Stoneware');
    setProdDimensions('25 cm H x 16 cm W');
    setProdOrigin('Jaipur, Rajasthan');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdPrice(p.price);
    setProdOriginalPrice(p.originalPrice || Math.round(p.price * 1.15));
    setProdStock(p.stockCount);
    setProdImageUrl(p.images[0]);
    setProdShortDesc(p.shortDescription);
    setProdDesc(p.description);
    setProdMaterial(p.details.material);
    setProdDimensions(p.details.dimensions);
    setProdOrigin(p.details.origin);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const discount = prodOriginalPrice > prodPrice ? Math.round(((prodOriginalPrice - prodPrice) / prodOriginalPrice) * 100) : undefined;
    const data: Partial<Product> = {
      name: prodName,
      category: prodCategory,
      categorySlug: prodCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: Number(prodPrice),
      originalPrice: Number(prodOriginalPrice),
      discountPercent: discount,
      stockCount: Number(prodStock),
      inStock: Number(prodStock) > 0,
      images: [prodImageUrl],
      shortDescription: prodShortDesc,
      description: prodDesc,
      details: {
        dimensions: prodDimensions,
        material: prodMaterial,
        finish: 'Matte Bisque',
        care: 'Wipe with soft damp cloth',
        origin: prodOrigin,
      },
    };

    if (editingProductId) {
      await updateProduct(editingProductId, data);
    } else {
      await addProduct(data);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from Cloudberry Home catalog?`)) {
      deleteProduct(id);
    }
  };

  const handleOpenOrderDispatch = (order: Order) => {
    setEditingOrder(order);
    setNewOrderStatus(order.status);
    setNewTrackingNo(order.trackingNumber || `DEL-IN-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setNewCourier(order.courier || 'Delhivery Express Air');
  };

  const handleSaveOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    await updateOrderStatus(editingOrder.id, newOrderStatus, newTrackingNo, newCourier);
    setEditingOrder(null);
  };

  // Filtered Products
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status.toLowerCase() === orderStatusFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="bg-[#1E1610] text-[#FCFAF6] p-6 sm:p-8 rounded-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-[#2A1E17]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#C8A46B]">
              <Shield className="h-4 w-4" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">
                Cloudberry Studio Management
              </span>
            </div>
            <h1 className="font-serif text-3xl font-light text-[#FCFAF6]">
              Administrator Operations Dashboard
            </h1>
            <p className="text-xs text-[#D8CCC0] font-light">
              Full control over catalog inventory, orders, customer shipments, and website announcements.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('shop')}
            className="px-4 py-2 border border-[#C8A46B]/40 text-[#FCFAF6] text-xs uppercase tracking-wider font-medium rounded-xs hover:bg-[#2A1E17] cursor-pointer transition-colors"
          >
            View Live Storefront
          </button>
        </div>

        {/* 5 KPI Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="p-5 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[#6E6157]">
              <span className="text-xs font-medium uppercase tracking-wider">Total Sales</span>
              <DollarSign className="h-4 w-4 text-[#6D7E69]" />
            </div>
            <div className="font-sans text-2xl font-bold text-[#201610] tabular-nums">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-[#6D7E69] block font-medium">Verified receipts</span>
          </div>

          <div className="p-5 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[#6E6157]">
              <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
              <ShoppingBag className="h-4 w-4 text-[#C8A46B]" />
            </div>
            <div className="font-sans text-2xl font-bold text-[#201610] tabular-nums">
              {totalOrders}
            </div>
            <span className="text-[10px] text-[#6E6157] block">Razorpay & COD orders</span>
          </div>

          <div className="p-5 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[#6E6157]">
              <span className="text-xs font-medium uppercase tracking-wider">Avg Order Value</span>
              <TrendingUp className="h-4 w-4 text-[#6D7E69]" />
            </div>
            <div className="font-sans text-2xl font-bold text-[#201610] tabular-nums">
              ₹{avgOrderValue.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-[#6E6157] block">Per transaction</span>
          </div>

          <div className="p-5 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[#6E6157]">
              <span className="text-xs font-medium uppercase tracking-wider">Catalog Items</span>
              <Package className="h-4 w-4 text-[#6E6157]" />
            </div>
            <div className="font-sans text-2xl font-bold text-[#201610] tabular-nums">
              {products.length}
            </div>
            <span className="text-[10px] text-[#6E6157] block">Active categories</span>
          </div>

          <div className="p-5 bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[#6E6157]">
              <span className="text-xs font-medium uppercase tracking-wider">Low Stock</span>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="font-sans text-2xl font-bold text-amber-800 tabular-nums">
              {lowStockItems.length}
            </div>
            <span className="text-[10px] text-amber-800 block">Needs restocking</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E2D9CC] mb-6 space-x-8 text-xs font-medium uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`pb-3 transition-colors relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'products'
                ? 'text-[#201610] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#201610]'
                : 'text-[#6E6157] hover:text-[#201610]'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Manage Products ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 transition-colors relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'text-[#201610] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#201610]'
                : 'text-[#6E6157] hover:text-[#201610]'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Orders & Shipments ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`pb-3 transition-colors relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'content'
                ? 'text-[#201610] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#201610]'
                : 'text-[#6E6157] hover:text-[#201610]'
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>Website Announcements & Banners</span>
          </button>
        </div>

        {/* Tab 1: Products Management */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8C7D73]" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by title or category..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FCFAF6] border border-[#E2D9CC] rounded-xs focus:border-[#2A1E17] focus:outline-none text-[#201610]"
                />
              </div>

              <button
                type="button"
                onClick={openAddProductModal}
                className="px-5 py-2.5 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#3D2C22] transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Decor Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F2ECE1] text-[#201610] uppercase text-[10px] tracking-wider border-b border-[#E2D9CC]">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price (₹)</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2D9CC] text-[#201610]">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF6F0] transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="h-10 w-10 rounded-xs object-cover bg-[#EDE7DE] border border-[#E2D9CC]"
                          />
                          <div>
                            <span className="font-serif font-medium text-sm block">{p.name}</span>
                            <span className="text-[10px] text-[#6E6157] font-mono">{p.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{p.category}</td>
                        <td className="py-3 px-4 font-sans font-semibold tabular-nums">
                          ₹{p.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span
                            className={
                              p.stockCount <= 5
                                ? 'text-amber-700 font-bold'
                                : 'text-emerald-800'
                            }
                          >
                            {p.stockCount} units
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {p.inStock ? (
                            <span className="text-[10px] bg-[#6D7E69]/15 text-[#6D7E69] px-2 py-0.5 rounded-xs font-semibold uppercase tracking-wider">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-xs font-semibold uppercase tracking-wider">
                              Sold Out
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => openEditProductModal(p)}
                            className="p-1.5 text-[#483D35] hover:text-[#201610] hover:bg-[#EDE7DE] rounded-xs cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xs cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders & Dispatch */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Supabase backend connection status */}
            <div className="p-4 bg-[#FCFAF6] border border-[#E2D9CC] rounded-xl shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#6D7E69]/15 flex items-center justify-center text-[#201610] border border-[#6D7E69]/30">
                    <Database className="h-5 w-5 text-[#6D7E69]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base text-[#201610] font-medium">Supabase Backend Sync</span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#6D7E69]/15 text-[#201610] text-[10px] font-semibold tracking-wide border border-[#6D7E69]/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#6D7E69] animate-pulse"></span>
                        Active
                      </span>
                    </div>
                    <p className="text-[#483D35] text-xs mt-0.5 font-light">
                      Project Ref: <span className="font-mono font-medium text-[#201610] bg-[#F2ECE1] px-1.5 py-0.5 rounded-xs">{SUPABASE_PROJECT_REF}</span> · Table: <span className="font-mono text-[#201610]">public.orders</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={checkSupabaseConnection}
                    disabled={supabaseStatus.loading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#FAF6F0] border border-[#E2D9CC] hover:border-[#2A1E17] text-[#201610] rounded-xs font-medium cursor-pointer transition-colors"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 text-[#6E6157] ${supabaseStatus.loading ? 'animate-spin' : ''}`} />
                    <span>{supabaseStatus.loading ? 'Checking...' : 'Test Connection'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSqlModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#2A1E17] text-[#FAF6F0] hover:bg-[#3D2C22] rounded-xs font-medium cursor-pointer transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5 text-[#C8A46B]" />
                    <span>Copy Schema SQL</span>
                  </button>
                </div>
              </div>

              {/* Status message or inspection feedback */}
              {supabaseStatus.checked && (
                <div className={`p-2.5 rounded-lg text-xs flex items-center justify-between border ${
                  supabaseStatus.connected ? 'bg-[#6D7E69]/10 border-[#6D7E69]/30 text-[#201610]' : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <span className="font-light">{supabaseStatus.message}</span>
                    {supabaseStatus.rowsSampled !== undefined && (
                      <span className="text-[11px] font-mono text-[#6E6157]">({supabaseStatus.rowsSampled} orders verified)</span>
                    )}
                  </div>
                  <a
                    href="https://supabase.com/dashboard/project/dkursaukdesmrnyuxjvt/sql/new"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] underline font-medium text-[#201610] hover:text-[#C8A46B]"
                  >
                    <span>Supabase SQL Editor</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[#6E6157] uppercase tracking-wider font-medium">Filter By Status:</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {(['all', 'Pending', 'Processing', 'Shipped', 'Delivered'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1 rounded-xs border transition-colors cursor-pointer ${
                      orderStatusFilter === st
                        ? 'bg-[#2A1E17] text-[#FAF6F0] border-[#2A1E17]'
                        : 'bg-[#FCFAF6] text-[#483D35] border-[#E2D9CC] hover:border-[#2A1E17]'
                    }`}
                  >
                    {st === 'all' ? 'All Orders' : st}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#FCFAF6] rounded-xl border border-[#E2D9CC] overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F2ECE1] text-[#201610] uppercase text-[10px] tracking-wider border-b border-[#E2D9CC]">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total (₹)</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Fulfillment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2D9CC] text-[#201610]">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FAF6F0] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium block">{ord.customerName}</span>
                          <span className="text-[10px] text-[#6E6157]">{ord.customerEmail}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold">{ord.items.length} items</span>
                          <span className="text-[10px] text-[#6E6157] block truncate max-w-xs">
                            {ord.items.map((i) => i.productName).join(', ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-sans font-bold tabular-nums">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[10px] uppercase font-semibold text-[#483D35]">
                            {ord.paymentMethod === 'razorpay' ? 'Razorpay' : 'COD'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
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
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenOrderDispatch(ord)}
                            className="px-3 py-1.5 bg-[#EDE7DE] hover:bg-[#E2D9CC] text-[#201610] text-xs font-semibold rounded-xs transition-colors cursor-pointer"
                          >
                            Update Dispatch
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Website Content & Banners */}
        {activeTab === 'content' && (
          <div className="bg-[#FCFAF6] p-6 sm:p-8 rounded-xl border border-[#E2D9CC] space-y-6 max-w-3xl shadow-2xs">
            <h2 className="font-serif text-xl text-[#201610]">Storefront Announcements</h2>
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#201610]">
                Top Promotional Announcement Banner Text
              </label>
              <textarea
                rows={2}
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                className="w-full p-3 text-xs bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs focus:border-[#2A1E17] focus:outline-none text-[#201610]"
              />
              <p className="text-[10px] text-[#6E6157]">
                Shown in the top announcement bar on every page.
              </p>
            </div>

            <button
              type="button"
              onClick={() => showToast('Banner text saved successfully.')}
              className="px-6 py-2.5 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#3D2C22] cursor-pointer"
            >
              Save Announcement Banner
            </button>
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#FCFAF6] rounded-xl shadow-2xl border border-[#E2D9CC] overflow-hidden max-h-[92vh] flex flex-col">
            <div className="p-6 border-b border-[#E2D9CC] flex items-center justify-between">
              <h3 className="font-serif text-xl text-[#201610]">
                {editingProductId ? 'Edit Product' : 'Add New Home Decor Piece'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE7DE] text-[#201610] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-medium text-[#201610]">Product Title</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Fluted Alabaster Table Lamp"
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#201610]">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-medium text-[#201610]">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#201610]">Original Price (₹)</label>
                  <input
                    type="number"
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#201610]">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#201610]">Image URL</label>
                <input
                  type="url"
                  required
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#201610]">Short Summary</label>
                <input
                  type="text"
                  value={prodShortDesc}
                  onChange={(e) => setProdShortDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#201610]">Editorial Description</label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-[#201610]">Material</label>
                  <input
                    type="text"
                    value={prodMaterial}
                    onChange={(e) => setProdMaterial(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[#201610]">Dimensions</label>
                  <input
                    type="text"
                    value={prodDimensions}
                    onChange={(e) => setProdDimensions(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[#201610]">Origin Guild</label>
                  <input
                    type="text"
                    value={prodOrigin}
                    onChange={(e) => setProdOrigin(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#E2D9CC]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-[#E2D9CC] text-[#201610] rounded-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2A1E17] text-[#FAF6F0] hover:bg-[#3D2C22] rounded-xs font-semibold uppercase tracking-wider cursor-pointer shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Dispatch Update Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FCFAF6] rounded-xl shadow-2xl border border-[#E2D9CC] overflow-hidden">
            <div className="p-6 border-b border-[#E2D9CC] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#6E6157] uppercase tracking-wider block">
                  Update Fulfillment
                </span>
                <h3 className="font-serif text-lg text-[#201610]">Order {editingOrder.orderNumber}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE7DE] text-[#201610] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOrderStatus} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-[#201610]">Order Status</label>
                <select
                  value={newOrderStatus}
                  onChange={(e) => setNewOrderStatus(e.target.value as Order['status'])}
                  className="w-full px-3 py-2 border border-[#E2D9CC] rounded-xs bg-[#FAF6F0] text-[#201610]"
                >
                  <option value="Pending">Pending Verification</option>
                  <option value="Processing">Processing / Packing</option>
                  <option value="Shipped">Shipped in Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#201610]">Courier Partner</label>
                <input
                  type="text"
                  value={newCourier}
                  onChange={(e) => setNewCourier(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2D9CC] rounded-xs bg-[#FAF6F0] text-[#201610]"
                  placeholder="Delhivery Express Air, BlueDart, DTDC"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#201610]">AWB Tracking Number</label>
                <input
                  type="text"
                  value={newTrackingNo}
                  onChange={(e) => setNewTrackingNo(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2D9CC] rounded-xs bg-[#FAF6F0] font-mono text-[#201610]"
                  placeholder="DEL-IN-8912401"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#E2D9CC]">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 border border-[#E2D9CC] text-[#201610] rounded-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2A1E17] text-[#FAF6F0] hover:bg-[#3D2C22] rounded-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Update & Notify Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supabase Schema SQL Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-[#201610]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FCFAF6] w-full max-w-2xl rounded-2xl border border-[#E2D9CC] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-[#E2D9CC] flex items-center justify-between bg-[#F2ECE1]">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#2A1E17] text-[#FAF6F0] flex items-center justify-center">
                  <Database className="h-4 w-4 text-[#C8A46B]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#201610] font-medium">Supabase Backend Schema SQL</h3>
                  <p className="text-xs text-[#6E6157] font-light">
                    Project <span className="font-mono text-[#201610] font-medium">{SUPABASE_PROJECT_REF}</span> · Table: <span className="font-mono">public.orders</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="h-8 w-8 rounded-full hover:bg-[#E2D9CC] text-[#201610] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E2D9CC] space-y-2 text-[#483D35] leading-relaxed">
                <p className="font-medium text-[#201610]">
                  How to initialize your Supabase table in 30 seconds:
                </p>
                <ol className="list-decimal list-inside space-y-1 font-light">
                  <li>Click <strong>Copy SQL Query</strong> below.</li>
                  <li>Open the <a href="https://supabase.com/dashboard/project/dkursaukdesmrnyuxjvt/sql/new" target="_blank" rel="noreferrer" className="text-[#C8A46B] font-medium underline inline-flex items-center gap-0.5">Supabase SQL Editor <ExternalLink className="h-3 w-3" /></a> for project <code className="bg-[#E2D9CC] px-1 py-0.5 rounded-xs text-[#201610]">{SUPABASE_PROJECT_REF}</code>.</li>
                  <li>Paste the SQL and click <strong>Run</strong>. That&apos;s it! Orders from checkout will save seamlessly.</li>
                </ol>
              </div>

              <div className="relative">
                <pre className="p-4 bg-[#201610] text-[#FAF6F0] font-mono text-[11px] rounded-xl overflow-x-auto border border-[#2A1E17] leading-relaxed max-h-72">
                  {SUPABASE_ORDERS_SQL}
                </pre>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-[#C8A46B] text-[#201610] text-xs font-semibold rounded-xs shadow-md hover:bg-[#D4B582] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#201610]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[#201610]" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-[#E2D9CC] bg-[#F2ECE1] flex items-center justify-between">
              <span className="text-[11px] text-[#6E6157]">
                Endpoint: <span className="font-mono text-[#201610]">{SUPABASE_URL}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSqlModal(false)}
                  className="px-4 py-2 border border-[#E2D9CC] bg-[#FCFAF6] text-[#201610] rounded-xs font-medium cursor-pointer hover:bg-[#FAF6F0] transition-colors"
                >
                  Close
                </button>
                <a
                  href="https://supabase.com/dashboard/project/dkursaukdesmrnyuxjvt/sql/new"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#2A1E17] text-[#FAF6F0] rounded-xs font-medium cursor-pointer hover:bg-[#3D2C22] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Open Supabase Dashboard</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#C8A46B]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
