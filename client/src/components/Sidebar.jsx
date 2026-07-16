import { NavLink } from 'react-router-dom';

export default function Sidebar({ title, items = [] }) {
  return (
    <aside className="w-full lg:w-64 bg-slate-900 border border-slate-850 rounded-2xl p-5 shrink-0 text-left">
      {title && (
        <div className="border-b border-slate-800 pb-3 mb-4">
          <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">{title}</h2>
        </div>
      )}

      <ul className="space-y-1.5">
        {items.map((item, index) => {
          const Icon = item.icon;
          
          // Reusable link setup (supports both route links and action buttons)
          if (item.path) {
            return (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-violet-950/40 text-violet-400 border border-violet-800/40 shadow-inner'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60 border border-transparent'
                    }`
                  }
                >
                  {Icon && <Icon className="h-4.5 w-4.5" />}
                  <span className="flex-grow">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="bg-slate-850 text-slate-400 font-bold px-2 py-0.5 rounded-full text-[9px] border border-slate-800">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          }

          // Fallback to standard button if no router link path is provided
          return (
            <li key={index}>
              <button
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-all duration-200 border ${
                  item.isActive
                    ? 'bg-violet-950/40 text-violet-400 border-violet-800/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60 border-transparent'
                }`}
              >
                {Icon && <Icon className="h-4.5 w-4.5" />}
                <span className="flex-grow">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="bg-slate-850 text-slate-400 font-bold px-2 py-0.5 rounded-full text-[9px] border border-slate-800">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
