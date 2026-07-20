import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../redux/cartSlice';
import { fetchWishlist } from '../redux/wishlistSlice';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import Footer from '../components/Footer';

import Lenis from 'lenis';

export default function MainLayout() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCart());
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  // Lenis Smooth Scroll Engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    window.lenis = lenis;

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased">
      {/* Top Banner Promotion / Support Utilities */}
      <Header />

      {/* Primary Brand Navigation (Search, Logo, Cart, Wishlist, User Profile dropdown) */}
      <Navbar />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Main Outlet for nested routes */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-8 shrink-0">
        <Outlet />
      </main>

      {/* Footer component */}
      <Footer />
    </div>
  );
}
