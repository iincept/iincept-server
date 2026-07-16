import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import { updateQuantity, removeFromCart } from '../redux/cartSlice';
import axiosClient from '../services/axiosClient';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load cart items from the Redux store
  const { cartItems } = useSelector((state) => state.cart);

  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in rupees
  const [couponError, setCouponError] = useState('');

  const handleUpdateQuantity = (id, newQty) => {
    dispatch(updateQuantity({ id, quantity: Math.max(1, newQty) }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    if (!coupon) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    try {
      const response = await axiosClient.post('/coupons/apply', { code: coupon });
      const { discountAmount, discount } = response.data;
      setAppliedDiscount(discountAmount);
      alert(`Coupon "${coupon.toUpperCase()}" Applied! ₹${discountAmount.toLocaleString('en-IN')} (${discount}% off) deducted.`);
    } catch (err) {
      setAppliedDiscount(0);
      setCouponError(err.response?.data?.message || err.message || 'Failed to apply coupon');
    }
  };

  // Math Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 15.00;
  const total = subtotal + shipping - appliedDiscount;

  if (cartItems.length === 0) {
    return (
      <div className="border border-zinc-200 bg-white rounded-3xl p-16 text-center space-y-6 max-w-xl mx-auto my-8 animate-in fade-in duration-300 shadow-sm">
        <div className="h-16 w-16 bg-zinc-50 border border-zinc-200 rounded-full flex items-center justify-center text-zinc-600 mx-auto">
          <ShoppingBag className="h-8 w-8 text-black" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-900">Your Cart is Empty</h2>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto">Looks like you haven't added any products to your electronic collection yet.</p>
        </div>
        <Link 
          to="/?scroll=categories" 
          className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold px-6 py-3 rounded-xl transition-all cursor-pointer text-xs shadow-sm"
        >
          Explore Products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2 text-left animate-in fade-in duration-300">
      
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div 
              key={item.id}
              className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-zinc-200 rounded-2xl gap-4 hover:border-zinc-300 transition-colors shadow-sm"
            >
              {/* Product Thumbnail & Name */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="h-20 w-20 rounded-xl overflow-hidden bg-zinc-50 shrink-0 border border-zinc-200">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-zinc-800 text-sm line-clamp-1">{item.name}</h3>
                  <div className="text-[10px] text-zinc-500 space-y-0.5 mt-0.5">
                    {item.size && <p>Config: <span className="text-zinc-700">{item.size}</span></p>}
                    {item.color && (
                      <div className="flex items-center gap-1">
                        <span>Color:</span>
                        <div className="h-3 w-3 rounded-full border border-zinc-300" style={{ backgroundColor: item.color }} />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-zinc-750 font-bold block mt-1">₹{item.price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Quantity Controls & Math */}
              <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t border-zinc-150 sm:border-0 pt-3 sm:pt-0">
                
                {/* Quantity */}
                <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-xl px-2 py-1 gap-3">
                  <button 
                    onClick={() => handleQtyChange(item.id, item.quantity, 'dec')}
                    className="p-1 rounded-lg hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-xs font-bold w-5 text-center text-zinc-800">{item.quantity}</span>
                  <button 
                    onClick={() => handleQtyChange(item.id, item.quantity, 'inc')}
                    className="p-1 rounded-lg hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <span className="font-bold text-sm w-20 text-right text-zinc-800">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>

                {/* Remove */}
                <button 
                  onClick={() => handleRemove(item.id)}
                  className="p-2 bg-zinc-100 hover:bg-rose-50 text-zinc-500 hover:text-rose-600 rounded-xl border border-zinc-200 transition-colors cursor-pointer"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Order Summary Panel */}
        <aside className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="font-bold text-lg border-b border-zinc-100 pb-3 text-zinc-900">Order Summary</h2>

          {/* Pricing Math */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span className="font-bold text-zinc-800">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Shipping Fee</span>
              <span className="font-bold text-zinc-800">
                {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}
              </span>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount Coupon</span>
                <span>-₹{appliedDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <hr className="border-zinc-150" />
            <div className="flex justify-between text-sm font-extrabold text-zinc-900">
              <span>Grand Total</span>
              <span>₹{Math.max(0, total).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Coupon Form */}
          <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-zinc-150">
            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Have a coupon code?</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter Coupon Code" 
                className="bg-white border border-zinc-200 text-xs rounded-xl px-3 py-2 flex-grow text-zinc-900 focus:outline-none focus:border-zinc-500"
              />
              <button 
                type="submit" 
                className="bg-zinc-900 border border-zinc-900 hover:bg-zinc-850 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer text-white"
              >
                <Tag className="h-3.5 w-3.5 text-white" />
                Apply
              </button>
            </div>
            {couponError && <p className="text-[10px] text-rose-600 font-bold text-left">{couponError}</p>}
          </form>

          {/* Checkout CTA */}
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-black hover:bg-zinc-900 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-sm cursor-pointer"
          >
            Proceed to Checkout
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </aside>

      </div>
    </div>
  );
}
