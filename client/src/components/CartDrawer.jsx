import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { closeCart, removeFromCart, updateQuantity, addToCart } from '../redux/cartSlice';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const drawerRef = useRef(null);
  
  const { cartItems, isCartOpen } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.products || { products: [] });

  // Close drawer if clicked outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isCartOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        dispatch(closeCart());
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isCartOpen, dispatch]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Recommendations: products that are NOT already in the cart
  const recommendations = products
    .filter(p => !cartItems.some(item => item.id === (p._id || p.id)))
    .slice(0, 5)
    .map(p => ({
      id: p._id || p.id,
      name: p.title || p.name,
      price: p.price,
      priceStr: `₹${p.price.toLocaleString()}`,
      image: (p.images && p.images[0]) || p.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80'
    }));

  // Fallback recommendations if database is empty
  const fallbackRecs = [
    { id: 'apmaxusbc', name: 'AirPods Max (USB-C)', price: 59900, priceStr: '₹59,900.00', image: '/airpods_pro_3.jpg' },
    { id: 'awultra2', name: 'Apple Watch Ultra 2', price: 89900, priceStr: '₹89,900.00', image: '/watch_category.jpg' },
    { id: 'belkin3in1', name: 'Belkin UltraCharge Pro 3-in-1', price: 12500, priceStr: '₹12,500.00', image: '/college_essential_1.png' },
    { id: 'mbneo', name: 'MacBook Neo 14-inch', price: 159900, priceStr: '₹159,900.00', image: '/macbook_category_v3.jpg' }
  ].filter(p => !cartItems.some(item => item.id === p.id)).slice(0, 4);

  const displayRecs = recommendations.length > 0 ? recommendations : fallbackRecs;

  const handleRecommendationAdd = (rec) => {
    dispatch(addToCart({
      id: rec.id,
      name: rec.name,
      price: rec.price,
      image: rec.image,
      quantity: 1
    }));
  };

  const handleCheckoutClick = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    dispatch(closeCart());
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden font-sans">
      {/* Dark Blur Overlay Backdrop */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-[4px] transition-opacity duration-300 animate-in fade-in"
        onClick={() => dispatch(closeCart())}
      />

      {/* Main Drawer Panel Slide-in Container */}
      <div 
        ref={drawerRef}
        className="absolute inset-y-0 right-0 max-w-full flex pl-10 sm:pl-16 outline-none animate-in slide-in-from-right duration-300"
      >
        {/* Dual-Pane Drawer wrapper */}
        <div className="flex h-full items-stretch">
          
          {/* LATEST RECOMMENDATIONS LEFT PANE (Visible on tablet & desktop screen sizes) */}
          <div className="hidden md:flex w-80 flex-col bg-[#fcfcfc] border-l border-zinc-150 p-6 overflow-y-auto text-left shadow-lg">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest border-b pb-4 mb-4">
              YOU MAY ALSO LIKE
            </h3>
            <div className="flex flex-col gap-4">
              {displayRecs.map((rec) => (
                <div 
                  key={rec.id}
                  className="bg-white border border-zinc-150 p-3 rounded-2xl flex items-center gap-3 hover:shadow-sm transition-all"
                >
                  <img 
                    src={rec.image} 
                    alt={rec.name} 
                    className="w-14 h-14 object-contain rounded-lg bg-zinc-50 p-1 border border-zinc-100 shrink-0" 
                  />
                  <div className="space-y-1 text-left min-w-0 flex-grow">
                    <h4 className="text-[11px] font-bold text-zinc-800 truncate leading-snug tracking-tight">
                      {rec.name}
                    </h4>
                    <p className="text-[11px] font-extrabold text-[#b82a39]">{rec.priceStr}</p>
                    <button 
                      onClick={() => handleRecommendationAdd(rec)}
                      className="text-[9px] font-bold uppercase tracking-wider text-zinc-600 hover:text-black border border-zinc-300 hover:border-black rounded-lg px-2.5 py-1 transition-all bg-transparent cursor-pointer"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
              {displayRecs.length === 0 && (
                <p className="text-xs text-zinc-400 italic">No recommended items left</p>
              )}
            </div>
          </div>

          {/* MAIN CART LIST RIGHT PANE (Slideout drawer) */}
          <div className="w-screen max-w-md flex flex-col bg-white shadow-2xl p-6 text-left relative z-10 border-l border-zinc-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h2 className="text-lg font-black text-zinc-900 tracking-wider">CART</h2>
              <button 
                onClick={() => dispatch(closeCart())}
                className="p-1 rounded-full text-zinc-400 hover:text-black transition-colors bg-zinc-50 hover:bg-zinc-100 cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart content list */}
            <div className="flex-grow overflow-y-auto py-4 select-none">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-5 py-20">
                  <div className="w-20 h-20 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400">
                    <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-800">Your cart is empty</h3>
                    <p className="text-xs text-zinc-400 max-w-[200px] mt-1 mx-auto leading-relaxed">Add premium gear to your shopping cart to get started.</p>
                  </div>
                  <button 
                    onClick={() => {
                      dispatch(closeCart());
                      if (location.pathname === '/') {
                        const section = document.getElementById('apple-categories');
                        if (section) {
                          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      } else {
                        navigate('/?scroll=categories');
                      }
                    }}
                    className="bg-zinc-950 text-white hover:bg-zinc-900 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    RETURN TO SHOP
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-4 pb-4 border-b border-zinc-100/60"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 object-contain rounded-xl bg-zinc-50 p-1 border border-zinc-100 shrink-0" 
                      />
                      <div className="flex-grow min-w-0 space-y-1">
                        <h4 className="text-xs font-bold text-zinc-900 truncate pr-4">
                          {item.name}
                        </h4>
                        <p className="text-xs font-extrabold text-zinc-500">
                          ₹{item.price.toLocaleString()}
                        </p>
                        
                        {/* Quantity Counter */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden h-7 bg-zinc-50/50">
                            <button 
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                              className="px-2 py-0.5 hover:bg-zinc-100 text-zinc-600 transition-colors cursor-pointer h-full"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-zinc-800">{item.quantity}</span>
                            <button 
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                              className="px-2 py-0.5 hover:bg-zinc-100 text-zinc-600 transition-colors cursor-pointer h-full"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="text-zinc-400 hover:text-red-500 p-1 transition-colors bg-transparent border-0 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-zinc-100 space-y-4">
                <div className="flex items-center justify-between text-zinc-800">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Subtotal</span>
                  <span className="text-lg font-black text-zinc-900">₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex flex-col gap-2.5">
                  <button 
                    onClick={handleCheckoutClick}
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-md transition-colors cursor-pointer text-center"
                  >
                    PROCEED TO CHECKOUT
                  </button>
                  <button 
                    onClick={handleViewCartClick}
                    className="w-full border border-zinc-200 hover:bg-zinc-50 text-zinc-800 py-3 rounded-2xl font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer text-center"
                  >
                    VIEW SHOPPING BAG
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
