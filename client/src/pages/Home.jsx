import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axiosClient from '../services/axiosClient';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const location = useLocation();

  const [quoteForm, setQuoteForm] = useState({
    companyName: '',
    fullName: '',
    email: '',
    phone: '',
    productInterest: 'Product interest',
    quantity: ''
  });
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState('');

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    const { companyName, fullName, email, phone, productInterest, quantity } = quoteForm;

    if (!companyName.trim() || !fullName.trim() || !email.trim() || !phone.trim() || productInterest === 'Product interest' || !quantity) {
      alert('Please fill in all required fields (Company name, Contact person, Email, Phone, Product interest, and Quantity).');
      return;
    }

    setSubmittingQuote(true);
    try {
      await axiosClient.post('/enquiries', {
        companyName,
        fullName,
        email,
        phone,
        productInterest,
        quantity: Number(quantity)
      });
      setQuoteSuccess('Quote request submitted successfully! Our B2B desk will contact you soon.');
      setQuoteForm({
        companyName: '',
        fullName: '',
        email: '',
        phone: '',
        productInterest: 'Product interest',
        quantity: ''
      });
      setTimeout(() => setQuoteSuccess(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to submit quote request.');
    } finally {
      setSubmittingQuote(false);
    }
  };

  const [settings, setSettings] = useState({
    heroTitle1: "Apple devices for your business, sourced right, delivered anywhere in India.",
    heroSubtitle1: "Bulk pricing, GST invoicing, dedicated account support and consolidated billing — built for IT teams, gifting desks and resellers, not one-off retail buyers.",
    heroButtonText1: "Request Bulk Quote →",
    heroTitle2: "The latest Apple lineup, in stock and ready to ship today.",
    heroSubtitle2: "From the newest iPhone 17 series to our best-selling MacBooks and AirPods — explore the full range and place your order in minutes, no quote required.",
    heroButtonText2: "Browse Catalogue →"
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axiosClient.get('/settings');
      if (response.data) {
        setSettings({
          heroTitle1: response.data.heroTitle1 || settings.heroTitle1,
          heroSubtitle1: response.data.heroSubtitle1 || settings.heroSubtitle1,
          heroButtonText1: response.data.heroButtonText1 || settings.heroButtonText1,
          heroTitle2: response.data.heroTitle2 || settings.heroTitle2,
          heroSubtitle2: response.data.heroSubtitle2 || settings.heroSubtitle2,
          heroButtonText2: response.data.heroButtonText2 || settings.heroButtonText2
        });
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
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 2);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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
        }
        .slides-wrapper {
          display: flex;
          width: 200%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .slide {
          width: 50%;
          height: 100%;
          display: flex;
          align-items: center;
          padding: 64px 64px 56px;
          flex-shrink: 0;
        }

        .slide-dark {
          background:
            linear-gradient(120deg, rgba(10,10,12,0.88), rgba(10,10,12,0.55) 55%, rgba(10,10,12,0.82)),
            radial-gradient(circle at 20% 30%, #3a3a3f, #101012 70%);
        }
        .slide-light {
          background: linear-gradient(135deg, #eef1f6, #e3e8f2);
        }

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

        .b2b-hero .trustgrid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--line); border:1px solid var(--line); border-radius:14px; overflow:hidden; }
        @media(max-width:880px){.b2b-hero .trustgrid{grid-template-columns:repeat(2,1fr);}}
        .b2b-hero .tcard { padding:30px 24px; background:#fff; }
        .b2b-hero .tcard .icon { font-size:20px; margin-bottom:14px; color:var(--blue); }
        .b2b-hero .tcard h4 { font-size:15px; margin-bottom:8px; font-weight:700; }
        .b2b-hero .tcard p { font-size:13px; color:var(--muted); line-height:1.55; }

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
          <div className="slides-wrapper" style={{ transform: `translateX(-${currentSlide * 50}%)` }}>
            {/* Slide 0: B2B Procurement */}
            <div className="slide slide-dark">
              <div className="slide-content text-center">
                <h1 className="whitespace-pre-line">{settings.heroTitle1}</h1>
                <p>{settings.heroSubtitle1}</p>
                <a
                  href="#procurement-section"
                  onClick={(e) => {
                    e.preventDefault();
                    const section = document.getElementById('procurement-section');
                    if (section) {
                      const yOffset = -100;
                      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                  className="btn-light cursor-pointer"
                >
                  {settings.heroButtonText1}
                </a>
                <div className="slide-stats">
                  <span><b>GST invoicing</b> on every order</span>
                  <span><b>Volume pricing</b> on bulk orders</span>
                  <span><b>Pan-India</b> delivery &amp; tracking</span>
                </div>
              </div>
            </div>

            {/* Slide 1: Launches & Best Sellers */}
            <div className="slide slide-light">
              <div className="slide-content text-center">
                <h1 className="whitespace-pre-line">{settings.heroTitle2}</h1>
                <p>{settings.heroSubtitle2}</p>
                <a
                  href="#apple-categories"
                  onClick={(e) => {
                    e.preventDefault();
                    const section = document.getElementById('apple-categories');
                    if (section) {
                      const yOffset = -60;
                      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                  className="btn-light cursor-pointer shadow-sm"
                  style={{ border: '1px solid #d1d5db' }}
                >
                  {settings.heroButtonText2}
                </a>
                <div className="slide-stats">
                  <span><b>New launches</b> every month</span>
                  <span><b>Curated</b> best-sellers</span>
                  <span><b>Fast dispatch</b>, 2–4 days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="slide-dots" id="slideDots">
            <button className={currentSlide === 0 ? 'active' : ''} onClick={() => setCurrentSlide(0)} aria-label="Slide 1"></button>
            <button className={currentSlide === 1 ? 'active' : ''} onClick={() => setCurrentSlide(1)} aria-label="Slide 2"></button>
          </div>
        </div>
      </div>

      <div className="exchange-strip">
        ⟳ Additionally, get exchange bonus up to <b>&nbsp;₹6,000&nbsp;</b> on trade-in value of your old smartphone
      </div>

      <div className="emi-strip">
        <div className="item"><span className="dot"></span><span className="badge">Apple</span> Authorised Reseller</div>
        <div className="item"><span className="dot"></span><span className="badge">GST Invoicing</span> on every order</div>
        <div className="item"><span className="dot"></span><span className="badge">Volume Pricing</span> on bulk orders</div>
        <div className="item"><span className="dot"></span><span className="badge">Pan-India</span> delivery &amp; tracking</div>
      </div>

      {/* Balanced Light Divider Line */}
      <div style={{ width: '100%', maxWidth: '1240px', margin: '75px auto 0', height: '1px', backgroundColor: '#d4d4d8' }}></div>

      {/* Category Grid Section */}
      <section id="apple-categories" className="category-section" style={{ scrollMarginTop: '60px' }}>
        <div className="wrap">
          <div style={{ margin: '0 auto', textAlign: 'center', marginBottom: '28px' }}>
            <h2 className="text-zinc-900" style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#1D1D1F', marginBottom: '12px', fontWeight: 700 }}>
              Apple category
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

            {/* iPhone Card */}
            <Link to="/iphone" className="category-card dark" style={{
              backgroundImage: 'url("/iphone_category_uploaded.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)',
                zIndex: 1
              }}></div>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h3>iPhone</h3>
                <div className="action-link">
                  Shop all models <span>→</span>
                </div>
              </div>
            </Link>

            {/* Mac Card */}
            <Link to="/macbook" className="category-card light">
              <div>
                <h3>Mac</h3>
                <div className="action-link">
                  Shop all models <span>→</span>
                </div>
              </div>
            </Link>

            {/* iPad Card */}
            <Link to="/ipad" className="category-card dark" style={{
              backgroundImage: 'url("/ipad_category_uploaded.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)',
                zIndex: 1
              }}></div>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h3>iPad</h3>
                <div className="action-link">
                  Shop all models <span>→</span>
                </div>
              </div>
            </Link>

            {/* Watch Card */}
            <Link to="/watch" className="category-card dark" style={{
              backgroundImage: 'url("/watch_category_uploaded.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)',
                zIndex: 1
              }}></div>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h3>Watch</h3>
                <div className="action-link">
                  Shop all models <span>→</span>
                </div>
              </div>
            </Link>

            {/* AirPods Card */}
            <Link to="/airpods" className="category-card light" style={{
              backgroundImage: 'url("/airpods_category_uploaded.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 60%, rgba(255,255,255,0) 100%)',
                zIndex: 1
              }}></div>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h3>AirPods</h3>
                <div className="action-link">
                  Shop all models <span>→</span>
                </div>
              </div>
            </Link>

            {/* TV&Home Card */}
            <Link to="/tv-home" className="category-card dark" style={{
              backgroundImage: 'url("/tv_home_category_uploaded.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)',
                zIndex: 1
              }}></div>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h3>TV&Home</h3>
                <div className="action-link">
                  Shop all models <span>→</span>
                </div>
              </div>
            </Link>




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

            <form onSubmit={handleQuoteSubmit} className="quoteform">
              {quoteSuccess && (
                <div style={{ padding: '12px', marginBottom: '14px', background: '#ecfdf5', color: '#065f46', borderRadius: '10px', fontSize: '12px', fontWeight: '600', border: '1px solid #d1fae5', textAlign: 'left' }}>
                  {quoteSuccess}
                </div>
              )}
              <input
                type="text"
                placeholder="Company name"
                value={quoteForm.companyName}
                onChange={(e) => setQuoteForm({ ...quoteForm, companyName: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Contact person"
                value={quoteForm.fullName}
                onChange={(e) => setQuoteForm({ ...quoteForm, fullName: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Work email"
                value={quoteForm.email}
                onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={quoteForm.phone}
                onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                required
              />
              <select
                value={quoteForm.productInterest}
                onChange={(e) => setQuoteForm({ ...quoteForm, productInterest: e.target.value })}
                required
              >
                <option disabled value="Product interest">Product interest</option>
                <option value="iPhone">iPhone</option>
                <option value="Mac">Mac</option>
                <option value="iPad">iPad</option>
                <option value="Mixed / Fleet order">Mixed / Fleet order</option>
              </select>
              <input
                type="number"
                placeholder="Quantity (e.g. 10)"
                value={quoteForm.quantity}
                onChange={(e) => setQuoteForm({ ...quoteForm, quantity: e.target.value })}
                required
                min="1"
              />
              <button
                type="submit"
                disabled={submittingQuote}
                className="btn-dark"
                style={{ border: 'none', cursor: 'pointer', width: '100%' }}
              >
                {submittingQuote ? 'Submitting...' : 'Request Quote →'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#a1a1aa', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <div style={{ flexGrow: 1, height: '1px', background: '#ececec' }}></div>
                <span style={{ padding: '0 10px' }}>or</span>
                <div style={{ flexGrow: 1, height: '1px', background: '#ececec' }}></div>
              </div>

              <a
                href="https://wa.me/919999999999"
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


      {/* Trust Grid Section */}
      <section className="section" id="trust" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <h2>Why businesses buy from iincept.</h2>
          </div>
          <div className="trustgrid">
            <div className="tcard">
              <div className="icon">✓</div>
              <h4>100% Authorised</h4>
              <p>Apple Authorised Reseller stock with full manufacturer warranty, every order.</p>
            </div>
            <div className="tcard">
              <div className="icon">🧾</div>
              <h4>GST Invoicing</h4>
              <p>Proper tax invoices on every order — no chasing paperwork later.</p>
            </div>
            <div className="tcard">
              <div className="icon">📦</div>
              <h4>Pan-India Delivery</h4>
              <p>Tracked delivery to any office or warehouse location across India.</p>
            </div>
            <div className="tcard">
              <div className="icon">🤝</div>
              <h4>Dedicated Account Desk</h4>
              <p>One point of contact for repeat and bulk orders, not a generic helpline.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Marquee */}
      <div className="marquee-wrap">
        <div className="marquee-track" id="marquee">
          <div className="tescard"><div className="stars">★★★★★</div><p>"Procured 40 MacBooks for our new office in 3 days, GST invoice sorted same week."</p><div className="who">— IT Head, Fintech firm, Bengaluru</div></div>
          <div className="tescard"><div className="stars">★★★★★</div><p>"Our gifting desk orders AirPods every quarter — consolidated billing makes finance happy."</p><div className="who">— Procurement Lead, D2C brand, Mumbai</div></div>
          <div className="tescard"><div className="stars">★★★★★</div><p>"Quote turnaround was faster than two other resellers we checked."</p><div className="who">— Ops Manager, Consulting firm, Delhi NCR</div></div>
          <div className="tescard"><div className="stars">★★★★★</div><p>"Reliable for repeat bulk orders, delivered to three city offices without issue."</p><div className="who">— Admin Head, BPO, Pune</div></div>
          <div className="tescard"><div className="stars">★★★★★</div><p>"Procured 40 MacBooks for our new office in 3 days, GST invoice sorted same week."</p><div className="who">— IT Head, Fintech firm, Bengaluru</div></div>
          <div className="tescard"><div className="stars">★★★★★</div><p>"Our gifting desk orders AirPods every quarter — consolidated billing makes finance happy."</p><div className="who">— Procurement Lead, D2C brand, Mumbai</div></div>
          <div className="tescard"><div className="stars">★★★★★</div><p>"Quote turnaround was faster than two other resellers we checked."</p><div className="who">— Ops Manager, Consulting firm, Delhi NCR</div></div>
          <div className="tescard"><div className="stars">★★★★★</div><p>"Reliable for repeat bulk orders, delivered to three city offices without issue."</p><div className="who">— Admin Head, BPO, Pune</div></div>
        </div>
      </div>
    </div>
  );
}
