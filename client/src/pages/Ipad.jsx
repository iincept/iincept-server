import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, SlidersHorizontal, ArrowUpDown, X, ShoppingBag } from 'lucide-react';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist } from '../redux/wishlistSlice';
import { fetchProducts } from '../redux/productSlice';
import { matchesProductSearch } from '../utils/searchUtils';

// Products are loaded dynamically from e-commerce database API

const IPAD_SUB_NAV_ITEMS = [
  { name: 'iPad Pro', query: 'iPad Pro', image: '/ipad_nav/ipad_pro.png' },
  { name: 'iPad Air', query: 'iPad Air', image: '/ipad_nav/ipad_air.png' },
  { name: 'iPad', query: 'iPad', image: '/ipad_nav/ipad.png' },
  { name: 'iPad mini', query: 'iPad mini', image: '/ipad_nav/ipad_mini.png' },
  { name: 'Compare', path: '/compare?category=ipad', image: '/ipad_nav/ipad_compare.png' },
  { name: 'Apple Pencil', path: '/accessories?search=Pencil', image: '/ipad_nav/apple_pencil.png' },
  { name: 'Keyboards', path: '/accessories?search=Keyboard', image: '/ipad_nav/keyboards.png' },
  { name: 'Accessories', path: '/accessories', image: '/ipad_nav/accessories.png' }
];

export default function Ipad() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { products } = useSelector((state) => state.products);
  const [viewCols, setViewCols] = useState(4); // 2, 3, or 4 columns
  const [showLimit, setShowLimit] = useState(16); // 16, 32, 64
  const [sortBy, setSortBy] = useState('latest');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState({});
  const [activeTab, setActiveTab] = useState('all');
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
      if (targetNorm.includes('blue') || targetNorm.includes('sky')) return '/ipad_air_blue.jpg';
      if (targetNorm.includes('space gray') || targetNorm.includes('black') || targetNorm.includes('dark')) return '/ipad_category.jpg';
      if (targetNorm.includes('purple') || targetNorm.includes('pink')) return '/ipad_category_v3.png';
      if (targetNorm.includes('starlight') || targetNorm.includes('silver') || targetNorm.includes('white')) return '/ipad_category_v2.jpg';
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
  const dbIpads = products.filter(p => {
    const catName = p.category?.name || p.category?.toString() || '';
    const catSlug = p.category?.slug || '';
    return catName.toLowerCase() === 'ipads' ||
      catSlug.toLowerCase() === 'ipads' ||
      catName.toLowerCase().includes('ipad');
  }).map(p => {
    const firstImg = p.image || (p.images && p.images[0]);
    const isValidImg = firstImg && !firstImg.includes('mock-cloud');
    return {
      id: p._id || p.id,
      name: p.title || p.name,
      price: p.price,
      priceStr: `₹${p.price.toLocaleString()}`,
      image: isValidImg ? firstImg : '/ipad_category_v2.jpg',
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

  const combinedProducts = dbIpads;

  const getIpadSequenceRank = (productName) => {
    const name = (productName || '').toLowerCase();

    let sizeNum = 99; // Default for accessories or non-sized

    if (name.includes('mini') || name.includes('8.3')) {
      sizeNum = 8;
    } else if (name.includes('10.9-inch') || name.includes('10.9 inch') || name.includes('10.9"') || name.includes('10th gen') || (name.includes('ipad') && !name.includes('air') && !name.includes('pro') && !name.includes('mini') && !name.includes('pencil') && !name.includes('keyboard'))) {
      sizeNum = 10;
    } else if (name.includes('11-inch') || name.includes('11 inch') || name.includes('11"')) {
      sizeNum = 11;
    } else if (name.includes('12.9-inch') || name.includes('12.9 inch') || name.includes('12.9"')) {
      sizeNum = 12;
    } else if (name.includes('13-inch') || name.includes('13 inch') || name.includes('13"')) {
      sizeNum = 13;
    } else {
      const match = name.match(/(\d{1,2}(?:\.\d)?)\s*(?:-|\s)?(?:inch|in|\")/);
      if (match) {
        sizeNum = Math.floor(parseFloat(match[1]));
      }
    }

    let subWeight = 5;
    if (name.includes('mini')) subWeight = 1;
    else if (name.includes('ipad') && !name.includes('air') && !name.includes('pro')) subWeight = 2;
    else if (name.includes('air')) subWeight = 3;
    else if (name.includes('pro')) subWeight = 4;
    else if (name.includes('pencil') || name.includes('keyboard') || name.includes('case')) subWeight = 9;

    return sizeNum * 10 + subWeight;
  };

  const sortedProducts = [...combinedProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;

    // Default sequence: iPad mini (8.3") -> iPad (10.9") -> 11" iPad Air/Pro -> 13" iPad Air/Pro
    const rankA = getIpadSequenceRank(a.name || a.title);
    const rankB = getIpadSequenceRank(b.name || b.title);
    if (rankA !== rankB) return rankA - rankB;

    return 0;
  });

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
    <div className="min-h-screen bg-[#fcfcfc] text-[#1d1d1f] py-8 px-4 sm:px-8 md:px-12 lg:px-16 select-none animate-in fade-in duration-300 relative">

      {/* Title & Category Sub-Nav Header */}
      <div className="w-full bg-[#fcfcfc] pt-2 pb-4 select-none font-sans mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 text-left mb-6">
            iPad
          </h1>

          {/* Horizontal iPad Model Selector Row */}
          <div className="flex items-center gap-6 sm:gap-10 md:gap-12 overflow-x-auto no-scrollbar py-2">
            {IPAD_SUB_NAV_ITEMS.map((item, idx) => {
              const currentSearch = searchParams.get('search') || '';
              const isActive = currentSearch.toLowerCase() === (item.query || '').toLowerCase();

              return (
                <Link
                  key={idx}
                  to={item.path || (item.query ? `/ipad?search=${encodeURIComponent(item.query)}` : '/ipad')}
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



      {/* Controller Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-150 pb-6 mb-8 text-sm font-sans uppercase font-bold text-zinc-500 tracking-wider">
        <div className="text-zinc-800 text-xs tracking-widest">
          SHOWING ALL {filteredProducts.length} RESULTS
        </div>
      </div>

      {/* Filter Drawer */}
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

      {/* Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="group bg-white rounded-2xl overflow-hidden flex flex-col justify-between p-6 shadow-sm border border-zinc-100/50 hover:shadow-md hover:border-zinc-200/55 transition-all duration-300 relative text-left"
          >
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
              <div className="w-full h-64 flex items-center justify-center overflow-hidden mb-6 mt-4 p-4">
                <img
                  src={getProductImage(prod)}
                  alt={prod.name}
                  className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 select-none"
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
              {/* Color Dot Options Row */}
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
