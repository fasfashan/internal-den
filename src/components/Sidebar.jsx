import { useState } from 'react'
import { CarIcon, TruckIcon, LogOutIcon, GridIcon, CalendarIcon, FolderIcon, FileTextIcon, GavelIcon, UsersIcon, SettingsIcon, ActivityIcon, ScrollTextIcon, ChevronDownIcon } from './Icons'

const EMPLOYEE_NAV = [
  { id: 'peminjaman', label: 'Peminjaman Kendaraan', shortLabel: 'Peminjaman', icon: CarIcon },
]

const ADMIN_NAV_PEMINJAMAN = [
  { id: 'peminjaman', label: 'Peminjaman Kendaraan', shortLabel: 'Kendaraan', icon: CarIcon },
  { id: 'kendaraan',  label: 'Armada Kendaraan',    shortLabel: 'Armada',    icon: TruckIcon },
]

const ADMIN_NAV_SIAPPRO = [
  { id: 'dashboard',       label: 'Dashboard',      shortLabel: 'Dashboard',   icon: GridIcon },
  { id: 'kegiatan',        label: 'Kegiatan',        shortLabel: 'Kegiatan',    icon: CalendarIcon },
  { id: 'master-kegiatan', label: 'Master Kegiatan', shortLabel: 'Master Keg.', icon: ActivityIcon },
  { id: 'dokumentasi',     label: 'Dokumentasi',     shortLabel: 'Dokumentasi', icon: FolderIcon },
  { id: 'lpd',             label: 'LPD',             shortLabel: 'LPD',         icon: FileTextIcon },
  { id: 'persidangan',     label: 'Persidangan',     shortLabel: 'Sidang',      icon: GavelIcon },
  { id: 'pengguna',        label: 'Pengguna',        shortLabel: 'Pengguna',    icon: UsersIcon },
  { id: 'pengaturan',      label: 'Pengaturan',      shortLabel: 'Pengaturan',  icon: SettingsIcon },
  { id: 'log-api',         label: 'Log API',         shortLabel: 'Log API',     icon: ScrollTextIcon },
]

const SIAPPRO_IDS = new Set(ADMIN_NAV_SIAPPRO.map(n => n.id))

const ADMIN_BOTTOM_NAV = [
  { id: 'dashboard',  shortLabel: 'Dashboard', icon: GridIcon },
  { id: 'peminjaman', shortLabel: 'Kendaraan', icon: CarIcon },
  { id: 'kendaraan',  shortLabel: 'Armada',    icon: TruckIcon },
  { id: 'kegiatan',   shortLabel: 'Kegiatan',  icon: CalendarIcon },
]

function NavButton({ id, label, icon: Icon, active, onClick, indent }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-left ${
        indent ? 'px-2' : 'px-3'
      } ${
        active
          ? 'bg-brand-50 text-brand-600 border border-brand-200'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-brand-500' : 'text-gray-400'}`} />
      <span className="truncate">{label}</span>
      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />}
    </button>
  )
}

export default function Sidebar({ activeModule, onNavigate, onSignOut, isAdmin }) {
  const siapProActive = SIAPPRO_IDS.has(activeModule)
  const [siapProOpen, setSiapProOpen] = useState(siapProActive)

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white border-r border-gray-200 min-h-0">
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {isAdmin ? (
          <div className="space-y-0.5">
            <p className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Modul
            </p>

            {/* Peminjaman */}
            {ADMIN_NAV_PEMINJAMAN.map(({ id, label, icon }) => (
              <NavButton key={id} id={id} label={label} icon={icon}
                active={activeModule === id} onClick={onNavigate} />
            ))}

            {/* SIAPPro accordion */}
            <div className="pt-0.5">
              <button
                onClick={() => setSiapProOpen(o => !o)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-left ${
                  siapProActive
                    ? 'text-brand-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`text-[10px] font-bold tracking-widest uppercase flex-1 ${siapProActive ? 'text-brand-500' : 'text-gray-400'}`}>
                  SIAPPro
                </span>
                <ChevronDownIcon className={`w-3.5 h-3.5 shrink-0 transition-transform ${siapProOpen ? 'rotate-180' : ''} ${siapProActive ? 'text-brand-400' : 'text-gray-400'}`} />
              </button>

              {siapProOpen && (
                <div className="ml-3 pl-3 border-l border-gray-200 space-y-0.5 mt-0.5">
                  {ADMIN_NAV_SIAPPRO.map(({ id, label, icon }) => (
                    <NavButton key={id} id={id} label={label} icon={icon}
                      active={activeModule === id} onClick={onNavigate} indent />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-0.5">
            <p className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Modul
            </p>
            {EMPLOYEE_NAV.map(({ id, label, icon }) => (
              <NavButton key={id} id={id} label={label} icon={icon}
                active={activeModule === id} onClick={onNavigate} />
            ))}
          </div>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
        >
          <LogOutIcon className="w-4 h-4 shrink-0" />
          Keluar
        </button>
      </div>
    </aside>
  )
}

export function BottomNav({ activeModule, onNavigate, onSignOut, isAdmin }) {
  const items = isAdmin ? ADMIN_BOTTOM_NAV : EMPLOYEE_NAV

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-10 flex items-stretch"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {items.map(({ id, shortLabel, icon: Icon }) => {
        const active = activeModule === id
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors cursor-pointer relative ${
              active ? 'text-brand-500' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon className={`w-5 h-5 ${active ? 'text-brand-500' : 'text-gray-400'}`} />
            {shortLabel}
            {active && <span className="absolute top-0 h-0.5 w-8 bg-brand-400 rounded-full" />}
          </button>
        )
      })}
      <button
        onClick={onSignOut}
        className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
      >
        <LogOutIcon className="w-5 h-5" />
        Keluar
      </button>
    </nav>
  )
}
