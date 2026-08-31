import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart, ShoppingBag, Loader2, ChevronDown, Search, Laptop, Tablet, Smartphone, Watch, Headphones, Tv, Sparkles, Plug, CircleDot, Keyboard, Accessibility, Gamepad, Camera, PenTool, Activity, Home } from 'lucide-react';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist } from '../redux/wishlistSlice';
import { fetchProducts } from '../redux/productSlice';
import { matchesProductSearch } from '../utils/searchUtils';

// Products are loaded dynamically from e-commerce database API

export default function Accessories() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { products, loading } = useSelector((state) => state.products);
  const [selectedColors, setSelectedColors] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [localWishlist, setLocalWishlist] = useState({});
  const [showBrowseMenu, setShowBrowseMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [browseMode, setBrowseMode] = useState('product'); // 'product' or 'category'
  const [selectedProductFilter, setSelectedProductFilter] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [showExpandedFilter, setShowExpandedFilter] = useState(true);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null) {
      setSearchQuery(urlSearch);
    }
    const urlProduct = searchParams.get('product');
    if (urlProduct !== null) {
      setSelectedProductFilter(urlProduct);
    }
    const urlCategory = searchParams.get('category');
    if (urlCategory !== null) {
      setSelectedCategoryFilter(urlCategory);
    }
  }, [searchParams]);

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

  const handleColorChange = (productId, colorVal) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: colorVal }));
  };

  const getProductImage = (prod) => {
    const selectedColorName = selectedColors[prod.id];
    if (selectedColorName) {
      const foundColor = prod.colors.find((c) => c.name === selectedColorName);
      if (foundColor && foundColor.image) {
        return foundColor.image;
      }
      // Fallback: match index of color name with index of image in images array
      const colorIdx = prod.colors.findIndex((c) => (c.name || c) === selectedColorName);
      if (colorIdx !== -1 && prod.images && prod.images[colorIdx]) {
        return prod.images[colorIdx];
      }
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

  // Merge database accessories (where category contains accessories or it is a specific accessory)
  const dbAccessories = products.filter(p => {
    const catName = (p.category?.name || p.category?.toString() || '').toLowerCase();
    const catSlug = (p.category?.slug || '').toLowerCase();
    const titleLower = (p.title || p.name || '').toLowerCase();

    // Check if category is strictly accessories
    const isAccessoriesCat = catName.includes('accessories') || catSlug.includes('accessories');

    // Check if title has accessory keyword
    const isAccessoryKeyword = titleLower.includes('case') || 
                               titleLower.includes('band') || 
                               titleLower.includes('loop') ||
                               titleLower.includes('charger') ||
                               titleLower.includes('pencil') ||
                               titleLower.includes('adapter') ||
                               titleLower.includes('charm') ||
                               titleLower.includes('strap') ||
                               titleLower.includes('mount') ||
                               titleLower.includes('cable') ||
                               titleLower.includes('sleeve') ||
                               titleLower.includes('stand') ||
                               titleLower.includes('dock') ||
                               titleLower.includes('keychain');

    // If it's a main device, we exclude it
    let isMainDevice = false;

    // Exclude iPhones: title contains "iphone" but does not contain accessory keywords
    if (titleLower.includes('iphone') && 
        !titleLower.includes('case') && 
        !titleLower.includes('wallet') && 
        !titleLower.includes('cover') && 
        !titleLower.includes('protector') && 
        !titleLower.includes('mount') && 
        !titleLower.includes('charger')) {
      isMainDevice = true;
    }

    // Exclude iPads: title contains "ipad" but does not contain pencil, case, cover, keyboard, folio
    if (titleLower.includes('ipad') && 
        !titleLower.includes('pencil') && 
        !titleLower.includes('case') && 
        !titleLower.includes('cover') && 
        !titleLower.includes('keyboard') && 
        !titleLower.includes('folio')) {
      isMainDevice = true;
    }

    // Exclude MacBooks: title contains macbook / laptop (unless it is an accessory like adapter, charger, power, cable, magsafe, sleeve, case)
    if ((titleLower.includes('macbook') || titleLower.includes('laptop') || titleLower.includes('pc ')) &&
        !titleLower.includes('adapter') &&
        !titleLower.includes('charger') &&
        !titleLower.includes('power') &&
        !titleLower.includes('magsafe') &&
        !titleLower.includes('cable') &&
        !titleLower.includes('sleeve') &&
        !titleLower.includes('case') &&
        !titleLower.includes('cover') &&
        !titleLower.includes('dock') &&
        !titleLower.includes('stand')) {
      isMainDevice = true;
    }

    // Exclude Apple Watches: title contains "watch" but not band, loop, strap, case, charger
    if (titleLower.includes('watch') && 
        !titleLower.includes('band') && 
        !titleLower.includes('loop') && 
        !titleLower.includes('strap') && 
        !titleLower.includes('case') && 
        !titleLower.includes('charger')) {
      isMainDevice = true;
    }

    // Exclude AirPods: title contains "airpods" or "air pods" or "headphone" (unless earpods, plug, adapter, cable, case, charm, strap, stand)
    if ((titleLower.includes('airpods') || titleLower.includes('air pods') || titleLower.includes('headphone') || titleLower.includes('headphones')) && 
        !titleLower.includes('earpods') &&
        !titleLower.includes('plug') &&
        !titleLower.includes('adapter') &&
        !titleLower.includes('cable') &&
        !titleLower.includes('case') && 
        !titleLower.includes('charm') && 
        !titleLower.includes('strap') && 
        !titleLower.includes('stand')) {
      isMainDevice = true;
    }

    // Exclude Apple TV: title contains "tv" but not mount, cable, holder
    if (titleLower.includes('tv') && 
        !titleLower.includes('mount') && 
        !titleLower.includes('cable') && 
        !titleLower.includes('holder') &&
        !titleLower.includes('accessories') &&
        catName !== 'accessories') {
      isMainDevice = true;
    }

    // Exclude HomePods: title contains "homepod" but not mount, stand
    if (titleLower.includes('homepod') && !titleLower.includes('mount') && !titleLower.includes('stand')) {
      isMainDevice = true;
    }

    return (isAccessoriesCat || isAccessoryKeyword) && !isMainDevice;
  }).map(p => {
    const firstImg = p.image || (p.images && p.images[0]);
    const isValidImg = firstImg && !firstImg.includes('mock-cloud');
    return {
      id: p._id || p.id,
      name: p.title || p.name,
      price: p.price,
      priceStr: `₹${p.price.toLocaleString()}`,
      image: isValidImg ? firstImg : '/iphone17e_cases.jpg',
      images: p.images || [],
      colors: Array.isArray(p.colors) ? p.colors.map(c => {
        const name = typeof c === 'string' ? c : (c.name || '');
        const val = typeof c === 'string' ? c : (c.value || c.name || '');
        return { name, value: resolveColorValue(val) };
      }) : [],
      rating: p.rating || 5.0,
      isSoldOut: p.stock <= 0
    };
  });

  const combinedProducts = dbAccessories;

  const filteredProducts = combinedProducts.filter((prod) => {
    // 1. Availability filter (activeTab)
    if (activeTab === 'available' && prod.isSoldOut) return false;
    if (activeTab === 'soldout' && !prod.isSoldOut) return false;

    // 2. Search query filter
    if (searchQuery && !matchesProductSearch(prod, searchQuery)) return false;

    // 3. Product filter (selectedProductFilter)
    if (selectedProductFilter) {
      if (selectedProductFilter === 'mac' && !nameLower.includes('mac') && !nameLower.includes('pencil')) return false;
      if (selectedProductFilter === 'ipad' && !nameLower.includes('ipad') && !nameLower.includes('pencil')) return false;
      if (selectedProductFilter === 'iphone' && !nameLower.includes('iphone') && !nameLower.includes('case')) return false;
      if (selectedProductFilter === 'watch' && !nameLower.includes('watch') && !nameLower.includes('band') && !nameLower.includes('loop') && !nameLower.includes('strap')) return false;
      if (selectedProductFilter === 'airpods' && !nameLower.includes('airpod') && !nameLower.includes('max') && !nameLower.includes('pro')) return false;
      if (selectedProductFilter === 'tv-home' && !nameLower.includes('tv') && !nameLower.includes('home') && !nameLower.includes('pod')) return false;
      if (selectedProductFilter === 'beats' && !nameLower.includes('beats')) return false;
      if (selectedProductFilter === 'vision-pro' && !nameLower.includes('vision') && !nameLower.includes('pro')) return false;
    }

    // 4. Category filter (selectedCategoryFilter)
    if (selectedCategoryFilter) {
      if (selectedCategoryFilter === 'new-arrivals') return true; // mock filter
      if (selectedCategoryFilter === 'cases' && !nameLower.includes('case')) return false;
      if (selectedCategoryFilter === 'charging' && !nameLower.includes('charger') && !nameLower.includes('adapter') && !nameLower.includes('power') && !nameLower.includes('cable')) return false;
      if (selectedCategoryFilter === 'magsafe' && !nameLower.includes('magsafe')) return false;
      if (selectedCategoryFilter === 'headphones' && !nameLower.includes('audio') && !nameLower.includes('airpod') && !nameLower.includes('speaker') && !nameLower.includes('beats')) return false;
      if (selectedCategoryFilter === 'bands' && !nameLower.includes('band') && !nameLower.includes('loop') && !nameLower.includes('strap')) return false;
      if (selectedCategoryFilter === 'vision-pro' && !nameLower.includes('vision') && !nameLower.includes('pro')) return false;
      if (selectedCategoryFilter === 'home-office' && !nameLower.includes('keyboard') && !nameLower.includes('mouse') && !nameLower.includes('pencil') && !nameLower.includes('trackpad')) return false;
      if (selectedCategoryFilter === 'mice-keyboards' && !nameLower.includes('keyboard') && !nameLower.includes('mouse') && !nameLower.includes('trackpad')) return false;
      if (selectedCategoryFilter === 'airtag' && !nameLower.includes('airtag')) return false;
      if (selectedCategoryFilter === 'health-fitness' && !nameLower.includes('watch') && !nameLower.includes('band')) return false;
      if (selectedCategoryFilter === 'accessibility' && !nameLower.includes('case') && !nameLower.includes('pencil')) return false;
      if (selectedCategoryFilter === 'gaming' && !nameLower.includes('game') && !nameLower.includes('controller')) return false;
      if (selectedCategoryFilter === 'photography' && !nameLower.includes('camera') && !nameLower.includes('lens')) return false;
      if (selectedCategoryFilter === 'creative-tools' && !nameLower.includes('pencil') && !nameLower.includes('stylus')) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1d1d1f] py-4 select-none animate-in fade-in duration-300 relative font-sans">

      {/* Accessories Sub-Bar Header */}
      <div className="w-full border-b border-zinc-200/80 bg-white/85 backdrop-blur-md sticky top-12 z-30 py-3.5 px-4 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">Accessories</h2>

        {/* Browse dropdown menu */}
        <div className="relative">
          <button
            onClick={() => setShowBrowseMenu(!showBrowseMenu)}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-black font-semibold tracking-wide bg-transparent border-0 cursor-pointer"
          >
            Browse all <ChevronDown className="h-3 w-3 mt-0.5" />
          </button>

          {showBrowseMenu && (
            <div className="absolute right-0 mt-2.5 w-44 bg-white border border-zinc-150 rounded-2xl shadow-xl py-2 z-50 text-left animate-in fade-in slide-in-from-top-1 duration-200">
              <button
                onClick={() => { setActiveTab('all'); setShowBrowseMenu(false); }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-black"
              >
                All Accessories
              </button>
              <button
                onClick={() => { setActiveTab('available'); setShowBrowseMenu(false); }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-black"
              >
                In Stock
              </button>
              <button
                onClick={() => { setActiveTab('soldout'); setShowBrowseMenu(false); }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-black"
              >
                Sold Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-8 md:px-12 lg:px-16 py-8">





        {/* Category Products Grid List */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-zinc-400">
            <Loader2 className="h-8 w-8 animate-spin text-[#0071e3] mb-3" />
            <span className="text-sm">Loading premium accessories catalog...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center text-zinc-400">
            <span className="text-sm">No accessories found in this criteria.</span>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="group bg-white rounded-2xl overflow-hidden flex flex-col justify-between p-6 shadow-sm border border-zinc-100/50 hover:shadow-md hover:border-zinc-200/55 transition-all duration-300 relative text-left"
              >
                {/* Top Row Favorite Heart */}
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
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 select-none animate-in fade-in"
                    />
                  </div>

                  {/* Title with Dynamic Color Part Number */}
                  <h3 className="font-semibold text-[16px] leading-snug tracking-tight text-zinc-900 group-hover:text-zinc-900 transition-colors min-h-[48px]">
                    {prod.name}
                  </h3>
                </Link>

                {/* Non-clickable configurations / actions */}
                <div className="space-y-4 pt-2">
                  {/* Color Dot Options Row */}
                  {prod.colors && prod.colors.length > 0 && (
                    <div className="flex items-center justify-between gap-1.5 border-t border-zinc-100/60 pt-3">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Colors</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {prod.colors.map((color) => {
                          const isSelected = selectedColors[prod.id] === color.name || (!selectedColors[prod.id] && prod.colors[0]?.name === color.name);
                          return (
                            <button
                              key={color.name}
                              onClick={() => handleColorChange(prod.id, color.name)}
                              style={{ backgroundColor: color.value }}
                              className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-all border ${isSelected ? 'scale-125 border-zinc-800 ring-1 ring-zinc-400' : 'border-zinc-300 hover:scale-110'
                                }`}
                              title={color.name}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

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
        )}
      </div>
    </div>
  );
}
