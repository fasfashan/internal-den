import { UsersIcon } from '../components/Icons'

export default function ManajemenAkun() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 bg-brand-50 border border-brand-200 rounded-2xl flex items-center justify-center mb-5">
        <UsersIcon className="w-8 h-8 text-brand-400" />
      </div>

      <span className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200 text-brand-600 text-xs font-medium px-3 py-1 rounded-full mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
        Dalam Pengembangan
      </span>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">Manajemen Akun</h2>
      <p className="text-sm text-gray-500 max-w-sm">
        Modul ini sedang dalam tahap pengembangan. Fitur pengelolaan akun pengguna, hak akses, dan direktori karyawan akan tersedia dalam waktu dekat.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
        {[
          { label: 'Direktori Karyawan', desc: 'Kelola data pegawai' },
          { label: 'Hak Akses', desc: 'Atur peran & izin' },
          { label: 'Audit Log', desc: 'Rekam jejak aktivitas' },
        ].map(f => (
          <div key={f.label} className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-left opacity-50">
            <p className="text-xs font-semibold text-gray-700">{f.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
