import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, SlidersHorizontal, ArrowUpDown, X, ShoppingBag } from 'lucide-react';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist } from '../redux/wishlistSlice';
import { fetchProducts } from '../redux/productSlice';
import { matchesProductSearch } from '../utils/searchUtils';

// Products are loaded dynamically from e-commerce database API

const IPHONE_SUB_NAV_ITEMS = [
  { name: 'iPhone 17 Pro', query: 'iPhone 17 Pro', image: '/iphone_nav/iphone_17_pro.png' },
  { name: 'iPhone Air', query: 'iPhone Air', image: '/iphone_nav/iphone_air.png' },
  { name: 'iPhone 17', query: 'iPhone 17', image: '/iphone_nav/iphone_17.png' },
  { name: 'iPhone 17e', query: 'iPhone 17e', image: '/iphone_nav/iphone_17e.png' },
  { name: 'iPhone 16', query: 'iPhone 16', image: '/iphone_nav/iphone_16.png' },
  { name: 'Compare', path: '/compare?category=iphone', image: '/iphone_nav/iphone_compare.png' },
  { name: 'Accessories', path: '/accessories', image: '/iphone_nav/accessories.png' },
  { name: 'Shop iPhone', path: '/iphone', image: '/iphone_nav/shop_iphone.png' }
];

