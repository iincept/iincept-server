import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Sparkles, Smartphone, ShieldAlert, CheckCircle2, ShoppingCart } from 'lucide-react';
import { getProducts } from '../services/productApi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const resolveColorValue = (cVal) => {
  if (!cVal) return '#cbd5e1';
  const cValStr = cVal.toString().trim();
  if (cValStr.startsWith('#') || cValStr.startsWith('rgb') || cValStr.startsWith('hsl')) {
    return cValStr;
  }
  const PDP_COLOR_MAP = {
    "space black": "#1c1c1c",
    "space gray": "#555555",
    "starlight": "#f5f5f4",
    "silver": "#cbd5e1",
    "desert titanium": "#e6c2b9",
    "dark blue": "#2a4b7c",
    "deep blue": "#1d3557",
    "titanium": "#cbd5e1",
    "white": "#ffffff",
    "gold": "#e5c158",
    "pink": "#ec4899",
    "black": "#111111",
    "orange": "#ff9f68",
    "midnight": "#1e293b",
    "light blue": "#bfdbfe",
    "sky blue": "#bae6fd",
    "lavender": "#e9d5ff",
    "green": "#bbf7d0",
    "dark gray": "#3f3f46",
    "natural titanium": "#a39e99",
    "natural": "#a39e99",
    "black titanium": "#232426",
    "white titanium": "#f2f1ed",
    "deep purple": "#3b224c",
    "purple": "#a855f7",
    "yellow": "#eab308"
  };
  const lowerVal = cValStr.toLowerCase().replace(/\s+/g, ' ').trim();
  return PDP_COLOR_MAP[lowerVal] || '#cbd5e1';
};

