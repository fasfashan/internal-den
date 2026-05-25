import { GoogleIcon } from '../components/Icons'

export default function EmployeeLoginPage({ onLogin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-stone-50 flex flex-col">
      {/* Top bar */}
      <div className="border-b border-brand-100 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-3">
          <img src="/logo.png" alt="DEN" className="h-7 w-auto object-contain" />
          <span className="text-sm font-medium text-gray-700">Dewan Ekonomi Nasional</span>
        </div>
      </div>

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Logo block */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <img
                src="/logo.png"
                alt="Dewan Ekonomi Nasional"
                className="h-20 w-auto object-contain drop-shadow-md"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Portal Karyawan
            </h1>
            <p className="text-gray-500 mt-1.5 text-sm">Sistem Layanan Internal – Dewan Ekonomi Nasional</p>

            <div className="flex items-center gap-3 mt-6 mx-auto max-w-xs">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Masuk</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          </div>

          {/* Login card */}
          <button
            onClick={onLogin}
            className="w-full group bg-white hover:bg-brand-50 border border-gray-200 hover:border-brand-300 rounded-2xl p-5 text-left transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-brand-50 text-brand-500 border border-brand-200 group-hover:bg-brand-100 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">Masuk dengan Akun Karyawan</p>
                <p className="text-xs text-gray-500 mt-0.5">Ajukan dan pantau peminjaman kendaraan dinas</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 bg-white border border-gray-200 group-hover:border-gray-300 rounded-lg px-3 py-1.5 transition-colors">
                <GoogleIcon className="w-4 h-4" />
                <span className="text-xs font-medium text-gray-600">Google</span>
              </div>
            </div>
          </button>

          <p className="text-center text-xs text-gray-400 mt-8">
            Akses dibatasi untuk pegawai Dewan Ekonomi Nasional.
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
          href="/admin"
          className="text-xs text-gray-400 hover:text-brand-500 transition-colors"
        >
          Login Admin →
        </a>
      </div>
    </div>
  )
}
