import { CarIcon, LogOutIcon } from './Icons'

const NAV_ITEMS = [
  {
    id: 'peminjaman',
    label: 'Peminjaman Kendaraan',
    icon: CarIcon,
  },
]

export default function Sidebar({ activeModule, onNavigate, onSignOut }) {
  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col min-h-0">
      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
          Modul
        </p>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeModule === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-left ${
                active
                  ? 'bg-brand-50 text-brand-600 border border-brand-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-brand-500' : 'text-gray-400'}`} />
              <span className="truncate">{label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
        >
          <LogOutIcon className="w-4 h-4 flex-shrink-0" />
          Keluar
        </button>
      </div>
    </aside>
  )
}
