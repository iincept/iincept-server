import { createBrowserRouter, RouterProvider, Navigate, useRouteError } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Admin pages (lazy loaded for performance)
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Products = lazy(() => import('./pages/admin/Products'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const Orders = lazy(() => import('./pages/admin/Orders'));
const Users = lazy(() => import('./pages/admin/Users'));
const Coupons = lazy(() => import('./pages/admin/Coupons'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const HeroBanners = lazy(() => import('./pages/admin/HeroBanners'));
const AppleCategories = lazy(() => import('./pages/admin/AppleCategories'));
const Testimonials = lazy(() => import('./pages/admin/Testimonials'));
const NavbarManager = lazy(() => import('./pages/admin/NavbarManager'));
const CategoryIconsManager = lazy(() => import('./pages/admin/CategoryIconsManager'));
const AppleCareManager = lazy(() => import('./pages/admin/AppleCareManager'));
const DisplayAppleCareManager = lazy(() => import('./pages/admin/DisplayAppleCareManager'));
const IpadAppleCareManager = lazy(() => import('./pages/admin/IpadAppleCareManager'));
const IphoneAppleCareManager = lazy(() => import('./pages/admin/IphoneAppleCareManager'));
const WatchAppleCareManager = lazy(() => import('./pages/admin/WatchAppleCareManager'));
const AirpodsAppleCareManager = lazy(() => import('./pages/admin/AirpodsAppleCareManager'));
const TvHomeAppleCareManager = lazy(() => import('./pages/admin/TvHomeAppleCareManager'));
const HomePodAppleCareManager = lazy(() => import('./pages/admin/HomePodAppleCareManager'));
const ProductAppleCareManager = lazy(() => import('./pages/admin/ProductAppleCareManager'));
const FooterManager = lazy(() => import('./pages/admin/FooterManager'));
const Returns = lazy(() => import('./pages/admin/Returns'));
const Enquiries = lazy(() => import('./pages/admin/Enquiries'));
const SalesReport = lazy(() => import('./pages/admin/SalesReport'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full w-full py-20">
    <div className="h-8 w-8 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin" />
  </div>
);

const RouteErrorFallback = () => {
  const error = useRouteError();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-white rounded-3xl border border-rose-100 shadow-xs m-6">
      <h2 className="text-xl font-bold text-rose-600 mb-2">Something went wrong</h2>
      <p className="text-sm text-zinc-600 mb-4">{error?.message || 'An unexpected error occurred in this view.'}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2.5 bg-[#0071e3] hover:bg-[#005bb5] text-white text-xs font-bold rounded-xl border-0 cursor-pointer"
      >
        Reload Dashboard
      </button>
    </div>
  );
};

const adminChildrenRoutes = [
  { path: '', element: <Navigate to="/admin/dashboard" replace /> },
  { path: 'dashboard', element: <Suspense fallback={<LoadingSpinner />}><Dashboard /></Suspense> },
  { path: 'home', element: <Suspense fallback={<LoadingSpinner />}><Dashboard /></Suspense> },
  { path: 'products', element: <Suspense fallback={<LoadingSpinner />}><Products /></Suspense> },
  { path: 'categories', element: <Suspense fallback={<LoadingSpinner />}><Categories /></Suspense> },
  { path: 'orders', element: <Suspense fallback={<LoadingSpinner />}><Orders /></Suspense> },
  { path: 'users', element: <Suspense fallback={<LoadingSpinner />}><Users /></Suspense> },
  { path: 'coupons', element: <Suspense fallback={<LoadingSpinner />}><Coupons /></Suspense> },
  { path: 'hero-banners', element: <Suspense fallback={<LoadingSpinner />}><HeroBanners /></Suspense> },
  { path: 'apple-categories', element: <Suspense fallback={<LoadingSpinner />}><AppleCategories /></Suspense> },
  { path: 'testimonials', element: <Suspense fallback={<LoadingSpinner />}><Testimonials /></Suspense> },
  { path: 'navbar-menu', element: <Suspense fallback={<LoadingSpinner />}><NavbarManager /></Suspense> },
  { path: 'category-icons', element: <Suspense fallback={<LoadingSpinner />}><CategoryIconsManager /></Suspense> },
  { path: 'applecare', element: <Suspense fallback={<LoadingSpinner />}><AppleCareManager /></Suspense> },
  { path: 'display-applecare', element: <Suspense fallback={<LoadingSpinner />}><DisplayAppleCareManager /></Suspense> },
  { path: 'displayapplecare', element: <Suspense fallback={<LoadingSpinner />}><DisplayAppleCareManager /></Suspense> },
  { path: 'ipad-applecare', element: <Suspense fallback={<LoadingSpinner />}><IpadAppleCareManager /></Suspense> },
  { path: 'iphone-applecare', element: <Suspense fallback={<LoadingSpinner />}><IphoneAppleCareManager /></Suspense> },
  { path: 'watch-applecare', element: <Suspense fallback={<LoadingSpinner />}><WatchAppleCareManager /></Suspense> },
  { path: 'airpods-applecare', element: <Suspense fallback={<LoadingSpinner />}><AirpodsAppleCareManager /></Suspense> },
  { path: 'tv-home-applecare', element: <Suspense fallback={<LoadingSpinner />}><TvHomeAppleCareManager /></Suspense> },
  { path: 'tvhome-applecare', element: <Suspense fallback={<LoadingSpinner />}><TvHomeAppleCareManager /></Suspense> },
  { path: 'homepod-applecare', element: <Suspense fallback={<LoadingSpinner />}><HomePodAppleCareManager /></Suspense> },
  { path: 'product-applecare', element: <Suspense fallback={<LoadingSpinner />}><ProductAppleCareManager /></Suspense> },
  { path: 'footer-menu', element: <Suspense fallback={<LoadingSpinner />}><FooterManager /></Suspense> },
  { path: 'settings', element: <Suspense fallback={<LoadingSpinner />}><Settings /></Suspense> },
  { path: 'returns', element: <Suspense fallback={<LoadingSpinner />}><Returns /></Suspense> },
  { path: 'enquiries', element: <Suspense fallback={<LoadingSpinner />}><Enquiries /></Suspense> },
  { path: 'sales-report', element: <Suspense fallback={<LoadingSpinner />}><SalesReport /></Suspense> },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/admin/dashboard" replace />
  },
  {
    path: '/login',
    element: <AdminLogin />
  },
  {
    path: '/admin/login',
    element: <AdminLogin />
  },
  {
    path: '/admin',
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorFallback />,
    children: adminChildrenRoutes
  },
  {
    path: '/dashboard',
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    errorElement: <RouteErrorFallback />,
    children: adminChildrenRoutes
  },
  {
    path: '*',
    element: <Navigate to="/admin/dashboard" replace />
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
