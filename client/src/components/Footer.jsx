import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200/80 text-zinc-600 text-xs mt-auto shrink-0 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-6">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Logo & Info column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-1.5">
              {/* Custom sprout/seedling logo matching mockup concept */}
              <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                {/* Left Leaf */}
                <path d="M16 28C16 28 11.5 23.5 11.5 17.5C11.5 11.5 16.5 7 20 7C20 7 18 11.5 18 17.5C18 23.5 16 28 16 28Z" fill="#10B981" fillOpacity="0.85" />
                {/* Right Leaf */}
                <path d="M24 28C24 28 28.5 23.5 28.5 17.5C28.5 11.5 23.5 7 20 7C20 7 22 11.5 22 17.5C22 23.5 24 28 24 28Z" fill="#34D399" fillOpacity="0.95" />
                {/* Stem */}
                <path d="M20 7V33" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className="text-2xl font-bold text-zinc-900 tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                iincept
              </span>
            </div>
            <p className="text-zinc-500 text-[13px] leading-relaxed max-w-sm">
              Apple Authorised Reseller. B2B procurement, delivered pan India.
            </p>
          </div>

          {/* SHOP column */}
          <div className="lg:col-span-2 lg:col-start-7 space-y-4">
            <h4 className="font-bold tracking-wider uppercase text-[#0066cc] text-[11px]">
              SHOP
            </h4>
            <ul className="space-y-3 text-[13px] text-zinc-600">
              <li><Link to="/iphone" className="hover:text-zinc-900 transition-colors">iPhone</Link></li>
              <li><Link to="/macbook" className="hover:text-zinc-900 transition-colors">Mac</Link></li>
              <li><Link to="/ipad" className="hover:text-zinc-900 transition-colors">iPad</Link></li>
              <li><Link to="/watch" className="hover:text-zinc-900 transition-colors">Watch</Link></li>
              <li><Link to="/airpods" className="hover:text-zinc-900 transition-colors">AirPods</Link></li>
              <li><Link to="/applecare" className="hover:text-zinc-900 transition-colors">AppleCare+</Link></li>
            </ul>
          </div>

          {/* BUSINESS column */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold tracking-wider uppercase text-[#0066cc] text-[11px]">
              BUSINESS
            </h4>
            <ul className="space-y-3 text-[13px] text-zinc-600">
              <li><Link to="/bulk-orders" className="hover:text-zinc-900 transition-colors">Request a Quote</Link></li>
              <li><Link to="/bulk-orders" className="hover:text-zinc-900 transition-colors">Bulk Pricing</Link></li>
              <li><Link to="/login" className="hover:text-zinc-900 transition-colors">Dealer Login</Link></li>
              <li><Link to="/bulk-orders" className="hover:text-zinc-900 transition-colors">GST Invoicing</Link></li>
            </ul>
          </div>

          {/* COMPANY column */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold tracking-wider uppercase text-[#0066cc] text-[11px]">
              COMPANY
            </h4>
            <ul className="space-y-3 text-[13px] text-zinc-600">
              <li><Link to="/about" className="hover:text-zinc-900 transition-colors">About iincept</Link></li>
              <li><Link to="/contact" className="hover:text-zinc-900 transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-zinc-900 transition-colors">FAQ</Link></li>
              <li><Link to="/policies" className="hover:text-zinc-900 transition-colors">Policies</Link></li>
            </ul>
          </div>

        </div>

        {/* Divider and Copyright line */}
        <div className="mt-12 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            © 2026 iincept. Apple Authorised Reseller.
          </div>
          <div className="text-zinc-400">
            Demo — landing page concept
          </div>
        </div>

      </div>

      {/* Floating WhatsApp Contact Button (Global across all MainLayout pages) */}
      <a
        href="https://wa.me/918607222417?text=Hi%20there!%20I%20am%20interested%20in%20buying%20Apple%20products%20for%20my%20business."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_4px_14px_rgba(37,211,102,0.45)] hover:scale-110 active:scale-95 transition-all z-45"
        title="Chat with us on WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.59 2.012 14.125.99 11.516.99c-5.44 0-9.866 4.372-9.87 9.802 0 1.706.467 3.376 1.349 4.86L2.014 22l6.633-1.745zM15.938 12.67c-.237-.117-1.4-.69-1.617-.768-.218-.078-.376-.117-.534.117-.158.236-.61.768-.748.924-.138.156-.277.175-.515.058-.237-.117-.998-.367-1.9-1.173-.702-.627-1.176-1.401-1.314-1.636-.138-.236-.015-.363.104-.48l.317-.37c.105-.122.138-.208.208-.346.069-.138.034-.26-.017-.378-.052-.117-.534-1.285-.733-1.76-.193-.466-.39-.402-.534-.41-.138-.007-.297-.009-.455-.009-.158 0-.416.059-.633.296-.217.236-.83.811-.83 1.977 0 1.166.85 2.292.969 2.45.118.157 1.673 2.553 4.053 3.58.566.244 1.008.39 1.353.499.569.18 1.087.155 1.496.094.456-.068 1.4-.572 1.6-1.127.198-.555.198-1.03.139-1.127-.059-.098-.218-.156-.456-.274z" />
        </svg>
      </a>
    </footer>
  );
}
