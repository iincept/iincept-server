import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/productSlice';
import axiosClient from '../services/axiosClient';

// Default Category Icons for the store strip
const DEFAULT_CATEGORY_STRIP = [
  { name: 'Mac', label: 'Mac', icon: '💻', image: '/category_strip/mac.png', path: '/macbook', isActive: true },
  { name: 'iPhone', label: 'iPhone', icon: '📱', image: '/category_strip/iphone.png', path: '/iphone', isActive: true },
  { name: 'iPad', label: 'iPad', icon: '📱', image: '/category_strip/ipad.png', path: '/ipad', isActive: true },
  { name: 'Watch', label: 'Watch', icon: '⌚', image: '/category_strip/watch.png', path: '/watch', isActive: true },
  { name: 'AirPods', label: 'AirPods', icon: '🎧', image: '/category_strip/airpods.png', path: '/airpods', isActive: true },
  { name: 'AirTag', label: 'AirTag', icon: '📍', image: '/category_strip/airtag.png', path: '/airtag', isActive: true },
  { name: 'Apple TV 4K', label: 'Apple TV 4K', icon: '📺', image: '/category_strip/appletv.png', path: '/tv-home', isActive: true },
  { name: 'HomePod', label: 'HomePod', icon: '🔊', image: '/category_strip/homepod.png', path: '/tv-home?search=HomePod', isActive: true },
  { name: 'Accessories', label: 'Accessories', icon: '🔌', image: '/category_strip/accessories.png', path: '/accessories', isActive: true },
];

