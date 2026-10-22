import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, User as UserIcon, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommended?: Product[];
}

export const AiAssistantModal: React.FC = () => {
  const { setSelectedProductId, setCurrentView, addToCart } = useShop();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Welcome to Cloudberry Home. I am your resident AI Interior Stylist. How may I assist you in harmonizing your space with warm neutrals, stoneware, and ambient lighting today?',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'How do I style a living room with a cream sofa?',
    'What lighting is best for a serene bedroom?',
    'Recommend ceramic vases for dining table',
    'Which cushion covers pair with mocha tones?',
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/ai/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend.trim(), history: historyPayload }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          recommended: data.recommended,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('API error');
      }
    } catch {
      // Graceful fallback
      const fallbackMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: 'For a balanced aesthetic, we suggest anchoring your space with tactile stoneware and layering washed Belgian linen cushions in Oatmeal and Sage. The warm ambient glow of an alabaster lamp brings effortless calm.',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-20 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open AI Interior Stylist"
          className="group flex items-center gap-2.5 px-4 py-2.5 bg-[#2A1E17] text-[#FAF6F0] rounded-full shadow-lg hover:bg-[#3D2C22] hover:shadow-xl transition-all duration-300 border border-[#C8A46B]/40 cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-[#C8A46B] group-hover:rotate-12 transition-transform" />
          <span className="text-xs uppercase tracking-wider font-semibold">AI Stylist</span>
        </button>
      </div>

      {/* Slide-out / Pop-up Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-full max-w-[390px] sm:max-w-[420px] bg-[#FAF6F0] rounded-xl shadow-2xl border border-[#E2D9CC] overflow-hidden flex flex-col h-[560px] animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-[#1E1610] text-[#FAF6F0] flex items-center justify-between border-b border-[#2A1E17]">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-[#2A1E17] flex items-center justify-center text-[#C8A46B] border border-[#C8A46B]/30">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C8A46B] font-semibold block">
                  Cloudberry Atelier
                </span>
                <h3 className="font-serif text-base text-[#FAF6F0] font-normal">
                  AI Interior Stylist
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-[#FAF6F0]/70 hover:text-[#FAF6F0] rounded-full transition-colors cursor-pointer"
              aria-label="Close assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick suggestions strip */}
          <div className="p-2.5 bg-[#F5F0E6] border-b border-[#E2D9CC] overflow-x-auto flex gap-1.5 scrollbar-none text-[11px]">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="px-2.5 py-1 bg-[#FCFAF6] hover:bg-[#EDE7DE] text-[#201610] rounded-xs border border-[#E2D9CC] whitespace-nowrap transition-colors shrink-0 disabled:opacity-50 cursor-pointer shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-light bg-[#FAF6F0]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="h-6 w-6 rounded-full bg-[#EDE7DE] text-[#201610] flex items-center justify-center shrink-0 mt-0.5 border border-[#E2D9CC]">
                    <Sparkles className="h-3 w-3 text-[#C8A46B]" />
                  </div>
                )}

                <div className={`space-y-2 max-w-[84%] ${msg.sender === 'user' ? 'items-end' : ''}`}>
                  <div
                    className={`p-3 rounded-lg leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#2A1E17] text-[#FAF6F0] rounded-tr-none'
                        : 'bg-[#FCFAF6] border border-[#E2D9CC] text-[#201610] shadow-2xs rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Render Product Recommendations if provided */}
                  {msg.recommended && msg.recommended.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#6E6157] font-semibold block">
                        Recommended Pieces:
                      </span>
                      <div className="space-y-1.5">
                        {msg.recommended.map((prod) => (
                          <div
                            key={prod.id}
                            className="flex items-center justify-between gap-2 p-2 bg-[#FCFAF6] rounded-xs border border-[#E2D9CC] hover:border-[#C8A46B] transition-colors shadow-2xs"
                          >
                            <div
                              onClick={() => handleProductClick(prod.id)}
                              className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                            >
                              <img
                                src={prod.images[0]}
                                alt={prod.name}
                                referrerPolicy="no-referrer"
                                className="h-10 w-10 rounded-xs object-cover bg-[#EDE7DE] shrink-0 border border-[#E2D9CC]"
                              />
                              <div className="min-w-0">
                                <h4 className="font-serif text-xs font-medium text-[#201610] truncate">
                                  {prod.name}
                                </h4>
                                <span className="font-sans text-[11px] font-semibold text-[#201610] tabular-nums">
                                  ₹{prod.price.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => addToCart(prod, 1)}
                              className="p-1.5 bg-[#FAF6F0] hover:bg-[#2A1E17] hover:text-[#FAF6F0] rounded-xs transition-colors shrink-0 text-[#201610] border border-[#E2D9CC] cursor-pointer"
                              title="Add to bag"
                            >
                              <ShoppingBag className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="h-6 w-6 rounded-full bg-[#2A1E17] text-[#FAF6F0] flex items-center justify-center shrink-0 mt-0.5">
                    <UserIcon className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-[#6E6157] text-xs">
                <Sparkles className="h-3.5 w-3.5 animate-spin text-[#C8A46B]" />
                <span>Cloudberry stylist is curating recommendations...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#FCFAF6] border-t border-[#E2D9CC]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about living rooms, vases, lighting..."
                className="flex-1 px-3 py-2 text-xs bg-[#FAF6F0] border border-[#E2D9CC] rounded-xs text-[#201610] focus:border-[#201610] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 bg-[#2A1E17] text-[#FAF6F0] rounded-xs hover:bg-[#3D2C22] transition-colors disabled:opacity-40 cursor-pointer"
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