export default function Compare() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(['', '', '']);
  const [cartSuccess, setCartSuccess] = useState('');

  useEffect(() => {
    fetchProductsList();
  }, []);

  const fetchProductsList = async () => {
    setLoading(true);
    try {
      const data = await getProducts({ limit: 100 });
      setProducts(Array.isArray(data) ? data : (data.products || []));
    } catch (err) {
      console.error('Failed to fetch compare list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (index, value) => {
    const next = [...selectedIds];
    next[index] = value;
    setSelectedIds(next);
  };

  const handleClear = () => {
    setSelectedIds(['', '', '']);
  };

  const handleAddToCart = (product) => {
    if (!product || product.stock === 0) return;
    dispatch(addToCart({
      _id: product._id,
      title: product.title,
      price: product.price,
      images: product.images,
      brand: product.brand,
      stock: product.stock,
      quantity: 1
    }));
    setCartSuccess(`${product.title} added to cart!`);
    setTimeout(() => setCartSuccess(''), 3000);
  };

  // Get selected products objects
  const selectedProducts = selectedIds.map(id => products.find(p => p._id === id) || null);
  const activeCount = selectedProducts.filter(Boolean).length;

  return (
    <div className="min-h-screen bg-zinc-50 pt-28 pb-16 px-4 font-sans text-left">
      {cartSuccess && (
        <div className="fixed bottom-6 right-6 bg-zinc-900 text-white py-3.5 px-5 rounded-2xl shadow-xl flex items-center gap-3 border border-zinc-800 animate-in fade-in slide-in-from-bottom-5 duration-300 z-50">
          <CheckCircle2 className="h-5 w-5 text-emerald-450" />
          <span className="text-sm font-semibold">{cartSuccess}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] text-[#0071e3] font-extrabold uppercase tracking-widest bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full">
              Specs Comparison
            </span>
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight mt-3">
              Compare Apple Models
            </h1>
            <p className="text-zinc-500 text-sm mt-1 font-medium">
              Select up to three products side-by-side to review prices, technical specifications, and key features.
            </p>
          </div>
          {activeCount > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 border border-zinc-250 hover:bg-zinc-150 text-zinc-700 hover:text-zinc-950 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Clear Selection
            </button>
          )}
        </header>

        {/* Dropdown selectors row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-2">
              <label className="block text-[10px] uppercase font-bold text-zinc-450 tracking-wider">
                Compare Slot {idx + 1}
              </label>
              <select
                value={selectedIds[idx]}
                onChange={(e) => handleSelectChange(idx, e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 focus:border-[#0071e3] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="">Select a product...</option>
                {products.map((p) => (
                  <option 
                    key={p._id} 
                    value={p._id}
                    disabled={selectedIds.includes(p._id) && selectedIds[idx] !== p._id}
                  >
                    {p.title} - ₹{p.price?.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Comparison grid content */}
        {activeCount === 0 ? (
          <div className="bg-white border border-zinc-150 rounded-3xl p-16 text-center shadow-sm space-y-4">
            <Smartphone className="h-12 w-12 text-zinc-350 mx-auto" />
            <div>
              <h2 className="text-lg font-bold text-zinc-800">No Models Selected</h2>
              <p className="text-zinc-550 text-xs mt-1">Use the selectors above to add items to the comparison grid sheet.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-zinc-150 rounded-3xl shadow-sm overflow-hidden divide-y divide-zinc-100">
            {/* Row: Main Card / Photo */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
              {[0, 1, 2].map((idx) => {
                const prod = selectedProducts[idx];
                if (!prod) {
                  return (
                    <div key={idx} className="p-8 text-center text-zinc-400 text-xs italic flex items-center justify-center min-h-64">
                      Empty Slot
                    </div>
                  );
                }
                return (
                  <div key={idx} className="p-8 flex flex-col items-center justify-between min-h-64 space-y-6">
                    <div className="h-44 w-44 rounded-2xl bg-white border border-zinc-100 p-2 flex items-center justify-center overflow-hidden">
                      <img 
                        src={prod.images?.[0] || '/iphone_category_v2.jpg'} 
                        alt="" 
                        className="object-contain max-h-full max-w-full hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="text-center space-y-2">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">{prod.brand}</span>
                      <h3 className="font-extrabold text-base text-zinc-900 leading-tight">{prod.title}</h3>
                      <p className="font-extrabold text-lg text-zinc-900">₹{prod.price?.toLocaleString()}</p>
                    </div>

                    <div className="w-full space-y-2">
                      {prod.stock === 0 ? (
                        <div className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-bold tracking-wider uppercase border border-rose-100">
                          <ShieldAlert className="h-4.5 w-4.5" />
                          Out of Stock
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(prod)}
                          className="w-full flex items-center justify-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer border-0 shadow-sm"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          Add to Cart
                        </button>
                      )}
                      <Link
                        to={`/product/${prod._id}`}
                        className="w-full block text-center bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Row: Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
              {[0, 1, 2].map((idx) => {
                const prod = selectedProducts[idx];
                if (!prod) return <div key={idx} className="p-6"></div>;
                return (
                  <div key={idx} className="p-6 text-center space-y-2">
                    <span className="text-[10px] uppercase font-bold text-zinc-450 tracking-wider block">Available Colors</span>
                    <div className="flex justify-center gap-1.5 flex-wrap">
                      {Array.isArray(prod.colors) && prod.colors.length > 0 ? (
                        prod.colors.map((col, cIdx) => {
                          const colName = typeof col === 'object' ? col.name : col;
                          return (
                            <div 
                              key={cIdx} 
                              className="h-5 w-5 rounded-full border border-zinc-200 shadow-sm shrink-0 flex items-center justify-center"
                              style={{ backgroundColor: resolveColorValue(colName) }}
                              title={colName}
                            />
                          );
                        })
                      ) : (
                        <span className="text-zinc-450 text-xs">N/A</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Row: Storage Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
              {[0, 1, 2].map((idx) => {
                const prod = selectedProducts[idx];
                if (!prod) return <div key={idx} className="p-6"></div>;
                return (
                  <div key={idx} className="p-6 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-450 tracking-wider block">Storage Capacity</span>
                    <p className="text-xs font-bold text-zinc-800">
                      {Array.isArray(prod.storage) && prod.storage.length > 0
                        ? prod.storage.join(' / ')
                        : prod.storage || 'Standard'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Row: RAM Option */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
              {[0, 1, 2].map((idx) => {
                const prod = selectedProducts[idx];
                if (!prod) return <div key={idx} className="p-6"></div>;
                return (
                  <div key={idx} className="p-6 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-450 tracking-wider block">RAM Configuration</span>
                    <p className="text-xs font-bold text-zinc-800">
                      {Array.isArray(prod.ram) && prod.ram.length > 0
                        ? prod.ram.join(' / ')
                        : prod.ram || 'Standard'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Row: Material & Specs details */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
              {[0, 1, 2].map((idx) => {
                const prod = selectedProducts[idx];
                if (!prod) return <div key={idx} className="p-6"></div>;
                return (
                  <div key={idx} className="p-6 text-center space-y-1.5 max-w-sm mx-auto">
                    <span className="text-[10px] uppercase font-bold text-zinc-450 tracking-wider block">Build / Material</span>
                    <p className="text-xs font-semibold text-zinc-700 italic">
                      {prod.material || 'Premium Finish'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Row: Key Features checklist */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
              {[0, 1, 2].map((idx) => {
                const prod = selectedProducts[idx];
                if (!prod) return <div key={idx} className="p-6"></div>;
                return (
                  <div key={idx} className="p-6 space-y-3">
                    <span className="text-[10px] uppercase font-bold text-zinc-450 tracking-wider block text-center">Highlighted Features</span>
                    <ul className="space-y-1.5 text-xs text-zinc-650 max-w-xs mx-auto">
                      {Array.isArray(prod.features) && prod.features.length > 0 ? (
                        prod.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <Sparkles className="h-3.5 w-3.5 text-[#0071e3] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-center text-zinc-400 italic text-[11px]">No features listed.</p>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
