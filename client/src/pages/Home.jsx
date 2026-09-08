import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axiosClient from '../services/axiosClient';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const location = useLocation();

  const [quoteForm, setQuoteForm] = useState({
    fullName: '',
    phone: '',
    productInterest: 'Product interest'
  });
  const [quoteFormErrors, setQuoteFormErrors] = useState({});
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState('');

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!quoteForm.fullName.trim()) {
      errors.fullName = 'Contact person / Full name is mandatory *';
    }
    if (!quoteForm.phone.trim()) {
      errors.phone = 'Mobile number is mandatory *';
    } else if (!/^[0-9+\s-]{8,15}$/.test(quoteForm.phone.trim())) {
      errors.phone = 'Please enter a valid mobile number';
    }
    if (!quoteForm.productInterest || quoteForm.productInterest === 'Product interest') {
      errors.productInterest = 'Interested product is mandatory *';
    }

    if (Object.keys(errors).length > 0) {
      setQuoteFormErrors(errors);
      return;
    }

    setQuoteFormErrors({});
    setSubmittingQuote(true);

    const fullNameVal = quoteForm.fullName;
    const phoneVal = quoteForm.phone;
    const productVal = quoteForm.productInterest;

    // Pre-filled WhatsApp Message
    const whatsappMsg = `Hello iIncept B2B Desk! 👋\n\nI would like to request a quotation:\n\n👤 *Name:* ${fullNameVal}\n📞 *Mobile:* ${phoneVal}\n📦 *Interested Product:* ${productVal}\n\nPlease share availability & corporate pricing.`;
    const waUrl = `https://wa.me/918607222417?text=${encodeURIComponent(whatsappMsg)}`;

    try {
      await axiosClient.post('/enquiries', {
        companyName: 'N/A',
        fullName: fullNameVal,
        email: 'b2b-inquiry@iincept.com',
        phone: phoneVal,
        productInterest: productVal,
        quantity: 1
      });
    } catch (err) {
      console.error('Enquiry database save warning:', err);
    } finally {
      window.open(waUrl, '_blank');
      setQuoteSuccess('Quote request submitted! Opening WhatsApp chat...');
      setQuoteForm({
        fullName: '',
        phone: '',
        productInterest: 'Product interest'
      });
      setSubmittingQuote(false);
      setTimeout(() => setQuoteSuccess(''), 5000);
    }
  };

  const [heroSlides, setHeroSlides] = useState([
    {
      title: "Apple devices for your business, sourced right, delivered anywhere in India.",
      subtitle: "Bulk pricing, GST invoicing, dedicated account support and consolidated billing — built for IT teams, gifting desks and resellers, not one-off retail buyers.",
      buttonText: "Request Bulk Quote →",
      buttonLink: "#procurement-section",
      image: "",
      bgStyle: "slide-dark"
    },
    {
      title: "The latest Apple lineup, in stock and ready to ship today.",
      subtitle: "From the newest iPhone 17 series to our best-selling MacBooks and AirPods — explore the full range and place your order in minutes, no quote required.",
      buttonText: "Browse Catalogue →",
      buttonLink: "#apple-categories",
      image: "",
      bgStyle: "slide-light"
    },
    {
      title: "Official AppleCare+ protection for total peace of mind.",
      subtitle: "Protect your team's Apple devices with genuine AppleCare+ coverage, priority tech support, and zero-hassle hardware replacement.",
      buttonText: "Explore AppleCare+ →",
      buttonLink: "/apple-care",
      image: "",
      bgStyle: "slide-dark-blue"
    },
    {
      title: "Corporate gifting & exclusive institutional offers.",
      subtitle: "Customized procurement packages for corporate rewards, employee onboarding kits, and volume discounts on premium accessories.",
      buttonText: "Explore Accessories →",
      buttonLink: "/accessories",
      image: "",
      bgStyle: "slide-warm"
    }
  ]);

  const [appleCategories, setAppleCategories] = useState([
    { name: 'iPhone', actionText: 'Shop all models →', link: '/iphone', image: '/iphone_category_uploaded.jpg', cardTheme: 'dark', isActive: true },
    { name: 'Mac', actionText: 'Shop all models →', link: '/macbook', image: '/macbook_category_uploaded.png', cardTheme: 'light', isActive: true },
    { name: 'iPad', actionText: 'Shop all models →', link: '/ipad', image: '/ipad_category_uploaded.png', cardTheme: 'dark', isActive: true },
    { name: 'Watch', actionText: 'Shop all models →', link: '/watch', image: '/watch_category_uploaded.png', cardTheme: 'dark', isActive: true },
    { name: 'AirPods', actionText: 'Shop all models →', link: '/airpods', image: '/airpods_category_uploaded.png', cardTheme: 'grey', isActive: true },
    { name: 'TV & Home', actionText: 'Shop all models →', link: '/tv-home', image: '/tvhome_category_uploaded.png', cardTheme: 'light', isActive: true },
    { name: 'Accessories', actionText: 'Shop all models →', link: '/accessories', image: '/accessories_category_uploaded.png', cardTheme: 'dark', isActive: true },
    { name: 'AppleCare+', actionText: 'Explore coverage →', link: '/applecare', image: '/applecare_official_hero.png', cardTheme: 'dark', isActive: true },
    { name: 'New Arrivals', actionText: 'Explore latest releases →', link: '/shop?sort=newest', image: '', cardTheme: 'dark', isActive: true },
  ]);

  const [testimonials, setTestimonials] = useState([
    { stars: 5, text: '"Procured 40 MacBooks for our new office in 3 days, GST invoice sorted same week."', author: '— IT Head, Fintech firm, Bengaluru', isActive: true },
    { stars: 5, text: '"Our gifting desk orders AirPods every quarter — consolidated billing makes finance happy."', author: '— Procurement Lead, D2C brand, Mumbai', isActive: true },
    { stars: 5, text: '"Quote turnaround was faster than two other resellers we checked."', author: '— Ops Manager, Consulting firm, Delhi NCR', isActive: true },
    { stars: 5, text: '"Reliable for repeat bulk orders, delivered to three city offices without issue."', author: '— Admin Head, BPO, Pune', isActive: true }
  ]);

  const activeSlides = heroSlides.filter((slide) => slide.isActive !== false);
  const slidesToRender = activeSlides.length > 0 ? activeSlides : heroSlides;

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axiosClient.get('/settings');
      if (response.data) {
        if (response.data.heroSlides && response.data.heroSlides.length > 0) {
          setHeroSlides(response.data.heroSlides);
        }
        if (response.data.appleCategories && response.data.appleCategories.length > 0) {
          setAppleCategories(response.data.appleCategories);
        }
        if (response.data.testimonials && response.data.testimonials.length > 0) {
          setTestimonials(response.data.testimonials);
        }
      }
    } catch (err) {
      console.error('Failed to load home layout settings:', err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTarget = params.get('scroll');
    if (scrollTarget === 'procurement') {
      setTimeout(() => {
        const section = document.getElementById('procurement-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } else if (scrollTarget === 'categories') {
      setTimeout(() => {
        const section = document.getElementById('apple-categories');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [location]);

  useEffect(() => {
    if (slidesToRender.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesToRender.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slidesToRender.length]);

  return (
    <div className="b2b-hero">
      <style>{`
        .b2b-hero {
          --ink:#FFFFFF;
          --ink-2:#F5F5F7;
          --ink-3:#101012;
          --paper:#1D1D1F;
          --blue:#0071E3;
          --line:rgba(0,0,0,0.10);
          --line-dark:rgba(255,255,255,0.14);
          --muted:rgba(29,29,31,0.62);
          
          background: var(--ink);
          color: var(--paper);
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .b2b-hero h1, .b2b-hero h2, .b2b-hero h3, .b2b-hero .display {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        .b2b-hero a {
          color: inherit;
          text-decoration: none;
        }
        .b2b-hero .wrap {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 28px;
        }
        
        /* HERO CAROUSEL */
        .hero-stage {
          max-width: 1280px;
          margin: 28px auto 0;
          padding: 0 20px;
        }
        .hero-carousel {
          position: relative;
          border-radius: 26px;
          overflow: hidden;
          min-height: 460px;
          height: 460px;
          background: #ffffff;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          -webkit-mask-image: -webkit-radial-gradient(white, black);
          outline: none;
          border: none;
        }
        .slides-wrapper {
          display: flex;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
          will-change: transform;
        }
        .slide {
          height: 100%;
          display: flex;
          align-items: center;
          padding: 64px 64px 56px;
          flex-shrink: 0;
          box-sizing: border-box;
          outline: none;
          border: none;
        }

        .slide-dark {
          background:
            linear-gradient(120deg, rgba(10,10,12,0.88), rgba(10,10,12,0.55) 55%, rgba(10,10,12,0.82)),
            radial-gradient(circle at 20% 30%, #3a3a3f, #101012 70%);
        }
        .slide-light {
          background: linear-gradient(135deg, #eef1f6, #e3e8f2);
        }
        .slide-dark-blue {
          background:
            linear-gradient(120deg, rgba(15,23,42,0.92), rgba(30,41,59,0.75) 55%, rgba(15,23,42,0.85)),
            radial-gradient(circle at 30% 40%, #1e3a8a, #0f172a 70%);
        }
        .slide-dark-blue .slide-content h1 { color: #fff; }
        .slide-dark-blue .slide-content p { color: rgba(255,255,255,0.78); }
        .slide-dark-blue .slide-stats { border-top-color: rgba(255,255,255,0.18); color: rgba(255,255,255,0.75); }
        .slide-dark-blue .slide-stats b { color: #fff; }

        .slide-warm {
          background: linear-gradient(135deg, #1c1917, #292524, #12100e);
        }
        .slide-warm .slide-content h1 { color: #fff; }
        .slide-warm .slide-content p { color: rgba(255,255,255,0.78); }
        .slide-warm .slide-stats { border-top-color: rgba(255,255,255,0.18); color: rgba(255,255,255,0.75); }
        .slide-warm .slide-stats b { color: #fff; }

        .slide-content {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
        }
        .slide-dark .slide-content h1 { color: #fff; }
        .slide-dark .slide-content p { color: rgba(255,255,255,0.72); }
        .slide-light .slide-content h1 { color: var(--paper); }
        .slide-light .slide-content p { color: var(--muted); }

        .slide-content h1 {
          font-family: 'Fraunces', serif;
          font-size: 38px;
          line-height: 1.2;
          font-weight: 700;
          margin-bottom: 16px;
          height: 96px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .slide-content p {
          font-size: 16px;
          line-height: 1.55;
          max-width: 600px;
          margin: 0 auto 28px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-dark {
          background: var(--paper); color: #fff;
          height: 48px;
          padding: 0 28px; border-radius: 10px;
          font-weight: 700; font-size: 14.5px;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          box-sizing: border-box;
        }
        .btn-dark:hover { background: #000; }
        .btn-light {
          background: #fff; color: var(--paper);
          height: 48px;
          padding: 0 28px; border-radius: 10px;
          font-weight: 700; font-size: 14.5px;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          box-sizing: border-box;
          border: 1px solid transparent;
        }
        .btn-light:hover { background: #f2f2f2; }

        .slide-dots {
          position: absolute;
          left: 50%; bottom: 22px;
          transform: translateX(-50%);
          display: flex; gap: 8px;
          z-index: 5;
        }
        .slide-dots button {
          width: 7px; height: 7px; border-radius: 50%;
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(0,0,0,0.12);
          box-shadow: 0 1px 3px rgba(0,0,0,0.25);
          cursor: pointer; padding: 0;
          transition: all .2s ease;
        }
        .slide-dots button.active { width: 20px; border-radius: 4px; background: #fff; }

        .slide-stats {
          margin-top: 32px;
          padding-top: 22px;
          border-top: 1px solid rgba(120,120,120,0.2);
          display: flex; justify-content: center; gap: 36px;
          font-size: 13.5px;
          flex-wrap: wrap;
        }
        .slide-dark .slide-stats { border-top-color: rgba(255,255,255,0.18); color: rgba(255,255,255,0.75); }
        .slide-light .slide-stats { color: var(--muted); }
        .slide-stats b { font-weight: 700; }
        .slide-dark .slide-stats b { color: #fff; }
        .slide-light .slide-stats b { color: var(--paper); }

        @media (max-width: 720px) {
          .slide { padding: 46px 26px; }
          .slide-content h1 { font-size: 28px; }
        }

        .exchange-strip {
          text-align: center;
          font-size: 13px;
          color: var(--muted);
          padding: 16px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          border-top: 1px solid rgba(20,20,20,0.06);
        }
        .exchange-strip b { color: var(--paper); }

        /* EMI STRIP */
        .emi-strip {
          background: #ffffff;
          color: #1d1d1f;
          padding: 24px 40px;
          display: flex; align-items: center; justify-content: center;
          gap: 36px;
          flex-wrap: wrap;
          font-size: 14px;
          font-weight: 500;
        }
        .emi-strip .item { display: flex; align-items: center; gap: 10px; }
        .emi-strip .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #1d1d1f;
          display: inline-block;
          flex-shrink: 0;
        }
        .emi-strip .badge {
          font-size: 11.5px; font-weight: 700;
          border: 1px solid #1d1d1f;
          padding: 3px 10px; border-radius: 999px;
          color: #1d1d1f;
          background: #f8f8fa;
        }
        .emi-strip .more {
          text-decoration: underline;
          text-underline-offset: 3px;
          color: #cfcfcf;
          cursor: pointer;
        }
        
        /* SHOP BY CATEGORY SECTION */
        .b2b-hero .cat-divider-bar {
          background: transparent;
          padding: 24px 0;
          text-align: center;
          margin-top: 180px;
        }
        .b2b-hero .cat-divider-bar .wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .b2b-hero .cat-divider-bar .dot-blue {
          width: 8px;
          height: 8px;
          border-radius: 50%;
         
        }
        .b2b-hero .cat-divider-bar .dot-grey {
          width: 8px;
          height: 8px;
          border-radius: 50%;
         
          opacity: 0.3;
        }
        .b2b-hero .cat-divider-bar .label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #86868B;
        }
        
        .b2b-hero .category-section {
          background: #FFFFFF;
          padding: 35px 0 100px;
          text-align: left;
        }
        .b2b-hero .category-card {
          position: relative;
          border-radius: 22px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          min-height: 310px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-decoration: none;
        }
        .b2b-hero .category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }
        .b2b-hero .category-card.dark {
          background: #111112;
          color: #FFFFFF;
        }
        .b2b-hero .category-card.light {
          background: #F5F5F7;
          color: #1D1D1F;
        }
        .b2b-hero .category-card.grey {
          background: #1C1C1E;
          color: #FFFFFF;
        }
        .b2b-hero .category-card h3 {
          font-size: 28px;
          margin-bottom: 4px;
          font-weight: 700;
          font-family: 'Fraunces', serif;
        }
        .b2b-hero .category-card .action-link {
          font-size: 14px;
          color: #86868B;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
        }
        .b2b-hero .category-card.dark .action-link,
        .b2b-hero .category-card.grey .action-link {
          color: #A1A1A6;
        }

        .b2b-hero .divider { position:relative; height:120px; overflow:hidden; background:transparent; }
        .b2b-hero .divider svg { position:absolute; top:0; left:0; width:100%; height:100%; }
        .b2b-hero .divider-label { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:var(--muted); font-size:11px; letter-spacing:.18em; text-transform:uppercase; font-weight:700; }

        .b2b-hero .quotepanel {
          background:#141414; color:#fff; border-radius:24px; padding:54px;
          display:grid; grid-template-columns:1.1fr 0.9fr; gap:48px; align-items:center;
        }
        @media(max-width:880px){.b2b-hero .quotepanel{grid-template-columns:1fr; padding:32px;}}
        .b2b-hero .quotepanel h2 { color:#fff; font-size:clamp(26px,3.8vw,36px); font-family: 'Fraunces', Georgia, serif; line-height: 1.15; }
        .b2b-hero .quotepanel p { color:rgba(255,255,255,0.7); margin-top:14px; font-size:15.5px; line-height:1.6; }
        .b2b-hero .quoteform { background:#fff; border-radius:20px; padding:36px; color: #111; }
        .b2b-hero .quoteform input, .b2b-hero .quoteform select {
          width:100%; padding:13px 14px; border:1px solid #e2e8f0; border-radius:10px; margin-bottom:12px;
          font-family:inherit; font-size:14px; color:#111; background: #ffffff; outline: none;
        }
        .b2b-hero .quoteform input:focus, .b2b-hero .quoteform select:focus {
          border-color: #0071e3; background: #fff;
        }
        .b2b-hero .quoteform .btn-dark {
          width:100%; justify-content:center; margin-top:4px;
          padding: 14px; border-radius: 10px; font-weight: 600; font-size: 14px;
          background: #141414; color: #fff; display: inline-flex; align-items: center; gap: 8px;
        }
        .b2b-hero .quoteform .btn-dark:hover { background: #000; }

        .b2b-hero .trust-wrap {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
        }
        .b2b-hero .eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #1d1d1f;
          margin-bottom: 20px;
        }
        .b2b-hero .eyebrow .seal {
          width: 6px; height: 6px; border-radius: 50%;
          background: #0071e3;
          box-shadow: 0 0 0 0 rgba(0,113,227,.5);
          animation: pulseSeal 2.2s infinite;
        }
        @keyframes pulseSeal {
          0% { box-shadow: 0 0 0 0 rgba(0,113,227,.4); }
          70% { box-shadow: 0 0 0 9px rgba(0,113,227,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,113,227,0); }
        }

        .b2b-hero .trust-strip {
          position: relative;
          background: #ffffff;
          border: none;
          outline: none;
          border-radius: 24px;
          padding: 36px 20px;
          box-shadow: none;
          overflow: hidden;
        }
        .b2b-hero .trust-strip::before {
          display: none;
        }

        .b2b-hero .trust-list {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          margin: 0;
          padding: 0;
          list-style: none;
          position: relative;
          z-index: 1;
        }

        .b2b-hero .trust-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 6px 24px;
        }
        .b2b-hero .trust-item:not(:first-child) {
          border-left: 1px solid #D1D1D6 !important;
        }

        .b2b-hero .icon-badge {
          flex: 0 0 auto;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4f4f5;
          border: 1px solid #e4e4e7;
          color: #1d1d1f;
          position: relative;
          box-shadow: 0 2px 6px rgba(0,0,0,.02);
          transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
        }
        .b2b-hero .icon-badge svg { width: 22px; height: 22px; position: relative; z-index: 1; stroke-width: 2.2; }
        .b2b-hero .trust-item:hover .icon-badge {
          transform: translateY(-3px);
          background: #e4e4e7;
          color: #000000;
          box-shadow: 0 8px 18px -6px rgba(0,0,0,.15);
        }

        .b2b-hero .trust-copy { min-width: 0; padding-top: 2px; }

        .b2b-hero .trust-title {
          font-size: 15.5px;
          font-weight: 650;
          letter-spacing: -0.01em;
          margin: 0 0 4px;
          color: #1d1d1f;
          line-height: 1.35;
        }
        .b2b-hero .trust-sub {
          font-size: 13px;
          color: #6e6e73;
          margin: 0;
          line-height: 1.5;
        }

        @media (max-width: 900px) {
          .b2b-hero .trust-list { grid-template-columns: repeat(2, 1fr); gap: 28px 0; }
          .b2b-hero .trust-item { border-left: none !important; padding: 0 16px; }
          .b2b-hero .trust-item:nth-child(2n) { border-left: 1px solid #eceef1 !important; }
        }
        @media (max-width: 560px) {
          .b2b-hero .trust-strip { padding: 30px 24px; border-radius: 20px; }
          .b2b-hero .trust-list { grid-template-columns: 1fr; gap: 24px; }
          .b2b-hero .trust-item { border-left: none !important; padding: 0; }
        }

        .b2b-hero .marquee-wrap { overflow:hidden; padding:60px 0; background:var(--ink-2); position:relative; }
        .b2b-hero .marquee-wrap::before, .b2b-hero .marquee-wrap::after {
          content:''; position:absolute; top:0; bottom:0; width:80px; z-index:5;
        }
        .b2b-hero .marquee-wrap::before { left:0; background:linear-gradient(90deg, var(--ink-2), transparent); }
        .b2b-hero .marquee-wrap::after { right:0; background:linear-gradient(270deg, var(--ink-2), transparent); }
        .b2b-hero .marquee-track { display:flex; gap:20px; width:max-content; animation:scrollLR 36s linear infinite; }
        @keyframes scrollLR {
          from { transform:translateX(-50%); }
          to { transform:translateX(0%); }
        }
        .b2b-hero .tescard { min-width:330px; border:1px solid var(--line); border-radius:12px; padding:26px; background:#fff; }
        .b2b-hero .tescard .stars { color:var(--blue); font-size:14px; margin-bottom:14px; }
        .b2b-hero .tescard p { font-size:14px; line-height:1.6; color:var(--paper); margin-bottom:18px; }
        .b2b-hero .tescard .who { font-size:12px; color:var(--muted); }

        .b2b-hero .section { padding:80px 0; }
        .b2b-hero .section-head { max-width:620px; margin-bottom:40px; }
        .b2b-hero .section-head h2 { font-size:clamp(26px,3.6vw,38px); line-height:1.1; }
        .b2b-hero .section-head p { color:var(--muted); margin-top:12px; font-size:15.5px; line-height:1.6; }
      `}</style>

      <div className="hero-stage">
        <div className="hero-carousel" id="heroCarousel">
          <div 
            className="slides-wrapper" 
            style={{ 
              width: `${slidesToRender.length * 100}%`,
              transform: `translateX(-${(currentSlide * 100) / slidesToRender.length}%)` 
            }}
          >
            {slidesToRender.map((slide, idx) => {
              const isImageBg = Boolean(slide.image && slide.image.trim());
              const slideStyle = isImageBg ? {
                backgroundImage: `linear-gradient(120deg, rgba(10,10,12,0.78), rgba(10,10,12,0.55)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              } : {};

              const isAnchor = slide.buttonLink && slide.buttonLink.startsWith('#');

              return (
                <div 
                  key={idx} 
                  className={`slide ${isImageBg ? 'slide-dark' : (slide.bgStyle || 'slide-dark')}`}
                  style={{ width: `${100 / slidesToRender.length}%`, ...slideStyle }}
                >
                  <div className="slide-content text-center">
                    <h1 className="whitespace-pre-line">
                      {slide.titleBold ? <span className="font-extrabold">{slide.titleBold} </span> : null}
                      <span>{slide.titleNormal || slide.title}</span>
                    </h1>
                    <p>{slide.subtitle}</p>
                    {isAnchor ? (
                      <a
                        href={slide.buttonLink || '#'}
                        onClick={(e) => {
                          if (slide.buttonLink && slide.buttonLink.startsWith('#')) {
                            e.preventDefault();
                            const targetId = slide.buttonLink.replace('#', '');
                            const section = document.getElementById(targetId);
                            if (section) {
                              const yOffset = -80;
                              const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
                              window.scrollTo({ top: y, behavior: 'smooth' });
                            }
                          }
                        }}
                        className="btn-light cursor-pointer shadow-sm"
                      >
                        {slide.buttonText || 'Explore Now →'}
                      </a>
                    ) : (
                      <Link
                        to={slide.buttonLink || '/'}
                        className="btn-light cursor-pointer shadow-sm"
                      >
                        {slide.buttonText || 'Explore Now →'}
                      </Link>
                    )}
                    <div className="slide-stats">
                      <span><b>{slide.stat1Bold || 'GST invoicing'}</b> {slide.stat1Normal || 'on every order'}</span>
                      <span><b>{slide.stat2Bold || 'Volume pricing'}</b> {slide.stat2Normal || 'on bulk orders'}</span>
                      <span><b>{slide.stat3Bold || 'Pan-India'}</b> {slide.stat3Normal || 'delivery & tracking'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="slide-dots" id="slideDots">
            {slidesToRender.map((_, idx) => (
              <button
                key={idx}
                className={currentSlide === idx ? 'active' : ''}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="exchange-strip">
        ⟳ Additionally, get exchange bonus up to <b>&nbsp;₹6,000&nbsp;</b> on trade-in value of your old smartphone
      </div>

      {/* Trust Badges — Clean Pure White */}
      <section id="trust" style={{ padding: '30px 0 60px 0', marginTop: '75px', background: '#ffffff' }}>
        <div className="trust-wrap" style={{ padding: '0 20px' }}>
          <div className="eyebrow">Why buy from us</div>

          <div className="trust-strip">
            <ul className="trust-list">
              <li className="trust-item">
                <span className="icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4"/><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/></svg>
                </span>
                <div className="trust-copy">
                  <p className="trust-title">Apple Authorised Reseller</p>
                  <p className="trust-sub">100% genuine products</p>
                </div>
              </li>

              <li className="trust-item">
                <span className="icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3h10a1 1 0 0 1 1 1v16l-3-2-2 2-2-2-2 2-2-2-3 2V4a1 1 0 0 1 1-1z"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>
                </span>
                <div className="trust-copy">
                  <p className="trust-title">GST Invoicing</p>
                  <p className="trust-sub">On every single order</p>
                </div>
              </li>

              <li className="trust-item">
                <span className="icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.6 12.6L12.7 20.5a2 2 0 0 1-2.8 0L3.5 14.1a2 2 0 0 1 0-2.8l7.9-7.9a2 2 0 0 1 1.4-.6H19a2 2 0 0 1 2 2v5.4a2 2 0 0 1-.4 1.4z"/><circle cx="15.5" cy="8.5" r="1.5"/></svg>
                </span>
                <div className="trust-copy">
                  <p className="trust-title">Volume Pricing</p>
                  <p className="trust-sub">Best rates on bulk orders</p>
                </div>
              </li>

              <li className="trust-item">
                <span className="icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12h13V6H1v6z"/><path d="M14 9h4l3 3v3h-7V9z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
                </span>
                <div className="trust-copy">
                  <p className="trust-title">Pan-India Delivery</p>
                  <p className="trust-sub">With real-time tracking</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>



      {/* Category Grid Section */}
      <section id="apple-categories" className="category-section" style={{ scrollMarginTop: '60px', marginTop: '16px', paddingTop: '20px' }}>
        <div className="wrap">
          <div style={{ margin: '0 auto', textAlign: 'center', marginBottom: '28px' }}>
            <h2 className="text-zinc-900" style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#1D1D1F', marginBottom: '12px', fontWeight: 700 }}>
              Apple category
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {appleCategories
              .filter(cat => cat.isActive !== false)
              .map((cat, idx) => {
                const isDark = cat.cardTheme === 'dark' || cat.cardTheme === 'grey';
                const hasImage = Boolean(cat.image && cat.image.trim());
                const bgStyle = hasImage ? {
                  backgroundImage: `url("${cat.image}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                } : {};

                return (
                  <Link
                    key={idx}
                    to={cat.link || '/shop'}
                    className={`category-card ${cat.cardTheme || 'dark'}`}
                    style={bgStyle}
                  >
                    {hasImage && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: isDark
                          ? 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)'
                          : 'linear-gradient(to top, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0) 100%)',
                        zIndex: 1
                      }}></div>
                    )}
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <h3>{cat.name}</h3>
                      <div className="action-link">
                        {cat.actionText || 'Shop all models →'}
                      </div>
                    </div>
                  </Link>
                );
              })
            }
          </div>
        </div>
      </section>

      {/* Light Divider Line Above B2B Section */}
      <div style={{ width: '100%', maxWidth: '1240px', margin: '40px auto 0', height: '1px', backgroundColor: '#d4d4d8' }}></div>

      <div id="procurement-section" className="divider-wrap" style={{ textAlign: 'center', margin: '35px 0 20px' }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', letterSpacing: '.05em', textTransform: 'uppercase', fontWeight: 800, color: '#111111' }}>
          Built for B2B Partners
        </h2>
      </div>

      {/* Quote Panel Section */}
      <section className="section" id="quote" style={{ paddingTop: '20px' }}>
        <div className="wrap">
          <div className="quotepanel">
            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 'normal', fontSize: 'clamp(28px, 4vw, 42px)' }}>
                Buying for your team,<br />not just yourself?
              </h2>
              <p>Tell us roughly what you need and your order size. Our B2B desk will get back with volume pricing and a formal quotation, GST invoice included.</p>

              <div style={{ display: 'flex', gap: '20px', marginTop: '24px', flexWrap: 'wrap', fontSize: '13.5px', color: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#2f6bff' }}></span>
                  Quotes within 24 hours
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#2f6bff' }}></span>
                  Consolidated billing available
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '36px', color: '#10b981', fontSize: '13.5px', fontWeight: '600' }}>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                  <path d="M12.012 2c-5.508 0-9.985 4.478-9.985 9.985 0 1.758.459 3.412 1.258 4.86L2 22l5.312-1.392c1.4.762 2.99 1.196 4.7 1.196 5.508 0 9.985-4.478 9.985-9.985 0-5.507-4.477-9.985-9.985-9.985zm0 17.986c-1.547 0-3.057-.417-4.375-1.206l-.313-.186-3.255.854.87-3.173-.205-.326c-.868-1.383-1.326-2.986-1.326-4.636 0-4.385 3.567-7.952 7.952-7.952 4.384 0 7.951 3.567 7.951 7.952 0 4.384-3.567 7.952-7.951 7.952zm4.359-5.966c-.239-.12-1.414-.698-1.634-.778-.22-.08-.38-.12-.54.12-.16.24-.62.778-.76.938-.14.16-.28.18-.519.06-.24-.12-1.012-.372-1.927-1.188-.713-.636-1.195-1.423-1.335-1.663-.14-.24-.015-.369.105-.489.108-.108.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.195-.47-.393-.406-.54-.414-.14-.007-.3-.007-.46-.007s-.42.06-.64.3c-.22.24-.84.82-.84 2.002 0 1.182.86 2.324.98 2.484.12.16 1.69 2.58 4.096 3.618.572.247 1.02.394 1.368.504.576.183 1.1.157 1.514.095.462-.069 1.414-.578 1.614-1.138.2-.56.2-1.04.14-1.138-.06-.098-.22-.178-.459-.298z" />
                </svg>
                <span>Prefer to chat? Message us on WhatsApp</span>
              </div>
            </div>

            <form onSubmit={handleQuoteSubmit} className="quoteform" noValidate>
              {quoteSuccess && (
                <div style={{ padding: '12px', marginBottom: '14px', background: '#ecfdf5', color: '#065f46', borderRadius: '10px', fontSize: '12px', fontWeight: '600', border: '1px solid #d1fae5', textAlign: 'left' }}>
                  ✓ {quoteSuccess}
                </div>
              )}

              {Object.keys(quoteFormErrors).length > 0 && (
                <div style={{ padding: '10px 14px', marginBottom: '14px', background: '#fef2f2', color: '#991b1b', borderRadius: '10px', fontSize: '12px', fontWeight: '600', border: '1px solid #fecaca', textAlign: 'left' }}>
                  ⚠️ Please fill in all mandatory fields before submitting.
                </div>
              )}

              <div style={{ marginBottom: '12px', textAlign: 'left' }}>
                <input
                  type="text"
                  placeholder="Contact person / Full name *"
                  value={quoteForm.fullName}
                  onChange={(e) => {
                    setQuoteForm({ ...quoteForm, fullName: e.target.value });
                    if (quoteFormErrors.fullName) setQuoteFormErrors({ ...quoteFormErrors, fullName: null });
                  }}
                  style={{
                    borderColor: quoteFormErrors.fullName ? '#ef4444' : undefined,
                    backgroundColor: quoteFormErrors.fullName ? '#fef2f2' : undefined
                  }}
                />
                {quoteFormErrors.fullName && (
                  <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: '600', marginTop: '4px', display: 'block' }}>
                    ⚠️ {quoteFormErrors.fullName}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '12px', textAlign: 'left' }}>
                <input
                  type="tel"
                  placeholder="Mobile / Phone number *"
                  value={quoteForm.phone}
                  onChange={(e) => {
                    setQuoteForm({ ...quoteForm, phone: e.target.value });
                    if (quoteFormErrors.phone) setQuoteFormErrors({ ...quoteFormErrors, phone: null });
                  }}
                  style={{
                    borderColor: quoteFormErrors.phone ? '#ef4444' : undefined,
                    backgroundColor: quoteFormErrors.phone ? '#fef2f2' : undefined
                  }}
                />
                {quoteFormErrors.phone && (
                  <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: '600', marginTop: '4px', display: 'block' }}>
                    ⚠️ {quoteFormErrors.phone}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '12px', textAlign: 'left' }}>
                <select
                  value={quoteForm.productInterest}
                  onChange={(e) => {
                    setQuoteForm({ ...quoteForm, productInterest: e.target.value });
                    if (quoteFormErrors.productInterest) setQuoteFormErrors({ ...quoteFormErrors, productInterest: null });
                  }}
                  style={{
                    borderColor: quoteFormErrors.productInterest ? '#ef4444' : undefined,
                    backgroundColor: quoteFormErrors.productInterest ? '#fef2f2' : undefined
                  }}
                >
                  <option disabled value="Product interest">Interested product *</option>
                  <option value="iPhone">iPhone</option>
                  <option value="Mac">Mac</option>
                  <option value="iPad">iPad</option>
                  <option value="Watch">Watch</option>
                  <option value="AirPods">AirPods</option>
                  <option value="Accessories">Accessories</option>
                  <option value="AppleCare+">AppleCare+</option>
                  <option value="Mixed / Fleet order">Mixed / Fleet order</option>
                </select>
                {quoteFormErrors.productInterest && (
                  <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: '600', marginTop: '4px', display: 'block' }}>
                    ⚠️ {quoteFormErrors.productInterest}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={submittingQuote}
                className="btn-dark"
                style={{ border: 'none', cursor: 'pointer', width: '100%', marginTop: '8px' }}
              >
                {submittingQuote ? 'Submitting...' : 'Request Quote →'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#a1a1aa', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <div style={{ flexGrow: 1, height: '1px', background: '#ececec' }}></div>
                <span style={{ padding: '0 10px' }}>or</span>
                <div style={{ flexGrow: 1, height: '1px', background: '#ececec' }}></div>
              </div>

              <a
                href="https://wa.me/918607222417"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid #10b981', color: '#10b981', background: '#ffffff', borderRadius: '10px', height: '48px', width: '100%', fontSize: '14px', fontWeight: '600' }}
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                  <path d="M12.012 2c-5.508 0-9.985 4.478-9.985 9.985 0 1.758.459 3.412 1.258 4.86L2 22l5.312-1.392c1.4.762 2.99 1.196 4.7 1.196 5.508 0 9.985-4.478 9.985-9.985 0-5.507-4.477-9.985-9.985-9.985zm0 17.986c-1.547 0-3.057-.417-4.375-1.206l-.313-.186-3.255.854.87-3.173-.205-.326c-.868-1.383-1.326-2.986-1.326-4.636 0-4.385 3.567-7.952 7.952-7.952 4.384 0 7.951 3.567 7.951 7.952 0 4.384-3.567 7.952-7.951 7.952zm4.359-5.966c-.239-.12-1.414-.698-1.634-.778-.22-.08-.38-.12-.54.12-.16.24-.62.778-.76.938-.14.16-.28.18-.519.06-.24-.12-1.012-.372-1.927-1.188-.713-.636-1.195-1.423-1.335-1.663-.14-.24-.015-.369.105-.489.108-.108.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.195-.47-.393-.406-.54-.414-.14-.007-.3-.007-.46-.007s-.42.06-.64.3c-.22.24-.84.82-.84 2.002 0 1.182.86 2.324.98 2.484.12.16 1.69 2.58 4.096 3.618.572.247 1.02.394 1.368.504.576.183 1.1.157 1.514.095.462-.069 1.414-.578 1.614-1.138.2-.56.2-1.04.14-1.138-.06-.098-.22-.178-.459-.298z" />
                </svg>
                <span>Chat with B2B Desk on WhatsApp</span>
              </a>
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#a1a1aa', marginTop: '10px' }}>Typically replies in under 30 minutes, Mon–Sat</div>
            </form>
          </div>
        </div>
      </section>


      {/* Testimonial Marquee & Reviews Section */}
      <div style={{ paddingTop: '60px', background: '#f5f5f7' }}>
        <div className="wrap">
          <div className="section-head" style={{ margin: '0 auto 36px auto', textAlign: 'center', maxWidth: '640px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 36px)', fontWeight: '700', color: '#1d1d1f', fontFamily: 'Fraunces, serif' }}>
              What our business partners say.
            </h2>
          </div>
        </div>

        {(() => {
        const activeTestimonials = testimonials.filter(t => t.isActive !== false);
        const listToRender = activeTestimonials.length > 0 ? activeTestimonials : testimonials;
        // Duplicate list for infinite smooth scrolling marquee
        const marqueeItems = [...listToRender, ...listToRender, ...listToRender];

        return (
          <div className="marquee-wrap">
            <div className="marquee-track" id="marquee">
              {marqueeItems.map((item, idx) => (
                <div key={idx} className="tescard" style={{ minWidth: '340px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 24px' }}>
                  {/* 1. Image (Top) */}
                  {item.image && item.image.trim() !== '' ? (
                    <img 
                      src={item.image} 
                      alt="Customer Avatar" 
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e4e4e7', marginBottom: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', background: '#fff' }} 
                    />
                  ) : (
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f4f4f5', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#a1a1aa', marginBottom: '12px', fontSize: '22px' }}>
                      👤
                    </div>
                  )}

                  {/* 2. Rating Stars (Below Image) */}
                  <div className="stars" style={{ color: '#0071e3', fontSize: '16px', letterSpacing: '3px', marginBottom: '12px' }}>
                    {'★'.repeat(item.stars || 5)}
                  </div>

                  {/* 3. Review Quote Text (Below Rating) */}
                  <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#1d1d1f', marginBottom: '14px', fontWeight: '500', textAlign: 'center' }}>
                    {item.text}
                  </p>

                  {/* 4. Author Name / Designation (Below Text) */}
                  <div className="who" style={{ fontSize: '12px', color: 'rgba(29,29,31,0.62)', fontWeight: '600', textAlign: 'center' }}>
                    {item.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
      </div>
    </div>
  );
}
