import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldAlert, Star } from 'lucide-react';
import { fetchProductById, fetchProducts } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import Loader from '../components/Loader';
import axiosClient from '../services/axiosClient';

// Fallback definitions removed in favor of real database records

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentProduct, loading, products } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedRam, setSelectedRam] = useState('');
  const [activeTab, setActiveTab] = useState('specs');

  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Pincode and Recents states
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [pincodeMessage, setPincodeMessage] = useState('');
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const response = await axiosClient.get(`/reviews/${id}`);
      setReviews(response.data || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newRating) return alert('Please select a star rating');

    setSubmittingReview(true);
    try {
      await axiosClient.post('/reviews', {
        product: id,
        rating: newRating,
        comment: newComment
      });
      setNewComment('');
      setNewRating(5);
      fetchReviews(); // reload list
      alert('Review submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products]);

  // Track recently viewed products
  useEffect(() => {
    if (currentProduct && currentProduct._id) {
      const stored = localStorage.getItem('iincept_recent_views');
      let recents = stored ? JSON.parse(stored) : [];
      recents = recents.filter(x => x !== currentProduct._id);
      recents.unshift(currentProduct._id);
      recents = recents.slice(0, 8); // Keep last 8 unique IDs
      localStorage.setItem('iincept_recent_views', JSON.stringify(recents));
    }
  }, [currentProduct]);

  // Filter recently viewed details locally from catalog
  useEffect(() => {
    if (products && products.length > 0) {
      const stored = localStorage.getItem('iincept_recent_views');
      if (stored) {
        const ids = JSON.parse(stored);
        const filtered = ids
          .map(recentId => products.find(p => (p._id || p.id) === recentId))
          .filter(Boolean)
          .filter(p => (p._id || p.id) !== id);
        setRecentlyViewed(filtered.slice(0, 4));
      }
    }
  }, [products, id]);

  // Pincode calculation helper
  const checkPincodeDelivery = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeStatus('error');
      setPincodeMessage('Please enter a valid 6-digit Indian pincode.');
      return;
    }
    const metroPrefixes = ['11', '40', '56', '60', '70'];
    const prefix = pincode.substring(0, 2);
    if (metroPrefixes.includes(prefix)) {
      setPincodeStatus('metro');
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 2);
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
      setPincodeMessage(`Express Delivery Available! Estimated delivery by ${formattedDate} (Free Shipping).`);
    } else {
      setPincodeStatus('standard');
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
      setPincodeMessage(`Standard Shipping Available. Estimated delivery by ${formattedDate} (Free Shipping).`);
    }
  };

  const getProductFromStore = (prodId) => {
    if (!products || products.length === 0) return null;
    if (/^[0-9a-fA-F]{24}$/.test(prodId)) {
      return products.find(p => (p._id || p.id) === prodId);
    }
    const mockIdMap = {
      'ip17pm': 'iPhone 17 Pro Max',
      'ip17p': 'iPhone 17 Pro',
      'ipair': 'iPhone Air',
      'ip17': 'iPhone 17',
      'ip16pm': 'iPhone 17e',
      'ip16': 'iPhone 16',
      'mbneo': 'MacBook Neo 14-inch',
      'appletv4k': 'Apple TV 4K',
      'homepodmini': 'HomePod mini',
      'belkin3in1': 'Belkin UltraCharge Pro 3-in-1 Magnetic Charging Dock',
      'herschelsling': 'Herschel Cloud Sling for iPhone',
      'herscheltote': 'Herschel AirPods Tote Bag Charm',
      'ipadpro13': 'iPad Pro 13-inch (M4)',
      'ipadair13': 'iPad Air 13-inch (M4)',
      'ipad10': 'iPad 10.9-inch (10th Gen)',
      'watchultra2': 'Apple Watch Ultra 2',
      'watchseries10': 'Apple Watch Series 10',
      'watchse': 'Apple Watch SE',
      'airpodsmax': 'AirPods Max (USB-C)',
      'airpodspro2': 'AirPods Pro 2',
      'airpods4': 'AirPods 4'
    };
    const title = mockIdMap[prodId];
    if (title) {
      return products.find(p => (p.title || p.name) === title);
    }
    return null;
  };

  const localProduct = getProductFromStore(id);
  const product = currentProduct || localProduct;

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
    return PDP_COLOR_MAP[lowerVal] || '#cbd5e1';
  };

  // Helper to extract color-specific images
  const getColorImages = (colorName) => {
    if (!product) return [];
    if (!colorName) return product.images || [];
    
    // Find index and object/string of color in product.colors
    const colorIdx = (product.colors || []).findIndex(c => {
      const name = typeof c === 'object' ? c.name : c;
      return name?.toString().trim().toLowerCase() === colorName.toString().trim().toLowerCase();
    });

    if (colorIdx !== -1) {
      const colorObj = product.colors[colorIdx];
      if (colorObj && typeof colorObj === 'object') {
        if (colorObj.images && colorObj.images.length > 0) {
          return colorObj.images;
        }
        if (colorObj.image) {
          return [colorObj.image];
        }
      } else {
        // Fallback for flat string color arrays (matching corresponding image index)
        if (product.images && product.images[colorIdx]) {
          return [product.images[colorIdx]];
        }
      }
    }
    
    const variantImages = [];
    (product.variants || []).forEach(v => {
      if (v.color?.toString().trim().toLowerCase() === colorName.toString().trim().toLowerCase() && v.images) {
        v.images.forEach(img => {
          if (!variantImages.includes(img)) variantImages.push(img);
        });
      }
    });
    if (variantImages.length > 0) {
      return variantImages;
    }
    
    return product.images && product.images.length > 0 ? product.images : [];
  };

  // Variant setups
  let rawColors = product?.colors || [];
  if (rawColors.length === 0 && product?.variants && product.variants.length > 0) {
    const uniqueColors = [];
    product.variants.forEach(v => {
      if (v.color && !uniqueColors.includes(v.color)) {
        uniqueColors.push(v.color);
      }
    });
    rawColors = uniqueColors;
  }

  const colors = rawColors.map(c => {
    const cName = typeof c === 'object' ? c.name : c;
    const cVal = typeof c === 'object' ? resolveColorValue(c.value || c.name) : resolveColorValue(c);
    const variantImgs = getColorImages(cName);
    const cImg = typeof c === 'object' ? (c.image || c.images?.[0]) : (variantImgs?.[0] || '');
    return {
      name: cName || 'Default Color',
      value: cVal || '#cbd5e1',
      image: cImg,
      images: typeof c === 'object' ? (c.images || (c.image ? [c.image] : [])) : variantImgs
    };
  });

  let sizes = product?.sizes || [];
  if (sizes.length === 0 && product?.variants && product.variants.length > 0) {
    const uniqueSizes = [];
    product.variants.forEach(v => {
      if (v.size && !uniqueSizes.includes(v.size)) {
        uniqueSizes.push(v.size);
      }
    });
    sizes = uniqueSizes;
  }

  let storages = product?.storage || [];
  if (storages.length === 0 && product?.variants && product.variants.length > 0) {
    const uniqueStorage = [];
    product.variants.forEach(v => {
      if (v.storage && !uniqueStorage.includes(v.storage)) {
        uniqueStorage.push(v.storage);
      }
    });
    storages = uniqueStorage;
  }

  let rams = product?.ram || product?.rams || [];
  if (rams.length === 0 && product?.variants && product.variants.length > 0) {
    const uniqueRams = [];
    product.variants.forEach(v => {
      if (v.ram && !uniqueRams.includes(v.ram)) {
        uniqueRams.push(v.ram);
      }
    });
    rams = uniqueRams;
  }

  const activeColorName = selectedColor?.name || (colors[0]?.name || '');
  const galleryImages = getColorImages(activeColorName);

  const getCategoryLink = () => {
    const category = (product?.category?.name || product?.category || '').toString().toLowerCase();
    if (category.includes('iphone') || category.includes('smartphone')) return '/iphone';
    if (category.includes('mac') || category.includes('laptop')) return '/macbook';
    if (category.includes('ipad')) return '/ipad';
    if (category.includes('watch')) return '/watch';
    if (category.includes('airpod')) return '/airpods';
    if (category.includes('tv') || category.includes('home')) return '/tv-home';
    if (category.includes('accessory') || category.includes('accessories')) return '/accessories';
    return '/shop';
  };

  const getCategoryName = () => {
    return product?.category?.name || product?.category || 'iPhone';
  };

  // Determine active configurations
  useEffect(() => {
    if (product) {
      if (colors.length > 0) {
        setSelectedColor(colors[0]);
      } else {
        setSelectedColor(null);
      }

      if (sizes.length > 0) {
        setSelectedSize(sizes[0]);
      } else {
        setSelectedSize('');
      }

      if (storages.length > 0) {
        setSelectedStorage(storages[0]);
      } else {
        setSelectedStorage('');
      }

      if (rams.length > 0) {
        setSelectedRam(rams[0]);
      } else {
        setSelectedRam('');
      }
    }
  }, [product, colors.length, sizes.length, storages.length, rams.length]);

  // Set active image whenever selectedColor changes
  useEffect(() => {
    if (product) {
      const activeColorName = selectedColor?.name || (colors[0]?.name || '');
      const imgs = getColorImages(activeColorName);
      if (imgs && imgs.length > 0) {
        setActiveImage(imgs[0]);
      } else if (product.images && product.images.length > 0) {
        setActiveImage(product.images[0]);
      } else {
        setActiveImage('/iphone17p_orange_close.jpg');
      }
    }
  }, [selectedColor, product]);

  const handleColorSelect = (colorObj) => {
    setSelectedColor(colorObj);
  };

  // Helper to dynamically match variant price based on current selectors
  const getVariantPrice = (oColor, oSize, oStorage, oRam) => {
    if (!product) return 0;
    const defaultPrice = product.price || 0;
    if (!product.variants || product.variants.length === 0) return defaultPrice;

    let candidates = [...product.variants];

    const targetColorName = oColor ? (oColor.name || oColor) : selectedColor?.name;
    const targetSize = oSize !== undefined ? oSize : selectedSize;
    const targetStorage = oStorage !== undefined ? oStorage : selectedStorage;
    const targetRam = oRam !== undefined ? oRam : selectedRam;

    if (targetColorName && colors.length > 0) {
      const filtered = candidates.filter(v => v.color?.toString().toLowerCase() === targetColorName.toString().toLowerCase());
      if (filtered.length > 0) candidates = filtered;
    }
    if (targetSize && sizes.length > 0) {
      const filtered = candidates.filter(v => v.size?.toString().toLowerCase() === targetSize.toString().toLowerCase());
      if (filtered.length > 0) candidates = filtered;
    }
    if (targetStorage && storages.length > 0) {
      const filtered = candidates.filter(v => v.storage?.toString().toLowerCase() === targetStorage.toString().toLowerCase());
      if (filtered.length > 0) candidates = filtered;
    }
    if (targetRam && rams.length > 0) {
      const filtered = candidates.filter(v => v.ram?.toString().toLowerCase() === targetRam.toString().toLowerCase());
      if (filtered.length > 0) candidates = filtered;
    }

    if (candidates.length > 0 && candidates[0].price) {
      return Number(candidates[0].price);
    }
    return defaultPrice;
  };

  const unitPrice = getVariantPrice();
  const totalPrice = unitPrice * quantity;

  if (!product) {
    if (loading) {
      return <Loader message="Loading product details..." />;
    }
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-400">
        <ShieldAlert className="h-12 w-12 text-zinc-400 mb-3 animate-bounce" />
        <h2 className="text-xl font-bold text-zinc-800">Product Not Found</h2>
        <p className="text-sm text-zinc-550 mt-1">The product you are looking for does not exist in our database.</p>
        <Link to="/shop" className="mt-6 text-xs font-bold bg-zinc-950 text-white px-5 py-2.5 rounded-xl hover:bg-zinc-850 transition-colors">
          Explore Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    const colorName = selectedColor?.name || (colors[0]?.name || 'Standard');
    const detailsArr = [];
    if (selectedSize) detailsArr.push(selectedSize);
    if (selectedStorage) detailsArr.push(selectedStorage);
    if (selectedRam) detailsArr.push(selectedRam);
    detailsArr.push(colorName);
    const nameDetails = detailsArr.join(' / ');

    dispatch(addToCart({
      id: `${id}-${selectedSize || 'std'}-${selectedStorage || 'std'}-${selectedRam || 'std'}-${colorName}`,
      name: `${product.name || product.title} (${nameDetails})`,
      price: unitPrice,
      image: activeImage,
      quantity,
      size: selectedSize,
      storage: selectedStorage,
      ram: selectedRam,
      color: colorName,
      stock: product.stock || 10
    }));
    alert(`Added ${product.name || product.title} (${nameDetails}) to Order!`);
  };

  const handleRequestBulkQuote = () => {
    alert("Bulk Quote request submitted! Our B2B Account Desk will verify your request and contact you within 24 hours.");
  };

  if (loading && !localProduct) {
    return <Loader message="Loading product details..." />;
  }

  const colorName = selectedColor?.name || (colors[0]?.name || 'Standard');

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F] font-sans pb-12">
      
      {/* Dynamic Style Sheet block to inject template layout styles */}
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --ink: #FFFFFF; --ink-2: #F5F5F7; --ink-3: #101012; --paper: #1D1D1F;
          --blue: #0071E3; --line: rgba(0,0,0,0.10); --muted: rgba(29,29,31,0.62);
        }
        .wrap { max-width: 1240px; margin: 0 auto; padding: 0 28px; }
        .breadcrumb { padding: 18px 0; font-size: 13px; color: var(--muted); text-align: left; }
        .breadcrumb a:hover { color: var(--paper); }
        .breadcrumb span { margin: 0 6px; }

        .pdp { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 60px; padding: 20px 0 70px; }
        @media(max-width:920px) { .pdp { grid-template-columns: 1fr; } }

        .gallery { position: sticky; top: 90px; align-self: start; }
        .gallery-main {
          aspect-ratio: 1/1; border-radius: 18px; background: var(--ink-2);
          display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--line); overflow: hidden;
          transition: background .3s ease;
        }
        .gallery-thumbs { display: flex; gap: 10px; margin-top: 14px; }
        .gthumb { width: 64px; height: 64px; border-radius: 8px; border: 1px solid var(--line); background: var(--ink-2); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; }
        .gthumb img { object-fit: contain; width: 100%; height: 100%; }
        .gthumb.active { border-color: var(--paper); border-width: 2px; }

        .pinfo .eyebrow { font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--blue); font-weight: 700; margin-bottom: 10px; }
        .pinfo h1 { font-size: clamp(28px, 3.6vw, 38px); margin-bottom: 10px; font-family: 'Fraunces', serif; font-weight: 600; }
        .pinfo .price { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
        .pinfo .gst { font-size: 13px; color: var(--muted); margin-bottom: 28px; }

        .optgroup { margin-bottom: 28px; }
        .optgroup label { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); font-weight: 700; margin-bottom: 12px; }
        .swatches { display: flex; gap: 10px; }
        .swatch { width: 34px; height: 34px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; position: relative; box-shadow: 0 0 0 1px var(--line); }
        .swatch.active { border-color: var(--blue); }

        .optrow { display: flex; gap: 10px; flex-wrap: wrap; }
        .opt { border: 1px solid var(--line); padding: 12px 18px; border-radius: 8px; font-size: 13.5px; cursor: pointer; transition: all .15s ease; background: #fff; text-align: left; min-width: 110px; }
        .opt.active, .opt:hover { border-color: var(--paper); background: var(--ink-2); font-weight: 600; }
        .opt .sub { display: block; font-size: 11px; color: var(--muted); margin-top: 2px; }

        .acplans { display: flex; flex-direction: column; gap: 10px; }
        .acplan { border: 1px solid var(--line); border-radius: 8px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all .15s ease; text-align: left; }
        .acplan.active { border-color: var(--blue); background: #F0F7FF; }
        .acplan .t { font-size: 14px; font-weight: 600; } .acplan .s { font-size: 12px; color: var(--muted); }
        .acplan .p { font-size: 13px; font-weight: 600; }

        .qty { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
        .qty button { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--line); background: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .qty input { width: 60px; text-align: center; border: none; font-size: 15px; font-weight: 600; background: transparent; }

        .btnrow { display: flex; gap: 12px; margin-bottom: 30px; }
        .btn { padding: 15px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; flex: 1; text-align: center; transition: transform .15s ease; cursor: pointer; }
        .btn:hover { transform: translateY(-1px); }
        .btn-dark { background: var(--paper); color: #fff; border: none; }
        .btn-line { border: 1px solid var(--line); color: var(--paper); background: transparent; }

        .pdp-note { display: flex; gap: 10px; font-size: 13px; color: var(--muted); align-items: flex-start; margin-bottom: 10px; text-align: left; }
        .pdp-note .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--blue); margin-top: 6px; flex-shrink: 0; }

        /* DIVIDER */
        .divider { position: relative; height: 90px; overflow: hidden; background: var(--ink-3); margin-top: 30px; }
        .divider svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        .divider-label { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.55); font-size: 11px; letter-spacing: .18em; text-transform: uppercase; font-weight: 700; }

        /* BULK PRICING */
        .section { padding: 60px 0; text-align: left; }
        .section-head { max-width: 560px; margin-bottom: 34px; }
        .section-head h2 { font-size: clamp(24px, 3.2vw, 32px); font-family: 'Fraunces', serif; font-weight: 600; }
        .section-head p { color: var(--muted); margin-top: 10px; font-size: 15px; line-height: 1.6; }

        table.pricing { width: 100%; border-collapse: collapse; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
        table.pricing th, table.pricing td { padding: 16px 20px; text-align: left; font-size: 14px; border-bottom: 1px solid var(--line); }
        table.pricing th { background: var(--ink-2); font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); font-weight: 700; }
        table.pricing tr:last-child td { border-bottom: none; }
        table.pricing td.qty-tier { font-weight: 700; }
        table.pricing td.save { color: #1E8E5A; font-weight: 600; }

        /* SPEC TABS */
        .tabs { display: flex; gap: 0; border-bottom: 1px solid var(--line); margin-bottom: 24px; }
        .tab { padding: 14px 22px; font-size: 14px; font-weight: 600; color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent; }
        .tab.active { color: var(--paper); border-color: var(--paper); }
        .spectable { display: grid; grid-template-columns: 200px 1fr; gap: 0; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
        .spectable .k, .spectable .v { padding: 14px 18px; font-size: 13.5px; border-bottom: 1px solid var(--line); }
        .spectable .k { background: var(--ink-2); color: var(--muted); font-weight: 600; }
        .spectable .row { display: contents; }
        .spectable .row:last-child .k, .spectable .row:last-child .v { border-bottom: none; }
      `}} />

      <div className="wrap">
        <div className="breadcrumb">
          <Link to="/">Home</Link><span>/</span><Link to={getCategoryLink()}>{getCategoryName()}</Link><span>/</span>{product.name}
        </div>

        <div className="pdp">
          {/* Gallery Column */}
          <div className="gallery">
            <div className="gallery-main">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="object-contain max-h-[85%] max-w-[85%] mix-blend-multiply" 
              />
            </div>
            <div className="gallery-thumbs">
              {galleryImages.map((imgUrl, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`gthumb ${activeImage === imgUrl ? 'active' : ''}`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Column */}
          <div className="pinfo">
            <div className="eyebrow">Apple Authorised Reseller · In stock</div>
            <h1>{product.name || product.title}</h1>
            
            {/* Apple Part Number / MPN Badge */}
            {(selectedColor || product.partNumber || product.modelNumber || (product.variants && product.variants.length > 0)) && (() => {
              const activeVar = product.variants?.find(v => 
                (v.color === colorName || v.color === selectedColor?.name) &&
                (!selectedStorage || v.storage === selectedStorage)
              );
              const partNum = activeVar?.partNumber || activeVar?.sku || product.partNumber || product.modelNumber;
              if (!partNum) return null;
              return (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 rounded-md text-[11px] font-mono text-zinc-700 mb-3 border border-zinc-200 shadow-2xs">
                  <span className="font-bold text-zinc-900 uppercase">Part No:</span> {partNum}
                </div>
              );
            })()}

            <div className="price">₹{totalPrice.toLocaleString('en-IN')}</div>
            <div className="gst">Price includes GST · Formal tax invoice on every order</div>

            {/* Dynamic static Description Block */}
            {(product.description) && (
              <div className="my-6 text-sm text-zinc-650 leading-relaxed text-left border-b border-zinc-150 pb-5 font-sans" style={{ whiteSpace: 'pre-line' }}>
                {product.description}
              </div>
            )}

            {/* Color swatches */}
            <div className="optgroup">
              <label>Colour — {colorName}</label>
              <div className="swatches">
                {colors.map((cObj) => {
                  const isSelected = selectedColor?.name === cObj.name;
                  return (
                    <div 
                      key={cObj.name}
                      onClick={() => handleColorSelect(cObj)}
                      className={`swatch active`}
                      style={{ 
                        backgroundColor: cObj.value,
                        boxShadow: isSelected ? '0 0 0 2px #0071E3, 0 0 0 4px #fff' : '0 0 0 1px rgba(0,0,0,0.1)' 
                      }}
                      title={cObj.name}
                    ></div>
                  );
                })}
              </div>
            </div>

            {/* Size / Model options */}
            {sizes && sizes.length > 0 && (
              <div className="optgroup">
                <label>Size / Model</label>
                <div className="optrow">
                  {sizes.map((sz) => {
                    const displayPrice = getVariantPrice(null, sz, null, null);
                    return (
                      <div 
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`opt ${selectedSize === sz ? 'active' : ''}`}
                      >
                        {sz}
                        <span className="sub">₹{displayPrice.toLocaleString('en-IN')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Storage options */}
            {storages && storages.length > 0 && (
              <div className="optgroup">
                <label>Storage</label>
                <div className="optrow">
                  {storages.map((st) => {
                    const displayPrice = getVariantPrice(null, null, st, null);
                    return (
                      <div 
                        key={st}
                        onClick={() => setSelectedStorage(st)}
                        className={`opt ${selectedStorage === st ? 'active' : ''}`}
                      >
                        {st}
                        <span className="sub">₹{displayPrice.toLocaleString('en-IN')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* RAM options */}
            {rams && rams.length > 0 && (
              <div className="optgroup">
                <label>RAM (Memory)</label>
                <div className="optrow">
                  {rams.map((r) => {
                    const displayPrice = getVariantPrice(null, null, null, r);
                    return (
                      <div 
                        key={r}
                        onClick={() => setSelectedRam(r)}
                        className={`opt ${selectedRam === r ? 'active' : ''}`}
                      >
                        {r}
                        <span className="sub">₹{displayPrice.toLocaleString('en-IN')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}



            {/* Quantity */}
            <div className="optgroup">
              <label>Quantity</label>
              <div className="qty">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <input type="text" value={quantity} readOnly />
                <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="btnrow">
              <button onClick={handleAddToCart} className="btn btn-dark">Add to Order →</button>
              <button onClick={handleRequestBulkQuote} className="btn btn-line">Request Bulk Quote</button>
            </div>

            {/* PDP Notes */}
            <div className="pdp-note">
              <span className="dot"></span>
              <span>Bulk pricing automatically applies at checkout for 10+ units.</span>
            </div>
            <div className="pdp-note">
              <span className="dot"></span>
              <span>Delivered pan India, tracked door to door, 2–4 business days.</span>
            </div>
            <div className="pdp-note">
              <span className="dot"></span>
              <span>GST invoice and Apple Authorised Reseller warranty included.</span>
            </div>

            {/* Pincode Checker Card */}
            <div className="mt-6 p-4 border border-zinc-150 rounded-2xl bg-zinc-50/50 space-y-3">
              <label className="text-[10px] font-extrabold uppercase text-zinc-450 tracking-wider block">Pincode Delivery Eligibility</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode"
                  className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-800 flex-grow focus:outline-none focus:border-zinc-450"
                />
                <button
                  type="button"
                  onClick={checkPincodeDelivery}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer border-0"
                >
                  Verify
                </button>
              </div>
              {pincodeStatus && (
                <div className={`p-2.5 rounded-xl text-[11px] font-semibold border ${
                  pincodeStatus === 'error'
                    ? 'bg-rose-50 text-rose-700 border-rose-100'
                    : pincodeStatus === 'metro'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : 'bg-blue-50 text-[#0071e3] border-blue-100'
                }`}>
                  {pincodeMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Specs & Reviews Tabs Section */}
        <div className="border-t border-zinc-200 pt-10 mt-8">
          <div className="tabs flex gap-2 border-b border-zinc-200 mb-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3.5 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === 'specs' ? 'border-black text-black' : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3.5 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === 'reviews' ? 'border-black text-black' : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === 'specs' ? (
            <div className="spectable grid grid-cols-1 md:grid-cols-2 gap-4 border border-zinc-200 rounded-2xl overflow-hidden p-6 bg-zinc-50/50">
              <div className="grid grid-cols-3 border-b border-zinc-100 pb-2">
                <span className="font-bold text-xs text-zinc-400 uppercase">Brand</span>
                <span className="col-span-2 text-sm text-zinc-800 font-medium">{product.brand || 'Apple'}</span>
              </div>
              <div className="grid grid-cols-3 border-b border-zinc-100 pb-2">
                <span className="font-bold text-xs text-zinc-400 uppercase">Category</span>
                <span className="col-span-2 text-sm text-zinc-800 font-medium">{product.category?.name || product.category || 'Tech'}</span>
              </div>
              <div className="grid grid-cols-3 border-b border-zinc-100 pb-2">
                <span className="font-bold text-xs text-zinc-400 uppercase">Stock</span>
                <span className="col-span-2 text-sm text-zinc-800 font-medium">{product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'}</span>
              </div>
              <div className="grid grid-cols-3 border-b border-zinc-100 pb-2">
                <span className="font-bold text-xs text-zinc-400 uppercase">Warranty</span>
                <span className="col-span-2 text-sm text-zinc-800 font-medium">1 Year Manufacturer Warranty</span>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Reviews Summary Rating Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-6 bg-zinc-50/50 border border-zinc-200 rounded-2xl">
                <div className="text-center space-y-1">
                  <span className="text-4xl font-extrabold text-zinc-900">{product.rating || 5.0}</span>
                  <div className="flex justify-center gap-1 text-amber-500 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating || 5.0) ? 'fill-amber-500 text-amber-500' : 'text-zinc-300'}`} />
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1.5">{reviews.length} Customer Reviews</p>
                </div>

                <div className="md:col-span-2 space-y-2 text-xs">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = reviews.filter(r => r.rating === stars).length;
                    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : (stars === 5 ? 100 : 0);
                    return (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="w-12 text-zinc-500 font-bold">{stars} Stars</span>
                        <div className="flex-grow h-2 bg-zinc-200 rounded-full overflow-hidden">
                          <div className="h-full bg-zinc-900" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-zinc-400 font-semibold text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* List of customer reviews */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-sm text-zinc-500 italic p-4 text-center">Be the first to review this product.</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev._id} className="p-5 border border-zinc-200 rounded-2xl bg-white space-y-3 shadow-sm text-left">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-900 text-sm">{rev.user?.name || 'Anonymous User'}</span>
                            {rev.isVerified && (
                              <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <div className="flex gap-0.5 text-amber-500 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-zinc-200'}`} />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-semibold">
                          {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      {rev.comment && <p className="text-xs text-zinc-650 leading-relaxed text-left">{rev.comment}</p>}
                    </div>
                  ))
                )}
              </div>

              {/* Write a review form for logged in users */}
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="p-6 border border-zinc-200 rounded-2xl bg-zinc-50/50 space-y-4 text-left">
                  <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wide">Write a Customer Review</h3>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Select Star Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="text-zinc-300 hover:text-amber-500 cursor-pointer p-0 bg-transparent border-none"
                        >
                          <Star className={`h-6 w-6 ${star <= newRating ? 'fill-amber-500 text-amber-500' : 'text-zinc-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Write your Comment</label>
                    <textarea
                      rows="3"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Tell us what you like or dislike about this product..."
                      className="w-full bg-white border border-zinc-200 text-xs rounded-xl p-3 text-zinc-900 focus:outline-none focus:border-zinc-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-black hover:bg-zinc-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="p-5 border border-dashed border-zinc-200 rounded-2xl text-center text-zinc-500 bg-zinc-50 text-xs">
                  Please <Link to="/login" className="text-zinc-900 font-bold hover:underline">Login</Link> to share your review comment with other customers.
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      {/* Recommended Related Products */}
      {(() => {
        const relatedList = (products || []).filter(p => p.category === currentProduct?.category && (p._id || p.id) !== id).slice(0, 4);
        if (relatedList.length === 0) return null;
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 border-t border-zinc-100 pt-12 text-left">
            <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest block">Explore Similar Gear</span>
            <h2 className="text-xl font-black text-zinc-900 tracking-tight mt-2 mb-6">Recommended For You</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedList.map((p) => (
                <Link key={p._id} to={`/product/${p._id}`} className="group space-y-3 block">
                  <div className="aspect-[4/3] w-full rounded-2xl bg-zinc-50 border border-zinc-100 p-3 flex items-center justify-center overflow-hidden">
                    <img src={p.images?.[0]} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-350" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{p.brand}</span>
                    <h4 className="font-bold text-xs text-zinc-900 leading-snug line-clamp-1 group-hover:text-zinc-650 transition-colors">{p.title}</h4>
                    <p className="font-extrabold text-xs text-zinc-900 font-sans">₹{p.price?.toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 border-t border-zinc-100 pt-12 text-left">
          <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest block">Based on your visits</span>
          <h2 className="text-xl font-black text-zinc-900 tracking-tight mt-2 mb-6">Recently Viewed</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyViewed.map((p) => (
              <Link key={p._id} to={`/product/${p._id}`} className="group space-y-3 block">
                <div className="aspect-[4/3] w-full rounded-2xl bg-zinc-50 border border-zinc-100 p-3 flex items-center justify-center overflow-hidden">
                  <img src={p.images?.[0]} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-350" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{p.brand}</span>
                  <h4 className="font-bold text-xs text-zinc-900 leading-snug line-clamp-1 group-hover:text-zinc-650 transition-colors">{p.title}</h4>
                  <p className="font-extrabold text-xs text-zinc-900 font-sans">₹{p.price?.toLocaleString('en-IN')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Floating WhatsApp Widget */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#25d366',
          color: '#fff',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          zIndex: 1000,
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" style={{ width: '32px', height: '32px' }}>
          <path d="M12.012 2c-5.508 0-9.985 4.478-9.985 9.985 0 1.758.459 3.412 1.258 4.86L2 22l5.312-1.392c1.4.762 2.99 1.196 4.7 1.196 5.508 0 9.985-4.478 9.985-9.985 0-5.507-4.477-9.985-9.985-9.985zm0 17.986c-1.547 0-3.057-.417-4.375-1.206l-.313-.186-3.255.854.87-3.173-.205-.326c-.868-1.383-1.326-2.986-1.326-4.636 0-4.385 3.567-7.952 7.952-7.952 4.384 0 7.951 3.567 7.951 7.952 0 4.384-3.567 7.952-7.951 7.952zm4.359-5.966c-.239-.12-1.414-.698-1.634-.778-.22-.08-.38-.12-.54.12-.16.24-.62.778-.76.938-.14.16-.28.18-.519.06-.24-.12-1.012-.372-1.927-1.188-.713-.636-1.195-1.423-1.335-1.663-.14-.24-.015-.369.105-.489.108-.108.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.195-.47-.393-.406-.54-.414-.14-.007-.3-.007-.46-.007s-.42.06-.64.3c-.22.24-.84.82-.84 2.002 0 1.182.86 2.324.98 2.484.12.16 1.69 2.58 4.096 3.618.572.247 1.02.394 1.368.504.576.183 1.1.157 1.514.095.462-.069 1.414-.578 1.614-1.138.2-.56.2-1.04.14-1.138-.06-.098-.22-.178-.459-.298z" />
        </svg>
      </a>
    </div>
  );
}
