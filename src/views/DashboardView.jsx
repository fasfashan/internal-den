function readLS(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v !== null ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function StatCard({ label, count, color, bg, border }) {
  return (
    <div className={`${bg} ${border ?? 'border-gray-200'} rounded-2xl border px-5 py-4`}>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{count}</p>
    </div>
  )
}

export default function DashboardView({ adminName }) {
  const kegiatan    = readLS('den_kegiatan', [])
  const dokumentasi = readLS('den_dokumentasi', [])
  const lpd         = readLS('den_lpd', [])
  const persidangan = readLS('den_persidangan', [])
  const pengguna    = readLS('den_users', [])
  const bookings    = readLS('den_bookings', [])

  const stats = [
    { label: 'Total Kegiatan',    count: kegiatan.length,    color: 'text-brand-600',  bg: 'bg-brand-50',  border: 'border-brand-200' },
    { label: 'Total Dokumentasi', count: dokumentasi.length, color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
    { label: 'Total LPD',         count: lpd.length,         color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
    { label: 'Total Persidangan', count: persidangan.length, color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200' },
    { label: 'Total Pengguna',    count: pengguna.length,    color: 'text-slate-600',  bg: 'bg-slate-50',  border: 'border-slate-200' },
    { label: 'Total Peminjaman',  count: bookings.length,    color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
  ]

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Selamat datang, {adminName ?? 'Admin'}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Ringkasan data sistem DEN Dashboard</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map(s => (
          <StatCard key={s.label} label={s.label} count={s.count} color={s.color} bg={s.bg} border={s.border} />
        ))}
      </div>
    </div>
  )
}