export default function Home() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products || { products: [] });

  const testimonialSliderRef = useRef(null);

  const scrollTestimonials = (direction) => {
    if (testimonialSliderRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      testimonialSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // B2B Form State
  const [b2bForm, setB2bForm] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    productInterest: 'Select category',
    message: ''
  });
  const [b2bSubmitting, setB2bSubmitting] = useState(false);
  const [b2bSuccess, setB2bSuccess] = useState('');

  // Hero Section Settings with LocalStorage Cache
  const [heroData, setHeroData] = useState(() => {
    try {
      const cached = localStorage.getItem('iincept_home_hero_v2');
      if (cached) return JSON.parse(cached);
    } catch (e) { }
    return {
      homeHeroBadge: 'Apple Authorised Resellers across India',
      homeHeroTitle: 'The latest.\nThe best. Authorised.',
      homeHeroSubtitle: 'Genuine Apple products from India’s trusted mono-brand premium resellers. Exclusive offers, EMI & expert support.',
      homeHeroPrimaryBtnText: 'Shop Now',
      homeHeroPrimaryBtnLink: '/iphone',
      homeHeroSecondaryBtnText: 'Find Nearest Store',
      homeHeroSecondaryBtnLink: '#b2b-section',
      homeHeroImage: ''
    };
  });

  // Deal of the Week State
  const [dealData, setDealData] = useState({
    dealEyebrow: 'Deal of the Week',
    dealTitle: 'MacBook Neo – Stock Clearance',
    dealDesc: 'Amazing Mac at a surprising price. Limited stock this week. Exclusive bank offers + free AppleCare+ for first 50 buyers.',
    dealPrice: '₹72,900',
    dealOldPrice: '₹79,900',
    dealButtonText: 'Grab the Deal',
    dealButtonLink: '/macbook',
    dealImage: '/mac_nav/macbook_neo.png'
  });

  // Category Strip Default Images Lookup
  const DEFAULT_CATEGORY_IMAGES = {
    'Mac': '/category_strip/mac.png',
    'iPhone': '/category_strip/iphone.png',
    'iPad': '/category_strip/ipad.png',
    'Watch': '/category_strip/watch.png',
    'AirPods': '/category_strip/airpods.png',
    'AirTag': '/category_strip/airtag.png',
    'Apple TV 4K': '/category_strip/appletv.png',
    'HomePod': '/category_strip/homepod.png',
    'Accessories': '/category_strip/accessories.png',
  };

  const sanitizeCategoryItem = (item) => {
    if (!item) return null;
    const key = item.name || item.label;
    if (key === 'Gift Card') return null;
    let img = (item.image || '').trim();
    if (img.startsWith('*')) img = img.replace(/^\*\s*/, '');

    const matchKey = Object.keys(DEFAULT_CATEGORY_IMAGES).find(
      k => k.toLowerCase() === (key || '').toLowerCase()
    ) || key;

    const fallbackImg = DEFAULT_CATEGORY_IMAGES[matchKey] || DEFAULT_CATEGORY_IMAGES['Mac'];

    if (!img || key.toLowerCase() === 'ipad' || key.toLowerCase() === 'watch' || key.toLowerCase() === 'airpods' || key.toLowerCase() === 'iphone' || key.toLowerCase() === 'homepod' || key.toLowerCase() === 'airtag' || img.includes('…') || img.includes('traceId') || img.includes('store-card-13-iphone') || img.includes('store-card-13-watch') || img.includes('store-card-13-appletv') || img.includes('store-card-13-accessories')) {
      img = fallbackImg;
    }

    return { ...item, image: img || fallbackImg };
  };

  // Category Strip Icons
  const [categoryStrip, setCategoryStrip] = useState(() => {
    try {
      const cached = localStorage.getItem('iincept_home_category_icons_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(sanitizeCategoryItem).filter(Boolean);
        }
      }
    } catch (e) { }
    return DEFAULT_CATEGORY_STRIP.map(sanitizeCategoryItem).filter(Boolean);
  });

  // Dynamic Categories from Settings
  const [appleCategories, setAppleCategories] = useState(() => {
    try {
      const cached = localStorage.getItem('iincept_apple_categories_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) { }
    return [
      { name: 'Mac', actionText: 'Shop all models →', link: '/macbook', image: 'https://i3-prod-assets.indiaistore.com/files/uploads/categories/mac/home-img-1776683069_8064.png', icon: '💻' },
      { name: 'iPhone', actionText: 'Shop all models →', link: '/iphone', image: 'https://i3-prod-assets.indiaistore.com/files/uploads/categories/iphone/home-img-1776683084_2967.png', icon: '📱' },
      { name: 'iPad', actionText: 'Shop all models →', link: '/ipad', image: 'https://i3-prod-assets.indiaistore.com/files/uploads/categories/ipad/home-img-1776683096_1014.png', icon: '📱' },
      { name: 'Watch', actionText: 'Shop all models →', link: '/watch', image: 'https://i3-prod-assets.indiaistore.com/files/uploads/categories/watch/home-img-1757682221_3904.jpg', icon: '⌚' },
      { name: 'AirPods', actionText: 'Shop all models →', link: '/airpods', image: 'https://i3-prod-assets.indiaistore.com/files/uploads/categories/music/home-img-1757682200_3577.jpg', icon: '🎧' },
      { name: 'TV & Home', actionText: 'Shop all models →', link: '/tv-home', image: 'https://i3-prod-assets.indiaistore.com/files/uploads/categories/tv/home-img-1694070636_757.png', icon: '📺' },
      { name: 'Accessories', actionText: 'Shop all models →', link: '/accessories', image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/store-card-13-accessories-nav-202409?wid=400&hei=300&fmt=png-alpha', icon: '🔌' },
      { name: 'AppleCare+', actionText: 'Explore coverage →', link: '/applecare', image: '/applecare_official_hero.png', icon: '🛡️' },
    ];
  });

  // Dynamic New Arrivals from Admin Settings
  const [homeNewArrivals, setHomeNewArrivals] = useState(() => {
    try {
      const cached = localStorage.getItem('iincept_home_new_arrivals_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { }
    return [];
  });

  // Testimonials State
  const [testimonials, setTestimonials] = useState([
    {
      stars: 5,
      text: '“Purchased MacBook Air M4 from the authorised store. Staff was extremely knowledgeable and helped with EMI options. Delivery was next day. Highly recommended.”',
      author: 'Anjali Sharma',
      sub: 'MacBook Air · Bengaluru'
    },
    {
      stars: 5,
      text: '“Best experience buying iPhone 17 Pro. Got bank offer + trade-in value explained clearly. Genuine product with full warranty. Will buy again.”',
      author: 'Rahul Kapoor',
      sub: 'iPhone 17 Pro · Mumbai'
    },
    {
      stars: 5,
      text: '“Corporate order for 25 iPads was handled smoothly. Dedicated manager, proper invoicing and on-time delivery. Excellent B2B support.”',
      author: 'Priya Singh',
      sub: 'B2B Order · Delhi NCR'
    }
  ]);

  useEffect(() => {
    dispatch(fetchProducts());
    fetchSiteSettings();
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTarget = params.get('scroll');
    if (scrollTarget === 'procurement' || scrollTarget === 'b2b') {
      setTimeout(() => {
        const section = document.getElementById('b2b-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [location]);

  const fetchSiteSettings = async () => {
    try {
      const response = await axiosClient.get('/settings');
      if (response.data) {
        const updatedHero = {
          homeHeroBadge: response.data.homeHeroBadge || 'Apple Authorised Resellers across India',
          homeHeroTitle: response.data.homeHeroTitle || 'The latest.\nThe best. Authorised.',
          homeHeroSubtitle: response.data.homeHeroSubtitle || 'Genuine Apple products from India’s trusted mono-brand premium resellers. Exclusive offers, EMI & expert support.',
          homeHeroPrimaryBtnText: response.data.homeHeroPrimaryBtnText || 'Shop Now',
          homeHeroPrimaryBtnLink: response.data.homeHeroPrimaryBtnLink || '/iphone',
          homeHeroSecondaryBtnText: response.data.homeHeroSecondaryBtnText || 'Find Nearest Store',
          homeHeroSecondaryBtnLink: response.data.homeHeroSecondaryBtnLink || '#b2b-section',
          homeHeroImage: response.data.homeHeroImage || ''
        };

        setHeroData(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(updatedHero)) {
            try {
              localStorage.setItem('iincept_home_hero_v2', JSON.stringify(updatedHero));
            } catch (e) { }
            return updatedHero;
          }
          return prev;
        });

        if (response.data.dealTitle || response.data.dealPrice) {
          setDealData({
            dealEyebrow: response.data.dealEyebrow || 'Deal of the Week',
            dealTitle: response.data.dealTitle || 'MacBook Neo – Stock Clearance',
            dealDesc: response.data.dealDesc || 'Amazing Mac at a surprising price. Limited stock this week. Exclusive bank offers + free AppleCare+ for first 50 buyers.',
            dealPrice: response.data.dealPrice || '₹72,900',
            dealOldPrice: response.data.dealOldPrice || '₹79,900',
            dealButtonText: response.data.dealButtonText || 'Grab the Deal',
            dealButtonLink: response.data.dealButtonLink || '/macbook',
            dealImage: response.data.dealImage || '/mac_nav/macbook_neo.png'
          });
        }

        if (response.data.homeCategoryIcons && response.data.homeCategoryIcons.length > 0) {
          const activeIcons = response.data.homeCategoryIcons
            .filter(i => i.isActive !== false)
            .map(sanitizeCategoryItem)
            .filter(Boolean);
          if (activeIcons.length > 0) {
            setCategoryStrip(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(activeIcons)) {
                try {
                  localStorage.setItem('iincept_home_category_icons_v2', JSON.stringify(activeIcons));
                } catch (e) { }
                return activeIcons;
              }
              return prev;
            });
          }
        }

        if (response.data.homeNewArrivals && response.data.homeNewArrivals.length > 0) {
          const activeArrivals = response.data.homeNewArrivals.filter(i => i.isActive !== false);
          if (activeArrivals.length > 0) {
            setHomeNewArrivals(activeArrivals);
            try {
              localStorage.setItem('iincept_home_new_arrivals_v2', JSON.stringify(activeArrivals));
            } catch (e) { }
          }
        }

        if (response.data.appleCategories && response.data.appleCategories.length > 0) {
          const activeCats = response.data.appleCategories
            .filter(c => c.isActive !== false)
            .map(c => ({ ...c, image: (c.image || '').trim() }));
          if (activeCats.length > 0) {
            setAppleCategories(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(activeCats)) {
                try {
                  localStorage.setItem('iincept_apple_categories_v2', JSON.stringify(activeCats));
                } catch (e) { }
                return activeCats;
              }
              return prev;
            });
          }
        }

        if (response.data.testimonials && response.data.testimonials.length > 0) {
          setTestimonials(response.data.testimonials.map(t => ({
            stars: t.stars || 5,
            text: t.text || '',
            author: t.author || 'Verified Customer',
            sub: t.sub || t.company || 'Apple Authorised Reseller'
          })));
        }
      }
    } catch (err) {
      console.error('Failed to load homepage settings:', err);
    }
  };

  const handleB2bSubmit = async (e) => {
    e.preventDefault();
    if (!b2bForm.fullName.trim() || !b2bForm.email.trim()) {
      alert('Full Name and Email are mandatory.');
      return;
    }

    setB2bSubmitting(true);
    const waMessage = `Hello iiNCEPT Team! 👋\n\nI want to request a corporate / retail quotation:\n\n👤 *Name:* ${b2bForm.fullName}\n🏢 *Company:* ${b2bForm.company || 'N/A'}\n📧 *Email:* ${b2bForm.email}\n📞 *Phone:* ${b2bForm.phone || 'N/A'}\n📦 *Product Interest:* ${b2bForm.productInterest}\n💬 *Message:* ${b2bForm.message || 'N/A'}`;
    const waUrl = `https://wa.me/918607222417?text=${encodeURIComponent(waMessage)}`;

    try {
      await axiosClient.post('/enquiries', {
        companyName: b2bForm.company || 'N/A',
        fullName: b2bForm.fullName,
        email: b2bForm.email,
        phone: b2bForm.phone,
        productInterest: b2bForm.productInterest,
        quantity: 1,
        message: b2bForm.message
      });
    } catch (err) {
      console.error('Enquiry submission note:', err);
    } finally {
      window.open(waUrl, '_blank');
      setB2bSuccess('Request submitted successfully! Opening WhatsApp chat...');
      setB2bForm({
        fullName: '',
        company: '',
        email: '',
        phone: '',
        productInterest: 'Select category',
        message: ''
      });
      setB2bSubmitting(false);
      setTimeout(() => setB2bSuccess(''), 5000);
    }
  };

  const extractFirstValidImage = (p) => {
    if (!p) return null;
    if (p.image && typeof p.image === 'string' && p.image.trim() && !p.image.includes('mock-cloud')) {
      return p.image.trim();
    }
    if (Array.isArray(p.images) && p.images.length > 0) {
      const found = p.images.find(img => typeof img === 'string' && img.trim() && !img.includes('mock-cloud'));
      if (found) return found.trim();
    }
    if (Array.isArray(p.variants) && p.variants.length > 0) {
      for (const v of p.variants) {
        if (v.image && typeof v.image === 'string' && v.image.trim() && !v.image.includes('mock-cloud')) {
          return v.image.trim();
        }
        if (Array.isArray(v.images) && v.images.length > 0) {
          const found = v.images.find(img => typeof img === 'string' && img.trim() && !img.includes('mock-cloud'));
          if (found) return found.trim();
        }
      }
    }
    if (Array.isArray(p.colors) && p.colors.length > 0) {
      for (const c of p.colors) {
        if (typeof c === 'object' && c) {
          if (c.image && typeof c.image === 'string' && c.image.trim() && !c.image.includes('mock-cloud')) {
            return c.image.trim();
          }
          if (Array.isArray(c.images) && c.images.length > 0) {
            const found = c.images.find(img => typeof img === 'string' && img.trim() && !img.includes('mock-cloud'));
            if (found) return found.trim();
          }
        }
      }
    }
    return null;
  };

  const getProductImage = (p, fallback) => {
    const titleLower = (p?.title || p?.name || '').toLowerCase();
    if (titleLower.includes('mini') && titleLower.includes('mac')) {
      return 'https://www.apple.com/assets-www/en_WW/mac/04_chapternav/small/nav_mac_mini_f628f615d_2x.png';
    }
    const extracted = extractFirstValidImage(p);
    if (extracted) {
      return extracted;
    }
    return fallback;
  };

  // Products from Database / Admin Settings for New Arrivals & Trending
  const newArrivalsList = (homeNewArrivals && homeNewArrivals.length > 0)
    ? homeNewArrivals
    : [
        { id: '1', name: 'iPhone Duo', tagline: 'Hello, hello.', price: 'From ₹299900.00', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-iphone-duo-202609_GEO_IN?wid=800&hei=1000&fmt=p-jpg&qlt=80&.v=UzBXQnlhUWdraTNvNU1Kb3pEQlpXTmRieWJxSUI5TWh3VExiQnFCdzRFUVIzWjZtanZvZXBzWDFVU2JjN3Z3cXN2Mmx4a3VvSnUzaFUvSVlVRUJkbEd4TmxtT1p0QkhPako5RlJBUjZ0OU9Hc0wyUy9Qc3BoTzNXSHJVRHo5eGk&traceId=1', imageWebp: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-iphone-duo-202609_GEO_IN?wid=800&hei=1000&fmt=webp&qlt=90&.v=UzBXQnlhUWdraTNvNU1Kb3pEQlpXTmRieWJxSUI5TWh3VExiQnFCdzRFUVIzWjZtanZvZXBzWDFVU2JjN3Z3cXBxK0ZBNmxGbmUyUFZlUkRMaDBrbFIrM1V0MXQ3L01IeDRJOXlOYjZtNC9JTVpqRTIzSGM4czgvT0dWYlpqZnY&traceId=1', path: '/iphone' },
        { id: '2', name: 'iPhone 18 Pro', tagline: 'The ultimate performance and camera of any iPhone, with exceptional battery life.', price: 'From ₹164900.00', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-iphone-18-pro-202609?wid=800&hei=1000&fmt=p-jpg&qlt=80&.v=UzBXQnlhUWdraTNvNU1Kb3pEQlpXSWQybG1sZ1oxVnEyWjA5KzltU01ZTFNab1lJcUZwSFVRK1htYlNmZUtPTFN5aWNYUFpIbkFhdm03T3BzSjdVSTVTUzBFNlNoQ3JiRWpkVzhGb1Q5YkVkMVhIT21KNHhMTmc3TkpqWGZITDg&traceId=1', imageWebp: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-iphone-18-pro-202609?wid=800&hei=1000&fmt=webp&qlt=90&.v=UzBXQnlhUWdraTNvNU1Kb3pEQlpXSWQybG1sZ1oxVnEyWjA5KzltU01ZTFNab1lJcUZwSFVRK1htYlNmZUtPTFJ2R3NEUGt3Q2tTUTNWU09neHFkdWRUL1Azd1lsYk5RbEsxZXhvbThSV3VXS3B5dFRDdHdOWGF6ZzVmZHdiRWc&traceId=1', path: '/iphone', isDark: true },
        { id: '3', name: 'Apple Watch Series 12', tagline: 'The most accurate heart rate sensing in a wearable.', price: 'From ₹56900.00', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-watch-series-12-202609?wid=800&hei=1000&fmt=p-jpg&qlt=80&.v=QWhYaUFuRS9hTUliZ3N5RWVCV09vaG9ZUW1EeWY5MUtXMHdLVXUrS2thUHJ5SDBWM0EzY1NDZnVpYTkvandVRHFmS3YvQ0doSFZENndQR0J4TTRqbndQU2JvQ0JiRmZoU0hNWVplaGs5aHNPYUtSMVh2bmhjSFBDSFo4T3FRS0E&traceId=1', imageWebp: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-watch-series-12-202609?wid=800&hei=1000&fmt=webp&qlt=90&.v=QWhYaUFuRS9hTUliZ3N5RWVCV09vaG9ZUW1EeWY5MUtXMHdLVXUrS2thUHJ5SDBWM0EzY1NDZnVpYTkvandVRGdpcjhyQnJrZTk3NDVpVGh0RDBPL1dlb1hSRFZ1bHlsVUx3SFRzY0JhYVpmcTUrTlhNMWhLS2RHRXhjZnVURVQ&traceId=1', path: '/watch', isDark: true },
        { id: '4', name: 'Apple Watch Ultra 4', tagline: 'The ultimate sports and adventure watch.', price: 'From ₹89900.00', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-watch-ultra-4-202609_GEO_IN?wid=800&hei=1000&fmt=p-jpg&qlt=80&.v=QWhYaUFuRS9hTUliZ3N5RWVCV09vdmMxTi9MK0F4TUMvaEkrKzQrSzRpbmJRMGtnQk93bkNnOFNhZmw1MVVDSWVEb1lRcjg2U0o3bTMvMkR2S2VvTnZXdlJRYjdSZWJHVUh4aFVDb0hhVVdPc2ZIZ0tBZThMV3hSNUJIL00xdlQ&traceId=1', imageWebp: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-watch-ultra-4-202609_GEO_IN?wid=800&hei=1000&fmt=webp&qlt=90&.v=QWhYaUFuRS9hTUliZ3N5RWVCV09vdmMxTi9MK0F4TUMvaEkrKzQrSzRpbmJRMGtnQk93bkNnOFNhZmw1MVVDSWVKTWtXODFGZ1ZIUk9hUHM3RHc0QTYyL0ZSTzZrMWlpUU5CQlpuNHNUZzhtZXFyaVZWaHlPbUpXd09SVC9rbDc&traceId=1', altText: 'Apple Watch Ultra 4, titanium case, natural colour, right side exterior, raised side button, microphone, Digital Crown dial, Ocean Band, translucent grey colour', path: '/watch', isDark: true },
        { id: '5', name: 'AirPods 5', tagline: 'Discover the magic of Active Noise Cancellation.', price: 'From ₹14900.00', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-airpods-5-202609?wid=800&hei=1000&fmt=p-jpg&qlt=80&.v=WlczMnlkejNQakk5eW14MEJjQmdLL1htQlViQlcvWm01TkRFbWQ1bFdVbjkvamYzRzRvcFlnajNacmhEOC9BeGJLRkx3RDVvZWFBZ2pOaXMvUXhHQ2FFWGwxTDd3djQwdSt4b3ZkbTdjbXVKTExiOEFsRmxtQ2Nua0tRSC83MkI&traceId=1', imageWebp: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-airpods-5-202609?wid=800&hei=1000&fmt=webp&qlt=90&.v=WlczMnlkejNQakk5eW14MEJjQmdLL1htQlViQlcvWm01TkRFbWQ1bFdVbjkvamYzRzRvcFlnajNacmhEOC9BeEZXZzlzM2cwVmJseGdsS3RYT09za2g5YnJpZi9mWTcyN0pxRVpBcDU2UnArYWpGdS9XeFgvbS9ITnNYOEhYaG4&traceId=1', altText: 'AirPods 5: wireless earbuds, white color, oval-shaped, ear tip with interior acoustic speaker mesh, short stem with silver charging connector, left and right letter indicators', path: '/airpods', isDark: false },
        { id: '6', name: 'Mac mini', tagline: 'Now with M6 and M5 Pro.', price: 'From ₹99900.00', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-mac-mini-202609?wid=800&hei=1000&fmt=p-jpg&qlt=80&.v=MjhMcWJ2MGZwbXEwdnBkcUN6ZnhyejZjVlVyTm9aMTIzM2ZlTDJiaTlnRDZXYXJlRUd1cTBYTnRnbTNlazIvM01BZktNRDRIeDREMEYwa1NOSWNvMENpK0pSNjVsZ2N0cUJVQnVDU1lqdHQrYWpGdS9XeFgvbS9ITnNYOEhYaG4&traceId=1', imageWebp: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-mac-mini-202609?wid=800&hei=1000&fmt=webp&qlt=90&.v=MjhMcWJ2MGZwbXEwdnBkcUN6ZnhyejZjVlVyTm9aMTIzM2ZlTDJiaTlnRDZXYXJlRUd1cTBYTnRnbTNlazIvMzl4VGJTa0Z6K25XajlIZ3dxUWxxaFVyemZ6RkRPaG5jU2paRVdtZHhabXc&traceId=1', altText: 'Mac mini, front exterior, two Thunderbolt ports, status indicator light and 3.5‑millimetre headphone jack, tapered black base at bottom, flat top, rounded sides, straight edges, silver colour enclosure', path: '/macbook', isDark: false },
        { id: '7', name: 'Mac Studio', tagline: 'Now with M5 Max and M5 Ultra.', price: 'From ₹279900.00', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-mac-studio-202609?wid=800&hei=1000&fmt=p-jpg&qlt=80&.v=MjhMcWJ2MGZwbXEwdnBkcUN6ZnhyeU9aVHlIUTN0TDFoV3YrODdyNm1Ucm45S05qekNUdVUwMVFyK1pKaERUd3ZGdXpoZGFjcnJiZGtXTlNNRSszQWpLV0ZtaSt4V1ZKUFd0a1JsdUUwbENacXFoWC9uNWRBVmx4VTBHaHVxM3Y&traceId=1', imageWebp: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-mac-studio-202609?wid=800&hei=1000&fmt=webp&qlt=90&.v=MjhMcWJ2MGZwbXEwdnBkcUN6ZnhyeU9aVHlIUTN0TDFoV3YrODdyNm1Ucm45S05qekNUdVUwMVFyK1pKaERUd3lPWjFvdU5EZVdwUnRCZ2RHSDBFS3R0bEJITXZrbjRjcGpoK0NsSlhQUCtWZWZKZEpnTUg2bTJtOU9qU1hvcWw&traceId=1', altText: 'Mac Studio, front exterior, two USB‑C ports, SDXC card slot, status indicator light, tapered base at bottom, flat top, rounded sides, straight edges, silver colour enclosure', path: '/macbook', isDark: false }
      ];

  const trendingList = products.length > 3
    ? products.slice(3, 7).map(p => ({
      id: p._id || p.id,
      name: p.title || p.name,
      price: `From ₹${(p.price || 59900).toLocaleString('en-IN')}`,
      image: getProductImage(p, '/iphone_nav/iphone_17.png'),
      path: `/product/${p._id || p.id}`
    }))
    : [
      { id: 't1', name: 'iPhone 17', price: 'From ₹82,900', image: '/iphone_nav/iphone_17.png', path: '/iphone' },
      { id: 't2', name: 'MacBook Air M5', price: 'From ₹1,09,900', image: '/mac_nav/macbook_air.png', path: '/macbook' },
      { id: 't3', name: 'AirPods Pro 3', price: 'From ₹24,900', image: '/airpods_category_uploaded.png', path: '/airpods' },
      { id: 't4', name: 'iPad Air M4', price: 'From ₹59,900', image: '/ipad_nav/ipad_air.png', path: '/ipad' }
    ];

  return (
    <div className="indiaistore-theme">
      <style>{`
        .indiaistore-theme {
          --apple-black: #1d1d1f;
          --apple-gray: #86868b;
          --apple-light: #f5f5f7;
          --apple-blue: #0071e3;
          --apple-blue-hover: #0077ed;
          --white: #ffffff;
          --border: #d2d2d7;
          --shadow: 0 4px 24px rgba(0,0,0,0.06);
          --shadow-hover: 0 12px 40px rgba(0,0,0,0.12);

          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
          color: var(--apple-black);
          background: var(--white);
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          user-select: none;
        }

        .indiaistore-theme a { text-decoration: none; color: inherit; }
        .indiaistore-theme img { max-width: 100%; display: block; }

        /* ========== HERO BANNER (Apple style full-width) ========== */
        .indiaistore-theme .hero-banner {
          position: relative;
          width: 100%;
          height: 580px;
          background: linear-gradient(180deg, #000000 0%, #1a1a1a 100%);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
        }

        .indiaistore-theme .hero-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(0,113,227,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .indiaistore-theme .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          padding: 0 24px;
        }

        .indiaistore-theme .hero-eyebrow {
          font-size: 17px;
          font-weight: 600;
          color: #2997ff;
          margin-bottom: 12px;
          letter-spacing: -0.2px;
        }

        .indiaistore-theme .hero-banner h1 {
          font-size: clamp(42px, 7vw, 72px);
          font-weight: 700;
          letter-spacing: -2px;
          line-height: 1.05;
          margin-bottom: 16px;
        }

        .indiaistore-theme .hero-sub {
          font-size: 21px;
          color: rgba(255,255,255,0.85);
          max-width: 560px;
          margin: 0 auto 32px;
          font-weight: 400;
        }

        .indiaistore-theme .hero-ctas {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .indiaistore-theme .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 28px;
          border-radius: 980px;
          font-size: 17px;
          font-weight: 500;
          transition: all 0.25s ease;
          cursor: pointer;
          border: none;
          text-decoration: none;
        }

        .indiaistore-theme .btn-primary {
          background: var(--apple-blue);
          color: white !important;
        }
        .indiaistore-theme .btn-primary:hover {
          background: var(--apple-blue-hover);
          transform: scale(1.03);
        }

        .indiaistore-theme .btn-secondary {
          background: transparent;
          color: #2997ff !important;
          border: 1px solid rgba(41,151,255,0.6);
        }
        .indiaistore-theme .btn-secondary:hover {
          background: rgba(41,151,255,0.12);
        }

        .indiaistore-theme .hero-visual-hint {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.5px;
        }

        .indiaistore-theme .hero-image-wrap {
          margin-top: 36px;
          width: 100%;
          max-width: 820px;
          margin-left: auto;
          margin-right: auto;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.12);
        }

        /* ========== CATEGORY STRIP (Apple Store style) ========== */
        .indiaistore-theme .category-strip {
          background: var(--white);
          border-bottom: 1px solid var(--border);
          padding: 28px 0 24px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .indiaistore-theme .category-strip-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          gap: 8px;
          padding: 0 22px;
          min-width: max-content;
        }

        .indiaistore-theme .strip-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          min-width: 96px;
          cursor: pointer;
          transition: all 0.25s ease;
          border-radius: 14px;
          text-decoration: none;
        }

        .indiaistore-theme .strip-item:hover {
          background: var(--apple-light);
        }

        .indiaistore-theme .strip-icon {
          width: 96px;
          height: 68px;
          background: transparent;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .indiaistore-theme .strip-icon img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.06));
        }

        .indiaistore-theme .strip-item:hover .strip-icon {
          transform: scale(1.12);
        }

        .indiaistore-theme .strip-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--apple-black);
          text-align: center;
          white-space: nowrap;
        }

        /* ========== SECTION COMMON ========== */
        .indiaistore-theme .section {
          padding: 64px 22px;
          max-width: 1400px;
          margin: 0 auto;
          background: #ffffff;
        }

        .indiaistore-theme .section-header {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          margin-bottom: 36px;
        }

        .indiaistore-theme .section-title {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: -0.02em;
          text-align: center;
          margin: 0;
          color: var(--apple-black);
        }

        .indiaistore-theme .section-link {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: var(--apple-blue);
          font-weight: 500;
          text-decoration: none;
        }
        .indiaistore-theme .section-link:hover { text-decoration: underline; }

        @media (max-width: 640px) {
          .indiaistore-theme .section-header {
            flex-direction: column;
            gap: 8px;
          }
          .indiaistore-theme .section-link {
            position: static;
            transform: none;
          }
        }

        .indiaistore-theme .testimonials-section .section-header {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          text-align: left;
        }
        .indiaistore-theme .testimonials-section .section-title {
          font-size: 32px;
          margin: 0;
          text-align: left;
        }

        /* ========== NEW ARRIVALS SLIDER ========== */
        .indiaistore-theme .new-arrivals-slider-wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .indiaistore-theme .new-arrivals-slider {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          padding: 8px 4px 20px;
          scrollbar-width: none;
        }
        .indiaistore-theme .new-arrivals-slider::-webkit-scrollbar { display: none; }

        /* ========== APPLE OFFICIAL STORE CARD 40 STYLING ========== */
        .indiaistore-theme .rf-ccard-40 {
          position: relative;
          width: 380px;
          min-width: 320px;
          height: 480px;
          border-radius: 28px;
          background: #f5f5f7;
          overflow: hidden;
          text-decoration: none;
          color: #1d1d1f;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          flex: 0 0 380px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          text-align: left;
        }

        .indiaistore-theme .rf-ccard-40:hover {
          transform: translateY(-4px) scale(1.015);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
        }

        .indiaistore-theme .as-util-relatedlink,
        .indiaistore-theme .rf-ccard-content-withfullimg {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .indiaistore-theme .rf-ccard-img-full-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          background: #f5f5f7;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .indiaistore-theme .rf-ccard-img-full {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .indiaistore-theme .rf-ccard-40:hover .rf-ccard-img-full {
          transform: scale(1.04);
        }

        .indiaistore-theme .rf-ccard-content-info {
          position: relative;
          z-index: 2;
          padding: 28px 26px;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,0) 100%);
        }

        .indiaistore-theme .rf-ccard-content-header-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #b64400;
          margin: 0 0 6px 0;
        }

        .indiaistore-theme .rf-ccard-content-header {
          margin-bottom: 6px;
        }

        .indiaistore-theme .rf-ccard-content-headerlink {
          font-size: 26px;
          font-weight: 700;
          line-height: 1.15;
          color: #1d1d1f;
          letter-spacing: -0.015em;
          display: block;
        }

        .indiaistore-theme .rf-ccard-content-desc {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .indiaistore-theme .rf-ccard-content-desccontent {
          font-size: 15px;
          font-weight: 400;
          color: #1d1d1f;
          line-height: 1.3;
        }

        .indiaistore-theme .rf-ccard-content-descprice {
          font-size: 13px;
          font-weight: 400;
          color: #6e6e73;
        }

        /* Dark Theme Card Variant (e.g., Box 2) */
        .indiaistore-theme .rf-ccard-dark {
          background: #000000 !important;
          color: #ffffff !important;
        }

        .indiaistore-theme .rf-ccard-dark .rf-ccard-img-full-wrapper {
          background: #000000 !important;
        }

        .indiaistore-theme .rf-ccard-dark .rf-ccard-content-info {
          background: linear-gradient(180deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0) 100%) !important;
        }

        .indiaistore-theme .rf-ccard-dark .rf-ccard-content-header-eyebrow {
          color: #ff7a00 !important;
        }

        .indiaistore-theme .rf-ccard-dark .rf-ccard-content-headerlink {
          color: #ffffff !important;
        }

        .indiaistore-theme .rf-ccard-dark .rf-ccard-content-desccontent {
          color: #f5f5f7 !important;
        }

        .indiaistore-theme .rf-ccard-dark .rf-ccard-content-descprice {
          color: #a1a1a6 !important;
        }

        .indiaistore-theme .product-card {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 24px;
          padding: 18px 18px 24px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-decoration: none;
          overflow: hidden;
          flex: 1 1 0px;
          min-width: 280px;
          box-sizing: border-box;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .indiaistore-theme .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.12);
        }

        .indiaistore-theme .product-card .badge {
          position: absolute;
          top: 24px;
          left: 24px;
          background: var(--apple-blue);
          color: white;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 980px;
          z-index: 2;
        }

        .indiaistore-theme .product-img {
          width: 100%;
          height: 240px;
          background: #f5f5f7;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          overflow: hidden;
          position: relative;
          padding: 0;
          box-sizing: border-box;
        }

        .indiaistore-theme .product-img img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 16px;
          mix-blend-mode: multiply;
          filter: contrast(1.03) brightness(1.01);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: block;
          margin: 0 auto;
        }

        .indiaistore-theme .product-card:hover .product-img img {
          transform: scale(1.04);
        }

        .indiaistore-theme .product-img .placeholder {
          width: 100%;
          height: 100%;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--apple-gray);
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }

        .indiaistore-theme .product-name {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 4px;
          letter-spacing: -0.3px;
          color: var(--apple-black);
          word-break: break-word;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .indiaistore-theme .product-tagline {
          font-size: 14px;
          color: var(--apple-gray);
          margin-bottom: 10px;
        }

        .indiaistore-theme .product-price {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 16px;
          color: var(--apple-black);
        }

        .indiaistore-theme .product-price span {
          color: var(--apple-gray);
          font-weight: 400;
          font-size: 13px;
        }

        .indiaistore-theme .shop-btn {
          display: inline-block;
          background: var(--apple-blue);
          color: white;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 24px;
          border-radius: 980px;
          transition: background 0.2s;
        }
        .indiaistore-theme .product-card:hover .shop-btn {
          background: var(--apple-blue-hover);
        }

        /* ========== SHOP BY CATEGORY ========== */
        .indiaistore-theme .categories {
          background: var(--apple-light);
          padding: 64px 22px;
        }

        .indiaistore-theme .categories-inner { max-width: 1400px; margin: 0 auto; }

        .indiaistore-theme .category-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .indiaistore-theme .category-card {
          background: white;
          border-radius: 24px;
          padding: 18px 18px 22px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          text-decoration: none;
          border: 1px solid rgba(0, 0, 0, 0.04);
        }

        .indiaistore-theme .category-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.12);
        }

        .indiaistore-theme .category-icon {
          width: 100%;
          height: 270px;
          margin: 0 auto 16px;
          background: #f5f5f7;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 44px;
          overflow: hidden;
          padding: 0;
        }

        .indiaistore-theme .category-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          padding: 0;
          mix-blend-mode: multiply;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .indiaistore-theme .category-card:hover .category-icon img {
          transform: scale(1.05);
        }

        .indiaistore-theme .category-name {
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.3px;
          color: var(--apple-black);
        }

        .indiaistore-theme .category-count {
          font-size: 13px;
          font-weight: 500;
          color: var(--apple-gray);
          margin-top: 4px;
        }

        /* ========== TRENDING SLIDER ========== */
        .indiaistore-theme .trending-slider-wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .indiaistore-theme .trending-slider {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          padding: 8px 4px 20px;
          scrollbar-width: none;
        }
        .indiaistore-theme .trending-slider::-webkit-scrollbar { display: none; }

        .indiaistore-theme .trending-card {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 24px;
          padding: 18px 18px 24px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          text-decoration: none;
          overflow: hidden;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          flex: 1 1 0px;
          min-width: 270px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .indiaistore-theme .trending-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.12);
        }

        .indiaistore-theme .trending-img {
          width: 100%;
          height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          background: #f5f5f7;
          border-radius: 18px;
          overflow: hidden;
          padding: 0;
          box-sizing: border-box;
          position: relative;
          color: #86868b;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }

        .indiaistore-theme .trending-img img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 16px;
          mix-blend-mode: multiply;
          filter: contrast(1.03) brightness(1.01);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: block;
          margin: 0 auto;
        }

        .indiaistore-theme .trending-card:hover .trending-img img {
          transform: scale(1.04);
        }

        .indiaistore-theme .trending-name {
          font-size: 19px;
          font-weight: 700;
          margin-bottom: 4px;
          color: var(--apple-black);
          word-break: break-word;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          letter-spacing: -0.3px;
        }
        .indiaistore-theme .trending-price { font-size: 15px; color: var(--apple-black); font-weight: 500; }

        /* ========== DEAL OF THE WEEK ========== */
        .indiaistore-theme .deal-banner {
          margin: 0 22px 64px;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
          background: linear-gradient(135deg, #161617 0%, #2a2a2c 100%);
          border-radius: 28px;
          padding: 56px 64px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 48px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
        }

        .indiaistore-theme .deal-content { flex: 1; max-width: 580px; }

        .indiaistore-theme .deal-eyebrow {
          font-size: 13px;
          font-weight: 700;
          color: #f5a623;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .indiaistore-theme .deal-title {
          font-size: 38px;
          font-weight: 700;
          letter-spacing: -0.8px;
          margin-bottom: 14px;
          line-height: 1.15;
          color: #ffffff;
        }

        .indiaistore-theme .deal-desc {
          font-size: 17px;
          opacity: 0.88;
          margin-bottom: 28px;
          line-height: 1.55;
          color: #d2d2d7;
        }

        .indiaistore-theme .deal-price {
          font-size: 34px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #ffffff;
        }

        .indiaistore-theme .deal-price span {
          font-size: 18px;
          opacity: 0.6;
          text-decoration: line-through;
          margin-left: 12px;
          font-weight: 400;
        }

        .indiaistore-theme .deal-visual {
          flex-shrink: 0;
          width: 420px;
          height: 285px;
          background: transparent;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 0;
        }

        .indiaistore-theme .deal-visual img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          transform: translateY(-10px);
          border-radius: 20px;
          filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.4));
          transition: transform 0.4s ease;
        }

        .indiaistore-theme .deal-banner:hover .deal-visual img {
          transform: translateY(-10px) scale(1.04);
        }

        /* ========== WHY BUY FROM AUTHORISED RESELLER ========== */
        .indiaistore-theme .wby-section {
          max-width: 1400px;
          margin: 0 auto 64px;
          padding: 0 22px;
        }

        .indiaistore-theme .wby-title {
          text-align: center;
          font-size: 36px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0 0 14px;
          color: var(--apple-black);
        }

        .indiaistore-theme .wby-subtitle {
          text-align: center;
          font-size: 19px;
          color: var(--apple-gray);
          max-width: 620px;
          margin: 0 auto 48px;
          line-height: 1.5;
        }

        .indiaistore-theme .wby-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }

        @media (max-width: 1100px) {
          .indiaistore-theme .wby-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 720px) {
          .indiaistore-theme .wby-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .indiaistore-theme .wby-grid { grid-template-columns: 1fr; }
        }

        .indiaistore-theme .wby-card {
          background: var(--apple-light);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px 22px 30px;
          text-align: center;
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .indiaistore-theme .wby-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px -16px rgba(0,0,0,.12);
        }

        .indiaistore-theme .wby-card.featured {
          background: var(--white);
          box-shadow: 0 20px 44px -18px rgba(0,0,0,.14);
          border-color: var(--border);
        }

        .indiaistore-theme .wby-badge {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #eeeeef;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 22px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: .06em;
          color: var(--apple-black);
          box-shadow: 0 4px 10px -4px rgba(0,0,0,.08);
        }

        .indiaistore-theme .wby-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: #eeeeef;
          border: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 22px;
          box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          padding: 8px;
        }

        .indiaistore-theme .wby-icon img.wby-img-icon {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 8px;
          filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.15));
        }

        .indiaistore-theme .wby-icon svg {
          width: 26px;
          height: 26px;
          color: var(--apple-black);
        }

        .indiaistore-theme .wby-card-title {
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.01em;
          margin: 0 0 12px;
          line-height: 1.3;
          color: var(--apple-black);
        }

        .indiaistore-theme .wby-card-desc {
          font-size: 14.5px;
          color: var(--apple-gray);
          line-height: 1.6;
          margin: 0;
        }

        /* ========== BANK OFFERS STRIP ========== */
        .indiaistore-theme .bank-offer-strip {
          background: linear-gradient(90deg, #eef3fb, #f3f4f7 60%, #eef1f5);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 16px 24px;
          margin-bottom: 48px;
        }

        .indiaistore-theme .bank-offer-inner {
          max-width: 1400px;
          margin: 0 auto;
          font-size: 15px;
          color: var(--apple-black);
          text-align: center;
        }

        .indiaistore-theme .bank-offer-inner strong {
          color: var(--apple-blue);
          font-weight: 700;
        }

        /* ========== B2B ========== */
        .indiaistore-theme .b2b {
          background: var(--apple-light);
          padding: 64px 22px;
        }

        .indiaistore-theme .b2b-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }

        .indiaistore-theme .b2b-text h2 {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.6px;
          margin-bottom: 14px;
        }

        .indiaistore-theme .b2b-text p {
          font-size: 16px;
          color: var(--apple-gray);
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .indiaistore-theme .b2b-features {
          list-style: none;
          margin-bottom: 24px;
        }

        .indiaistore-theme .b2b-features li {
          font-size: 15px;
          margin-bottom: 9px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .indiaistore-theme .b2b-features li::before {
          content: "✓";
          color: var(--apple-blue);
          font-weight: 700;
        }

        .indiaistore-theme .b2b-form {
          background: white;
          border-radius: 20px;
          padding: 28px;
          box-shadow: var(--shadow);
        }

        .indiaistore-theme .b2b-form h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 18px;
        }

        .indiaistore-theme .form-group { margin-bottom: 14px; }

        .indiaistore-theme .form-group label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 5px;
          color: var(--apple-gray);
        }

        .indiaistore-theme .form-group input,
        .indiaistore-theme .form-group select,
        .indiaistore-theme .form-group textarea {
          width: 100%;
          padding: 11px 13px;
          border: 1px solid var(--border);
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .indiaistore-theme .form-group input:focus,
        .indiaistore-theme .form-group select:focus,
        .indiaistore-theme .form-group textarea:focus {
          outline: none;
          border-color: var(--apple-blue);
        }

        .indiaistore-theme .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* ========== TESTIMONIALS SLIDER ========== */
        .indiaistore-theme .testimonials-section {
          background: #ffffff;
          width: 100%;
        }

        .indiaistore-theme .testimonials-slider-wrap {
          position: relative;
          width: 100%;
        }

        .indiaistore-theme .testimonials-slider {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          padding: 8px 4px 20px;
          scrollbar-width: none;
        }
        .indiaistore-theme .testimonials-slider::-webkit-scrollbar {
          display: none;
        }

        .indiaistore-theme .testimonial-card {
          flex: 0 0 380px;
          min-width: 320px;
          max-width: 400px;
          background: white;
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 24px;
          transition: all 0.25s ease;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .indiaistore-theme .testimonial-card:hover {
          box-shadow: var(--shadow);
          transform: translateY(-2px);
        }

        .indiaistore-theme .slider-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--apple-light);
          border: 1px solid var(--border);
          color: var(--apple-black);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 16px;
          font-weight: bold;
          line-height: 1;
        }
        .indiaistore-theme .slider-btn:hover {
          background: var(--apple-blue);
          color: white;
          border-color: var(--apple-blue);
        }

        .indiaistore-theme .stars {
          color: #f5a623;
          font-size: 13px;
          margin-bottom: 12px;
          letter-spacing: 1.5px;
        }

        .indiaistore-theme .testimonial-text {
          font-size: 14px;
          line-height: 1.55;
          margin-bottom: 18px;
          color: #333;
        }

        .indiaistore-theme .testimonial-author {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .indiaistore-theme .author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--apple-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          color: var(--apple-blue);
        }

        .indiaistore-theme .author-info strong {
          display: block;
          font-size: 13px;
          font-weight: 600;
        }

        .indiaistore-theme .author-info span {
          font-size: 12px;
          color: var(--apple-gray);
        }

        /* ========== RESPONSIVE ========== */
        @media (max-width: 1100px) {
          .indiaistore-theme .category-grid { grid-template-columns: repeat(4, 1fr); }
          .indiaistore-theme .deal-banner { flex-direction: column; text-align: center; padding: 36px 24px; }
          .indiaistore-theme .deal-visual { width: 100%; max-width: 360px; height: 260px; }
          .indiaistore-theme .b2b-inner { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .indiaistore-theme .hero-banner { height: 480px; }
          .indiaistore-theme .hero-banner h1 { font-size: 36px; }
          .indiaistore-theme .section { padding: 48px 16px; }
          .indiaistore-theme .category-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .indiaistore-theme .testimonials-grid { grid-template-columns: 1fr; }
          .indiaistore-theme .form-row { grid-template-columns: 1fr; }
          .indiaistore-theme .category-strip-inner { justify-content: flex-start; }
          .indiaistore-theme .product-card { flex: 0 0 260px; min-width: 240px; }
          .indiaistore-theme .trending-card { flex: 0 0 200px; min-width: 180px; }
        }
      `}</style>

      {/* 1. HERO BANNER (Full-width Apple Style) */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-eyebrow">
            {heroData.homeHeroBadge || 'Apple Authorised Resellers across India'}
          </div>
          <h1>{heroData.homeHeroTitle || 'The latest.\nThe best. Authorised.'}</h1>
          <p className="hero-sub">
            {heroData.homeHeroSubtitle || 'Genuine Apple products from India’s trusted mono-brand premium resellers. Exclusive offers, EMI & expert support.'}
          </p>
          <div className="hero-ctas">
            <Link to={heroData.homeHeroPrimaryBtnLink || '/iphone'} className="btn btn-primary">
              {heroData.homeHeroPrimaryBtnText || 'Shop Now'}
            </Link>
            {heroData.homeHeroSecondaryBtnLink?.startsWith('#') ? (
              <a
                href={heroData.homeHeroSecondaryBtnLink}
                onClick={(e) => {
                  e.preventDefault();
                  const targetId = heroData.homeHeroSecondaryBtnLink.replace('#', '');
                  const section = document.getElementById(targetId);
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="btn btn-secondary"
              >
                {heroData.homeHeroSecondaryBtnText || 'Find Nearest Store'}
              </a>
            ) : (
              <Link to={heroData.homeHeroSecondaryBtnLink || '/stores'} className="btn btn-secondary">
                {heroData.homeHeroSecondaryBtnText || 'Find Nearest Store'}
              </Link>
            )}
          </div>

          {heroData.homeHeroImage && (
            <div className="hero-image-wrap">
              <img
                src={heroData.homeHeroImage}
                alt="Apple Reseller Showcase"
                className="w-full h-auto max-h-[420px] object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. CATEGORY STRIP (Apple.com/store Style) */}
      <div className="category-strip">
        <div className="category-strip-inner">
          {categoryStrip.map((rawItem, idx) => {
            const item = sanitizeCategoryItem(rawItem);
            if (!item) return null;
            const hasImg = Boolean(item.image && item.image.trim());
            return (
              <Link key={idx} to={item.path || '/shop'} className="strip-item">
                <div className="strip-icon">
                  {hasImg ? (
                    <img
                      src={item.image.trim().startsWith('/') || item.image.trim().startsWith('http') ? item.image.trim() : '/' + item.image.trim()}
                      alt={item.label || item.name}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        const key = item.name || item.label;
                        const fb = DEFAULT_CATEGORY_IMAGES[key] || '/macbook_category_uploaded.png';
                        if (e.currentTarget.src !== window.location.origin + fb && e.currentTarget.src !== fb) {
                          e.currentTarget.src = fb;
                        }
                      }}
                    />
                  ) : (
                    <span>{item.icon || '📱'}</span>
                  )}
                </div>
                <div className="strip-name">{item.label || item.name}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. NEW ARRIVALS SLIDER */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">New Arrivals</h2>
          <Link to="/shop?sort=newest" className="section-link">View all →</Link>
        </div>
        <div className="new-arrivals-slider-wrap">
          <div className="new-arrivals-slider">
            {newArrivalsList.map((item, idx) => {
              const card1ImgWebp = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-iphone-duo-202609_GEO_IN?wid=800&hei=1000&fmt=webp&qlt=90&.v=UzBXQnlhUWdraTNvNU1Kb3pEQlpXTmRieWJxSUI5TWh3VExiQnFCdzRFUVIzWjZtanZvZXBzWDFVU2JjN3Z3cXBxK0ZBNmxGbmUyUFZlUkRMaDBrbFIrM1V0MXQ3L01IeDRJOXlOYjZtNC9JTVpqRTIzSGM4czgvT0dWYlpqZnY&traceId=1";
              const card1ImgJpg = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-iphone-duo-202609_GEO_IN?wid=800&hei=1000&fmt=p-jpg&qlt=80&.v=UzBXQnlhUWdraTNvNU1Kb3pEQlpXTmRieWJxSUI5TWh3VExiQnFCdzRFUVIzWjZtanZvZXBzWDFVU2JjN3Z3cXN2Mmx4a3VvSnUzaFUvSVlVRUJkbEd4TmxtT1p0QkhPako5RlJBUjZ0OU9Hc0wyUy9Qc3BoTzNXSHJVRHo5eGk&traceId=1";
              
              const card2ImgWebp = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-iphone-18-pro-202609?wid=800&hei=1000&fmt=webp&qlt=90&.v=UzBXQnlhUWdraTNvNU1Kb3pEQlpXSWQybG1sZ1oxVnEyWjA5KzltU01ZTFNab1lJcUZwSFVRK1htYlNmZUtPTFJ2R3NEUGt3Q2tTUTNWU09neHFkdWRUL1Azd1lsYk5RbEsxZXhvbThSV3VXS3B5dFRDdHdOWGF6ZzVmZHdiRWc&traceId=1";
              const card2ImgJpg = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-iphone-18-pro-202609?wid=800&hei=1000&fmt=p-jpg&qlt=80&.v=UzBXQnlhUWdraTNvNU1Kb3pEQlpXSWQybG1sZ1oxVnEyWjA5KzltU01ZTFNab1lJcUZwSFVRK1htYlNmZUtPTFN5aWNYUFpIbkFhdm03T3BzSjdVSTVTUzBFNlNoQ3JiRWpkVzhGb1Q5YkVkMVhIT21KNHhMTmc3TkpqWGZITDg&traceId=1";

              const card3ImgWebp = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-watch-series-12-202609?wid=800&hei=1000&fmt=webp&qlt=90&.v=QWhYaUFuRS9hTUliZ3N5RWVCV09vaG9ZUW1EeWY5MUtXMHdLVXUrS2thUHJ5SDBWM0EzY1NDZnVpYTkvandVRGdpcjhyQnJrZTk3NDVpVGh0RDBPL1dlb1hSRFZ1bHlsVUx3SFRzY0JhYVpmcTUrTlhNMWhLS2RHRXhjZnVURVQ&traceId=1";
              const card3ImgJpg = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-watch-series-12-202609?wid=800&hei=1000&fmt=p-jpg&qlt=80&.v=QWhYaUFuRS9hTUliZ3N5RWVCV09vaG9ZUW1EeWY5MUtXMHdLVXUrS2thUHJ5SDBWM0EzY1NDZnVpYTkvandVRHFmS3YvQ0doSFZENndQR0J4TTRqbndQU2JvQ0JiRmZoU0hNWVplaGs5aHNPYUtSMVh2bmhjSFBDSFo4T3FRS0E&traceId=1";

              const card4ImgWebp = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-watch-ultra-4-202609_GEO_IN?wid=800&hei=1000&fmt=webp&qlt=90&.v=QWhYaUFuRS9hTUliZ3N5RWVCV09vdmMxTi9MK0F4TUMvaEkrKzQrSzRpbmJRMGtnQk93bkNnOFNhZmw1MVVDSWVKTWtXODFGZ1ZIUk9hUHM3RHc0QTYyL0ZSTzZrMWlpUU5CQlpuNHNUZzhtZXFyaVZWaHlPbUpXd09SVC9rbDc&traceId=1";
              const card4ImgJpg = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-watch-ultra-4-202609_GEO_IN?wid=800&hei=1000&fmt=p-jpg&qlt=80&.v=QWhYaUFuRS9hTUliZ3N5RWVCV09vdmMxTi9MK0F4TUMvaEkrKzQrSzRpbmJRMGtnQk93bkNnOFNhZmw1MVVDSWVEb1lRcjg2U0o3bTMvMkR2S2VvTnZXdlJRYjdSZWJHVUh4aFVDb0hhVVdPc2ZIZ0tBZThMV3hSNUJIL00xdlQ&traceId=1";

              const card5ImgWebp = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-airpods-5-202609?wid=800&hei=1000&fmt=webp&qlt=90&.v=WlczMnlkejNQakk5eW14MEJjQmdLL1htQlViQlcvWm01TkRFbWQ1bFdVbjkvamYzRzRvcFlnajNacmhEOC9BeEZXZzlzM2cwVmJseGdsS3RYT09za2g5YnJpZi9mWTcyN0pxRVpBcDU2UnArYWpGdS9XeFgvbS9ITnNYOEhYaG4&traceId=1";
              const card5ImgJpg = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-airpods-5-202609?wid=800&hei=1000&fmt=p-jpg&qlt=80&.v=WlczMnlkejNQakk5eW14MEJjQmdLL1htQlViQlcvWm01TkRFbWQ1bFdVbjkvamYzRzRvcFlnajNacmhEOC9BeGJLRkx3RDVvZWFBZ2pOaXMvUXhHQ2FFWGwxTDd3djQwdSt4b3ZkbTdjbXVKTExiOEFsRmxtQ2Nua0tRSC83MkI&traceId=1";

              const card6ImgWebp = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-mac-mini-202609?wid=800&hei=1000&fmt=webp&qlt=90&.v=MjhMcWJ2MGZwbXEwdnBkcUN6ZnhyejZjVlVyTm9aMTIzM2ZlTDJiaTlnRDZXYXJlRUd1cTBYTnRnbTNlazIvMzl4VGJTa0Z6K25XajlIZ3dxUWxxaFVyemZ6RkRPaG5jU2paRVdtZHhabXc&traceId=1";
              const card6ImgJpg = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-mac-mini-202609?wid=800&hei=1000&fmt=p-jpg&qlt=80&.v=MjhMcWJ2MGZwbXEwdnBkcUN6ZnhyejZjVlVyTm9aMTIzM2ZlTDJiaTlnRDZXYXJlRUd1cTBYTnRnbTNlazIvM01BZktNRDRIeDREMEYwa1NOSWNvMENpK0pSNjVsZ2N0cUJVQnVDU1lqdHQrYWpGdS9XeFgvbS9ITnNYOEhYaG4&traceId=1";

              const card7ImgWebp = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-mac-studio-202609?wid=800&hei=1000&fmt=webp&qlt=90&.v=MjhMcWJ2MGZwbXEwdnBkcUN6ZnhyeU9aVHlIUTN0TDFoV3YrODdyNm1Ucm45S05qekNUdVUwMVFyK1pKaERUd3lPWjFvdU5EZVdwUnRCZ2RHSDBFS3R0bEJITXZrbjRjcGpoK0NsSlhQUCtWZWZKZEpnTUg2bTJtOU9qU1hvcWw&traceId=1";
              const card7ImgJpg = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-mac-studio-202609?wid=800&hei=1000&fmt=p-jpg&qlt=80&.v=MjhMcWJ2MGZwbXEwdnBkcUN6ZnhyeU9aVHlIUTN0TDFoV3YrODdyNm1Ucm45S05qekNUdVUwMVFyK1pKaERUd3ZGdXpoZGFjcnJiZGtXTlNNRSszQWpLV0ZtaSt4V1ZKUFd0a1JsdUUwbENacXFoWC9uNWRBVmx4VTBHaHVxM3Y&traceId=1";

              let imgWebp = item.imageWebp || item.image || card1ImgWebp;
              let imgJpg = item.image || card1ImgJpg;
              let altText = item.altText || item.alt || item.name || "Apple Product";

              if (idx === 0) {
                imgWebp = item.imageWebp || card1ImgWebp;
                imgJpg = item.image || card1ImgJpg;
                altText = item.altText || item.alt || "iPhone Duo";
              } else if (idx === 1) {
                imgWebp = item.imageWebp || card2ImgWebp;
                imgJpg = item.image || card2ImgJpg;
                altText = item.altText || item.alt || "iPhone 18 Pro Max, burgundy colour";
              } else if (idx === 2) {
                imgWebp = item.imageWebp || card3ImgWebp;
                imgJpg = item.image || card3ImgJpg;
                altText = item.altText || item.alt || "Apple Watch Series 12";
              } else if (idx === 3 || item.name?.toLowerCase().includes('ultra')) {
                imgWebp = item.imageWebp || card4ImgWebp;
                imgJpg = item.image || card4ImgJpg;
                altText = item.altText || item.alt || "Apple Watch Ultra 4, titanium case, natural colour, right side exterior, raised side button, microphone, Digital Crown dial, Ocean Band, translucent grey colour";
              } else if (idx === 4 || item.name?.toLowerCase().includes('airpods 5')) {
                imgWebp = item.imageWebp || card5ImgWebp;
                imgJpg = item.image || card5ImgJpg;
                altText = item.altText || item.alt || "AirPods 5: wireless earbuds, white color, oval-shaped, ear tip with interior acoustic speaker mesh, short stem with silver charging connector, left and right letter indicators";
              } else if (idx === 5 || item.name?.toLowerCase().includes('mac mini')) {
                imgWebp = item.imageWebp || card6ImgWebp;
                imgJpg = item.image || card6ImgJpg;
                altText = item.altText || item.alt || "Mac mini, front exterior, two Thunderbolt ports, status indicator light and 3.5‑millimetre headphone jack, tapered black base at bottom, flat top, rounded sides, straight edges, silver colour enclosure";
              } else if (idx === 6 || item.name?.toLowerCase().includes('mac studio')) {
                imgWebp = item.imageWebp || card7ImgWebp;
                imgJpg = item.image || card7ImgJpg;
                altText = item.altText || item.alt || "Mac Studio, front exterior, two USB‑C ports, SDXC card slot, status indicator light, tapered base at bottom, flat top, rounded sides, straight edges, silver colour enclosure";
              }

              const isDarkCard = item.isDark || (idx === 1 || idx === 2 || idx === 3 || item.name?.toLowerCase().includes('ultra') || item.name?.toLowerCase().includes('series 12') || item.name?.toLowerCase().includes('18 pro'));

              return (
                <Link key={item.id || idx} to={item.path || '/shop'} className={`rf-ccard rf-ccard-40 ${isDarkCard ? 'rf-ccard-dark' : 'rf-card-msgtag-orange'}`}>
                  <div className="as-util-relatedlink">
                    <div className="rf-ccard-content rf-ccard-content-withfullimg">
                      <div className="rf-ccard-img-full-wrapper">
                        <picture>
                          <source srcSet={imgWebp} type="image/webp" />
                          <source srcSet={imgJpg} type="image/jpeg" />
                          <img
                            width="400"
                            height="500"
                            alt={altText}
                            className="rf-ccard-img-full"
                            src={imgJpg}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = card1ImgJpg;
                            }}
                          />
                        </picture>
                      </div>
                      <div className="rf-ccard-content-info">
                        {item.eyebrow ? (
                          <h3 className="rf-ccard-content-header-eyebrow">
                            {item.eyebrow}
                          </h3>
                        ) : null}
                        <div className="rf-ccard-content-header">
                          <span className="rf-ccard-content-headerlink">
                            {item.name || 'Apple Product'}
                          </span>
                        </div>
                        <div className="rf-ccard-content-desc">
                          <span className="typography-body-tight rf-ccard-content-desccontent">
                            {item.tagline || ''}
                          </span>
                          <span className="typography-body-reduced-tight rf-ccard-content-descprice">
                            {item.price || ''}{' '}
                            {item.monthlyPrice ? item.monthlyPrice : ''}
                            <sup className="as-footnote footnote">†</sup>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY */}
      <section className="categories">
        <div className="categories-inner">
          <div className="section-header" style={{ marginBottom: '28px' }}>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <div className="category-grid">
            {appleCategories.map((cat, idx) => {
              const displayImg = (cat.image || '').trim();
              return (
                <Link key={idx} to={cat.link || '/shop'} className="category-card">
                  <div className="category-icon">
                    {displayImg ? (
                      <img
                        src={displayImg.startsWith('/') || displayImg.startsWith('http') ? displayImg : '/' + displayImg}
                        alt={cat.name}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <span>{cat.icon || '📱'}</span>
                    )}
                  </div>
                  <div className="category-name">{cat.name}</div>
                  <div className="category-count">{cat.actionText || cat.count || 'Explore Collection'}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. TRENDING NOW SLIDER */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Trending Now</h2>
          <Link to="/shop" className="section-link">View all →</Link>
        </div>
        <div className="trending-slider-wrap">
          <div className="trending-slider">
            {trendingList.map((item) => (
              <Link key={item.id} to={item.path} className="trending-card">
                <div className="trending-img">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerText = item.name;
                        }
                      }}
                    />
                  ) : (
                    <span>{item.name}</span>
                  )}
                </div>
                <div style={{ width: '100%' }}>
                  <div className="trending-name">{item.name}</div>
                  <div className="trending-price">{item.price}</div>
                </div>
                <div className="shop-btn" style={{ marginTop: '12px' }}>Shop</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5.5 WHY BUY FROM AUTHORISED RESELLER */}
      <div className="wby-section">
        <h2 className="wby-title">Why Buy from an Authorised Reseller?</h2>

        <div className="wby-grid">
          <div className="wby-card">
            <div className="wby-icon">
              <img src="/why_buy/icon_shield_check.png" alt="100% Original Products" className="wby-img-icon" />
            </div>
            <h3 className="wby-card-title">100% Original Products</h3>
            <p className="wby-card-desc">Only genuine Apple products sourced through official channels with full authenticity.</p>
          </div>

          <div className="wby-card">
            <div className="wby-icon">
              <img src="/why_buy/icon_warranty_ribbon.png" alt="1 Year Apple Warranty" className="wby-img-icon" />
            </div>
            <h3 className="wby-card-title">1 Year Apple Warranty</h3>
            <p className="wby-card-desc">Complete manufacturer warranty support across all Apple Authorised service centres.</p>
          </div>

          <div className="wby-card">
            <div className="wby-icon">
              <img src="/why_buy/icon_shield_star.png" alt="Trusted Apple Seller" className="wby-img-icon" />
            </div>
            <h3 className="wby-card-title">Trusted Apple Seller</h3>
            <p className="wby-card-desc">Official mono-brand authorised resellers trusted by thousands of customers across India.</p>
          </div>

          <div className="wby-card">
            <div className="wby-icon">
              <img src="/why_buy/icon_headset.png" alt="Expert Guidance & Support" className="wby-img-icon" />
            </div>
            <h3 className="wby-card-title">Expert Guidance &amp; Support</h3>
            <p className="wby-card-desc">Trained Apple specialists for product advice, setup and after-sales support.</p>
          </div>

          <div className="wby-card">
            <div className="wby-icon">
              <img src="/why_buy/icon_shield_service.png" alt="Service You Can Trust" className="wby-img-icon" />
            </div>
            <h3 className="wby-card-title">Service You Can Trust</h3>
            <p className="wby-card-desc">Comprehensive support and transparent service for complete peace of mind.</p>
          </div>
        </div>
      </div>



      {/* 6. DEAL OF THE WEEK */}
      <div className="deal-banner">
        <div className="deal-content">
          <div className="deal-eyebrow">{dealData.dealEyebrow || 'Deal of the Week'}</div>
          <h2 className="deal-title">{dealData.dealTitle || 'MacBook Neo – Stock Clearance'}</h2>
          <p className="deal-desc">
            {dealData.dealDesc || 'Amazing Mac at a surprising price. Limited stock this week. Exclusive bank offers + free AppleCare+ for first 50 buyers.'}
          </p>
          <div className="deal-price">
            {dealData.dealPrice || '₹72,900'} <span>{dealData.dealOldPrice || '₹79,900'}</span>
          </div>
          <Link to={dealData.dealButtonLink || '/macbook'} className="btn btn-primary" style={{ marginTop: '18px' }}>
            {dealData.dealButtonText || 'Grab the Deal'}
          </Link>
        </div>
        <div className="deal-visual">
          <img src={dealData.dealImage || '/mac_nav/macbook_neo.png'} alt="MacBook Deal" className="max-h-full max-w-full object-contain filter drop-shadow-lg" />
        </div>
      </div>

      {/* 7. B2B / CORPORATE ORDERS */}
      <section id="b2b-section" className="b2b">
        <div className="b2b-inner">
          <div className="b2b-text">
            <h2>Corporate & B2B Orders</h2>
            <p>Looking for volume purchases, education pricing or enterprise solutions? Our dedicated team helps businesses get the right Apple setup with preferential pricing and support.</p>
            <ul className="b2b-features">
              <li>Volume & bulk pricing</li>
              <li>Dedicated account manager</li>
              <li>AppleCare for Enterprise</li>
              <li>Education & institutional discounts</li>
              <li>Fast delivery across India</li>
            </ul>
            <a
              href="https://wa.me/918607222417?text=Hello%20iiNCEPT%20B2B%20Desk!%20I%20want%20to%20talk%20to%20sales."
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Talk to Sales
            </a>
          </div>

          <div className="b2b-form">
            <h3>Request a Quote</h3>
            {b2bSuccess && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', fontSize: '12px', fontWeight: 'bold', padding: '10px', borderRadius: '8px', marginBottom: '14px' }}>
                {b2bSuccess}
              </div>
            )}
            <form onSubmit={handleB2bSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={b2bForm.fullName}
                    onChange={(e) => setB2bForm({ ...b2bForm, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    placeholder="Company name"
                    value={b2bForm.company}
                    onChange={(e) => setB2bForm({ ...b2bForm, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="work@email.com"
                    value={b2bForm.email}
                    onChange={(e) => setB2bForm({ ...b2bForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={b2bForm.phone}
                    onChange={(e) => setB2bForm({ ...b2bForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Interest</label>
                <select
                  value={b2bForm.productInterest}
                  onChange={(e) => setB2bForm({ ...b2bForm, productInterest: e.target.value })}
                >
                  <option disabled>Select category</option>
                  <option value="Mac">Mac</option>
                  <option value="iPhone">iPhone</option>
                  <option value="iPad">iPad</option>
                  <option value="Watch & Accessories">Watch & Accessories</option>
                  <option value="Mixed / Multiple">Mixed / Multiple</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Quantity, timeline, any specific requirements..."
                  value={b2bForm.message}
                  onChange={(e) => setB2bForm({ ...b2bForm, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={b2bSubmitting}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '6px' }}
              >
                {b2bSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS SLIDER */}
      <section className="section testimonials-section">
        <div className="section-header">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTestimonials('left')}
              className="slider-btn"
              title="Previous"
              aria-label="Previous Testimonials"
            >
              ←
            </button>
            <button
              onClick={() => scrollTestimonials('right')}
              className="slider-btn"
              title="Next"
              aria-label="Next Testimonials"
            >
              →
            </button>
          </div>
        </div>
        <div className="testimonials-slider-wrap">
          <div ref={testimonialSliderRef} className="testimonials-slider">
            {testimonials.map((item, idx) => (
              <div key={idx} className="testimonial-card">
                <div>
                  <div className="stars">
                    {'★'.repeat(item.stars || 5)}
                  </div>
                  <p className="testimonial-text">{item.text}</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {item.author ? item.author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AS'}
                  </div>
                  <div className="author-info">
                    <strong>{item.author}</strong>
                    <span>{item.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