export default function Iphone() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { products } = useSelector((state) => state.products);
  const [viewCols, setViewCols] = useState(4); // 2, 3, or 4 columns
  const [showLimit, setShowLimit] = useState(16); // 16, 32, 64
  const [sortBy, setSortBy] = useState('latest');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState({});
  const [activeTab, setActiveTab] = useState('all');

  // Local state for wishlisted items
  const [localWishlist, setLocalWishlist] = useState({});

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleColorChange = (productId, colorVal) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: colorVal }));
  };

  const getProductImage = (prod) => {
    const selectedColorName = selectedColors[prod.id];
    if (selectedColorName) {
      const targetNorm = selectedColorName.replace(/\s+/g, ' ').trim().toLowerCase();
      
      // 1. Match in prod.colors by name or rawName
      const foundColor = prod.colors.find((c) => {
        const cNorm = (c.name || c.rawName || c).replace(/\s+/g, ' ').trim().toLowerCase();
        return cNorm === targetNorm;
      });
      if (foundColor && foundColor.image) {
        return foundColor.image;
      }

      // 2. Match in prod.variants directly!
      if (prod.variants && Array.isArray(prod.variants)) {
        const foundVariant = prod.variants.find(v => {
          if (!v.color) return false;
          return v.color.replace(/\s+/g, ' ').trim().toLowerCase() === targetNorm;
        });
        if (foundVariant && foundVariant.images && foundVariant.images[0]) {
          return foundVariant.images[0];
        }
      }

      // 3. Match index of color in prod.colors with index in prod.images
      const colorIdx = prod.colors.findIndex((c) => {
        const cNorm = (c.name || c.rawName || c).replace(/\s+/g, ' ').trim().toLowerCase();
        return cNorm === targetNorm;
      });
      if (colorIdx !== -1 && prod.images && prod.images[colorIdx]) {
        return prod.images[colorIdx];
      }

      // 4. Color name fallback mappings
      if (targetNorm.includes('pink') || targetNorm.includes('rose')) return '/iphone16_pink_hand.jpg';
      if (targetNorm.includes('purple') || targetNorm.includes('lavender')) return '/iphone17_purple_fb.jpg';
      if (targetNorm.includes('green') || targetNorm.includes('teal') || targetNorm.includes('saga')) return '/iphone16_green_profile.jpg';
      if (targetNorm.includes('blue') || targetNorm.includes('ultramarine') || targetNorm.includes('mist')) return '/iphone16_blue_fb.jpg';
      if (targetNorm.includes('orange') || targetNorm.includes('desert') || targetNorm.includes('gold')) return '/iphone17p_orange.jpg';
      if (targetNorm.includes('white') || targetNorm.includes('starlight') || targetNorm.includes('silver')) return '/iphone17p_white.jpg';
      if (targetNorm.includes('black') || targetNorm.includes('space') || targetNorm.includes('midnight')) return '/iphone16_group.jpg';
    }
    return prod.image;
  };

  const handleAddToCart = (prod) => {
    const selectedColor = selectedColors[prod.id] || prod.colors[0]?.name || 'Standard';
    dispatch(addToCart({
      id: prod.id,
      name: `${prod.name} (${selectedColor})`,
      price: prod.price,
      image: getProductImage(prod),
      quantity: 1
    }));
  };

  const handleAddToWishlist = (prod) => {
    setLocalWishlist((prev) => ({ ...prev, [prod.id]: !prev[prod.id] }));
    dispatch(addToWishlist({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: getProductImage(prod),
      rating: prod.rating
    }));
    alert(`Added ${prod.name} to Wishlist!`);
  };

  // Resolve color values to hex code
  const resolveColorValue = (cVal) => {
    if (!cVal) return '#cbd5e1';
    const cValStr = cVal.toString().trim();
    if (cValStr.startsWith('#') || cValStr.startsWith('rgb') || cValStr.startsWith('hsl')) {
      return cValStr;
    }
    const COLOR_MAP = {
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
      "orenge": "#ff9f68",
      "cosmic orange": "#d9a07a",
      "blue": "#0071E3",
      "red": "#e0115f",
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
    return COLOR_MAP[lowerVal] || '#cbd5e1';
  };

  // Merge database products with fallback mock data
  const dbIphones = products.filter(p => {
    const catName = p.category?.name || p.category?.toString() || '';
    const catSlug = p.category?.slug || '';
    return catName.toLowerCase() === 'smartphones' || 
           catSlug.toLowerCase() === 'smartphones' || 
           catName.toLowerCase().includes('iphone');
  }).map(p => {
    const firstImg = p.image || (p.images && p.images[0]);
    const isValidImg = firstImg && !firstImg.includes('mock-cloud');
    const varPrices = (p.variants && Array.isArray(p.variants)) ? p.variants.map(v => v.price).filter(pr => typeof pr === 'number' && pr > 0) : [];
    const effectivePrice = varPrices.length > 0 ? Math.min(...varPrices) : (p.price || 0);

    return {
      id: p._id || p.id,
      name: p.title || p.name,
      price: effectivePrice,
      priceStr: `₹${effectivePrice.toLocaleString('en-IN')}`,
      image: isValidImg ? firstImg : '/iphone_category_v2.jpg',
      images: p.images || [],
      variants: p.variants || [],
      colors: Array.isArray(p.colors) ? p.colors.map(c => {
        const rawName = typeof c === 'string' ? c : (c.name || '');
        const normName = rawName.replace(/\s+/g, ' ').trim();
        const val = typeof c === 'string' ? c : (c.value || c.name || '');

        let variantImage = typeof c === 'object' && c.image ? c.image : null;
        if (!variantImage && p.variants && Array.isArray(p.variants)) {
          const matchedVariant = p.variants.find(v => {
            if (!v.color) return false;
            const vColor = v.color.replace(/\s+/g, ' ').trim().toLowerCase();
            return vColor === normName.toLowerCase();
          });
          if (matchedVariant && matchedVariant.images && matchedVariant.images[0]) {
            variantImage = matchedVariant.images[0];
          }
        }

        return { 
          name: normName, 
          rawName: rawName,
          value: resolveColorValue(val),
          image: variantImage 
        };
      }) : [],
      rating: p.rating || 5.0,
      isSoldOut: p.stock <= 0
    };
  });

  const combinedProducts = dbIphones;

  // Sorting logic
  const sortedProducts = [...combinedProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // Default: 'latest' (original mock ordering)
  });

  // Tab filtering logic (e.g. Filter Drawer Options) + Search Parameter filter
  const filteredProducts = sortedProducts.filter((prod) => {
    const search = searchParams.get('search') || '';
    if (search && !matchesProductSearch(prod, search)) {
      return false;
    }

    if (activeTab === 'available') return !prod.isSoldOut;
    if (activeTab === 'soldout') return prod.isSoldOut;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1d1d1f] py-4 px-4 sm:px-8 md:px-12 lg:px-16 select-none animate-in fade-in duration-300 relative">
      
      {/* Title & Category Sub-Nav Header */}
      <div className="w-full bg-[#fcfcfc] pt-2 pb-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 text-left mb-6">
            iPhone
          </h1>

          {/* Horizontal iPhone Model Selector Row */}
          <div className="flex items-center gap-6 sm:gap-10 md:gap-12 overflow-x-auto no-scrollbar py-2">
            {IPHONE_SUB_NAV_ITEMS.map((item, idx) => {
              const currentSearch = searchParams.get('search') || '';
              const isActive = currentSearch.toLowerCase() === (item.query || '').toLowerCase();

              return (
                <Link
                  key={idx}
                  to={item.path || (item.query ? `/iphone?search=${encodeURIComponent(item.query)}` : '/iphone')}
                  className={`flex flex-col items-center gap-2 shrink-0 group cursor-pointer transition-all duration-200 ${
                    isActive ? 'scale-105' : 'hover:scale-105'
                  }`}
                >
                  <div className="h-16 w-20 flex items-center justify-center p-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-xs transition-transform group-hover:scale-105"
                    />
                  </div>
                  <span className="text-xs font-bold tracking-tight text-zinc-950 transition-colors">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>



      {/* Top Filter and View Controller Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-150 pb-6 mb-8 text-sm font-sans uppercase font-bold text-zinc-500 tracking-wider">
        <div className="text-zinc-800 text-xs tracking-widest">
          SHOWING ALL {filteredProducts.length} RESULTS
        </div>
      </div>

      {/* Slide-out Filter Drawer */}
      {filterOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-all duration-300 flex justify-end">
          <div className="w-80 bg-white h-full p-8 shadow-2xl animate-in slide-in-from-right duration-350 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <h3 className="font-bold text-lg tracking-tight">Filter Options</h3>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="p-1 rounded-full hover:bg-zinc-100 text-zinc-500 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Availability */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Availability</h4>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`text-left text-sm py-1.5 px-3 rounded-lg ${activeTab === 'all' ? 'bg-zinc-100 font-semibold' : 'text-zinc-600 hover:bg-zinc-50'}`}
                    >
                      All Models
                    </button>
                    <button
                      onClick={() => setActiveTab('available')}
                      className={`text-left text-sm py-1.5 px-3 rounded-lg ${activeTab === 'available' ? 'bg-zinc-100 font-semibold' : 'text-zinc-600 hover:bg-zinc-50'}`}
                    >
                      In Stock
                    </button>
                    <button
                      onClick={() => setActiveTab('soldout')}
                      className={`text-left text-sm py-1.5 px-3 rounded-lg ${activeTab === 'soldout' ? 'bg-zinc-100 font-semibold' : 'text-zinc-600 hover:bg-zinc-50'}`}
                    >
                      Sold Out
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setFilterOpen(false)}
              className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 rounded-xl font-medium tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer text-center"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Grid of iPhone models */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="group bg-white rounded-2xl overflow-hidden flex flex-col justify-between p-6 shadow-sm border border-zinc-100/50 hover:shadow-md hover:border-zinc-200/55 transition-all duration-300 relative text-left"
          >
            {/* Top Row: Sold Out Badges & Favorite Heart */}
            <div className="flex items-center justify-between absolute top-4 left-4 right-4 z-10">
              {prod.isSoldOut ? (
                <span className="bg-[#f5f5f7] text-[#1d1d1f] font-bold text-[9px] tracking-widest uppercase px-2.5 py-1 rounded">
                  SOLD OUT
                </span>
              ) : (
                <div />
              )}

              <button
                onClick={() => handleAddToWishlist(prod)}
                className={`p-2 rounded-full shadow-sm border border-zinc-100/80 bg-white/90 hover:scale-110 transition-all cursor-pointer ${localWishlist[prod.id] ? 'text-red-500' : 'text-zinc-400 hover:text-zinc-600'
                  }`}
              >
                <Heart className={`h-4 w-4 ${localWishlist[prod.id] ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Clickable Area: Image and Title */}
            <Link to={`/product/${prod.id}`} className="block cursor-pointer">
              {/* Product Visual */}
              <div className="w-full h-64 rounded-2xl overflow-hidden mb-6 mt-4 flex items-center justify-center">
                <img
                  src={getProductImage(prod)}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                />
              </div>

              {/* Title (Clean Product Name) */}
              <h3 className="font-semibold text-[16px] leading-snug tracking-tight text-zinc-900 group-hover:text-zinc-900 transition-colors min-h-[48px]">
                {(() => {
                  const cleanProductTitle = (rawTitle) => {
                    if (!rawTitle) return '';
                    return rawTitle.replace(/\s*[A-Z0-9]{5,9}\/[A-Z]$/i, '').trim();
                  };
                  return (
                    <span>{cleanProductTitle(prod.name || prod.title)}</span>
                  );
                })()}
              </h3>
            </Link>

            {/* Non-clickable configurations / actions */}
            <div className="space-y-4 pt-2">
              {/* Color Dot Options */}
              <div className="flex items-center justify-between gap-1.5 border-t border-zinc-100/60 pt-3">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Colors</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {prod.colors.map((color) => {
                    const isSelected = selectedColors[prod.id] === color.name || (!selectedColors[prod.id] && prod.colors[0]?.name === color.name);
                    return (
                      <button
                        key={color.name}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleColorChange(prod.id, color.name);
                        }}
                        style={{ backgroundColor: color.value }}
                        className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-all border ${isSelected ? 'scale-125 border-zinc-800 ring-1 ring-zinc-400' : 'border-zinc-300 hover:scale-110'
                          }`}
                        title={color.name}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Price and Cart Row */}
              <div className="flex items-center justify-between pt-1 border-t border-zinc-100/60">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Price</span>
                  <span className="font-semibold text-zinc-900 text-sm">{prod.priceStr}</span>
                </div>

                {!prod.isSoldOut && (
                  <button
                    onClick={() => handleAddToCart(prod)}
                    className="flex items-center justify-center p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 transition-all cursor-pointer"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
