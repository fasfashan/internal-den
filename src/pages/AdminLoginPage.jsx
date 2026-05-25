import { GoogleIcon } from '../components/Icons'

export default function AdminLoginPage({ onLogin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-gray-100 flex flex-col">
      {/* Top bar */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="DEN" className="h-7 w-auto object-contain" />
            <span className="text-sm font-medium text-gray-700">Dewan Ekonomi Nasional</span>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full uppercase tracking-widest">
            Admin Portal
          </span>
        </div>
      </div>

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Logo block */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Dewan Ekonomi Nasional"
                  className="h-20 w-auto object-contain drop-shadow-md"
                />
                <span className="absolute -top-1 -right-3 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center shadow">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Portal Admin
            </h1>
            <p className="text-gray-500 mt-1.5 text-sm">Sistem Layanan Internal – Dewan Ekonomi Nasional</p>

            <div className="flex items-center gap-3 mt-6 mx-auto max-w-xs">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Akses Terbatas</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-xs text-amber-700">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            Halaman ini hanya untuk administrator sistem yang berwenang.
          </div>

          {/* Login card */}
          <button
            onClick={onLogin}
            className="w-full group bg-white hover:bg-slate-50 border border-gray-200 hover:border-slate-400 rounded-2xl p-5 text-left transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-700 text-white group-hover:bg-slate-800 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">Masuk sebagai Administrator</p>
                <p className="text-xs text-gray-500 mt-0.5">Kelola dan setujui permintaan peminjaman kendaraan</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 bg-white border border-gray-200 group-hover:border-gray-300 rounded-lg px-3 py-1.5 transition-colors">
                <GoogleIcon className="w-4 h-4" />
                <span className="text-xs font-medium text-gray-600">Google</span>
              </div>
            </div>
          </button>

          <p className="text-center text-xs text-gray-400 mt-8">
            Akses admin hanya untuk personel yang ditunjuk.
            <br />
            Hubungi IT Support jika mengalami kendala masuk.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 py-4 flex flex-col sm:flex-row items-center justify-between px-6 gap-2">
        <p className="text-xs text-gray-400">
          © 2026 Dewan Ekonomi Nasional · Sistem Layanan Internal v1.0
        </p>
        <a
          href="/"
          className="text-xs text-gray-400 hover:text-brand-500 transition-colors"
        >
          ← Portal Karyawan
        </a>
      </div>
    </div>
  )
}
