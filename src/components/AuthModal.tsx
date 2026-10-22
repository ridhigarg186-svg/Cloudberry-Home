import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, Shield, ArrowRight, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, setCurrentView } = useShop();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'forgot') {
      setTimeout(() => {
        setForgotSent(true);
        setLoading(false);
      }, 700);
      return;
    }

    const success = await login(email, email.includes('admin') ? 'admin' : 'customer');
    setLoading(false);
    if (success) {
      setIsAuthModalOpen(false);
      if (email.includes('admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('account');
      }
    }
  };

  const handleQuickDemoCustomer = async () => {
    setEmail('ridhig211@gmail.com');
    setPassword('customer123');
    setLoading(true);
    await login('ridhig211@gmail.com', 'customer');
    setLoading(false);
    setIsAuthModalOpen(false);
    setCurrentView('account');
  };

  const handleQuickDemoAdmin = async () => {
    setEmail('admin@cloudberryhome.com');
    setPassword('admin123');
    setLoading(true);
    await login('admin@cloudberryhome.com', 'admin');
    setLoading(false);
    setIsAuthModalOpen(false);
    setCurrentView('admin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF6F0] shadow-2xl rounded-xl border border-[#E2D9CC] overflow-hidden">
        {/* Close */}
        <button
          type="button"
          onClick={() => {
            setIsAuthModalOpen(false);
            setForgotSent(false);
          }}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE7DE] text-[#201610] hover:bg-[#E2D9CC] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="p-6 md:p-8 bg-[#FCFAF6] border-b border-[#E2D9CC] text-center">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A46B] font-semibold block mb-1">
            Cloudberry Home
          </span>
          <h2 className="font-serif text-2xl font-normal text-[#201610]">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Join Cloudberry Atelier'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="text-xs text-[#483D35] mt-1 font-light">
            {mode === 'login' && 'Sign in to access your saved addresses & order tracking'}
            {mode === 'register' && 'Create your customer profile for bespoke living'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {/* Demo Fast-Login Strip for Evaluation */}
        <div className="bg-[#F5F0E6] p-4 border-b border-[#E2D9CC] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#6E6157]">
            <span className="font-medium uppercase tracking-wider">Fast Demo Access</span>
            <span className="text-[10px]">One-click test accounts</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDemoCustomer}
              className="px-3 py-2 bg-[#FCFAF6] hover:bg-[#EDE7DE] border border-[#E2D9CC] rounded-xs text-left text-xs transition-colors group cursor-pointer"
            >
              <div className="font-medium text-[#201610] flex items-center justify-between">
                <span>Ridhi Gupta</span>
                <UserIcon className="h-3 w-3 text-[#C8A46B]" />
              </div>
              <span className="text-[10px] text-[#6E6157] block">Customer Profile</span>
            </button>

            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="px-3 py-2 bg-[#2A1E17] hover:bg-[#3D2C22] text-[#FAF6F0] rounded-xs text-left text-xs transition-colors group cursor-pointer"
            >
              <div className="font-medium flex items-center justify-between text-[#FAF6F0]">
                <span>Admin Portal</span>
                <Shield className="h-3 w-3 text-[#C8A46B]" />
              </div>
              <span className="text-[10px] text-[#EDE7DE] block">Manage Store & Orders</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8 space-y-5 bg-[#FAF6F0]">
          {forgotSent ? (
            <div className="text-center py-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-[#8A9A86]/20 text-[#6D7E69] flex items-center justify-center mx-auto">
                <Check className="h-6 w-6" />
              </div>
              <p className="font-serif text-lg text-[#201610]">Password Reset Email Sent</p>
              <p className="text-xs text-[#483D35] leading-relaxed">
                We've sent a secure recovery link to <strong>{email}</strong>. Please check your inbox or use our instant demo sign-in above.
              </p>
              <button
                type="button"
                onClick={() => {
                  setForgotSent(false);
                  setMode('login');
                }}
                className="text-xs font-semibold text-[#201610] hover:text-[#C8A46B] transition-colors cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#201610]">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-[#8A7C70]" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ridhi Gupta"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#FCFAF6] border border-[#E2D9CC] rounded-xs text-[#201610] focus:border-[#201610] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#201610]">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-[#8A7C70]" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98201 44521"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#FCFAF6] border border-[#E2D9CC] rounded-xs text-[#201610] focus:border-[#201610] focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#201610]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#8A7C70]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#FCFAF6] border border-[#E2D9CC] rounded-xs text-[#201610] focus:border-[#201610] focus:outline-none"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[#201610]">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-[#6E6157] hover:text-[#201610] transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#8A7C70]" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#FCFAF6] border border-[#E2D9CC] rounded-xs text-[#201610] focus:border-[#201610] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#2A1E17] text-[#FAF6F0] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#3D2C22] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <span>
                  {loading
                    ? 'Processing...'
                    : mode === 'login'
                    ? 'Sign In to Account'
                    : mode === 'register'
                    ? 'Create My Account'
                    : 'Send Reset Link'}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-[#C8A46B]" />
              </button>
            </form>
          )}

          {/* Mode Switcher */}
          <div className="text-center pt-2 border-t border-[#E2D9CC] text-xs text-[#483D35]">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-semibold text-[#201610] hover:text-[#C8A46B] transition-colors cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-[#201610] hover:text-[#C8A46B] transition-colors cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
