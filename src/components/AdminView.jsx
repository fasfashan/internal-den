import { useState } from 'react'
import StatusBadge from './StatusBadge'
import { CheckIcon, XIcon, ClockIcon, CameraIcon, ImageIcon } from './Icons'

const ALL_STATUSES = [
  'Menunggu Konfirmasi',
  'Menunggu Serah Terima',
  'Sedang Digunakan',
  'Selesai',
  'Ditolak',
]

const FILTER_TABS = ['Semua', ...ALL_STATUSES]

function formatDate(dt) {
  if (!dt) return '-'
  return new Date(dt).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function formatDateTime(dt) {
  if (!dt) return '-'
  return new Date(dt).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminView({ bookings, onUpdateStatus }) {
  // filter is the single source of truth for status — shared by tabs AND dropdown
  const [filter,     setFilter]     = useState('Semua')
  const [search,     setSearch]     = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const selectedBooking = selectedId != null ? bookings.find(b => b.id === selectedId) ?? null : null

  const filterCounts = FILTER_TABS.reduce((acc, f) => {
    acc[f] = f === 'Semua' ? bookings.length : bookings.filter(b => b.status === f).length
    return acc
  }, {})

  const q = search.trim().toLowerCase()
  const filtered = bookings.filter(b => {
    const matchStatus = filter === 'Semua' || b.status === filter
    const matchSearch = !q || b.name.toLowerCase().includes(q) || b.destination.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const pendingCount = bookings.filter(b => b.status === 'Menunggu Konfirmasi').length
  const aktifCount   = bookings.filter(b => b.status === 'Menunggu Serah Terima' || b.status === 'Sedang Digunakan').length
  const selesaiCount = bookings.filter(b => b.status === 'Selesai').length

  function handleSetujui(id) {
    onUpdateStatus(id, 'Menunggu Serah Terima')
  }
  function handleTolak(id) {
    onUpdateStatus(id, 'Ditolak')
  }

  return (
    <div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Permohonan"    count={bookings.length} color="text-gray-700"  bg="bg-white" />
        <StatCard label="Menunggu Konfirmasi" count={pendingCount}     color="text-amber-600" bg="bg-amber-50" />
        <StatCard label="Sedang Aktif"        count={aktifCount}       color="text-blue-600"  bg="bg-blue-50" />
        <StatCard label="Selesai"             count={selesaiCount}     color="text-green-600" bg="bg-green-50" />
      </div>

      {/* Main panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Panel header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Daftar Permohonan</h2>
              <p className="text-sm text-gray-500 mt-0.5">Tinjau dan kelola seluruh permohonan kendaraan dinas</p>
            </div>

            {/* Search + status dropdown */}
            <div className="flex gap-2 flex-shrink-0">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari nama atau tujuan..."
                  className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl outline-none w-56 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-gray-400"
                />
              </div>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all text-gray-700 bg-white cursor-pointer"
              >
                <option value="Semua">Semua Status</option>
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status filter tabs */}
          <div className="mt-4 flex gap-1 overflow-x-auto pb-0.5">
            {FILTER_TABS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-brand-400 text-white'
                    : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f}
                <span className={`ml-1.5 ${filter === f ? 'text-white/80' : 'text-gray-400'}`}>
                  {filterCounts[f]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm">
              {search ? `Tidak ada hasil untuk "${search}"` : 'Tidak ada permohonan dengan status ini'}
            </p>
            {(search || filter !== 'Semua') && (
              <button
                onClick={() => { setSearch(''); setFilter('Semua') }}
                className="mt-2 text-xs text-brand-500 hover:underline cursor-pointer"
              >
                Reset filter
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <Th className="w-12 text-center">No</Th>
                  <Th>Nama Peminjam</Th>
                  <Th>Unit Kerja</Th>
                  <Th>Tujuan</Th>
                  <Th className="w-36">Tgl. Berangkat</Th>
                  <Th className="w-36">Tgl. Kembali</Th>
                  <Th className="w-44">Status</Th>
                  <Th className="w-20 text-center">Aksi</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((b, idx) => (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedId(b.id)}
                    className="hover:bg-brand-50/40 transition-colors cursor-pointer"
                  >
                    <Td className="text-center text-gray-400 font-medium">{idx + 1}</Td>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {b.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 truncate max-w-[130px]">{b.name}</span>
                      </div>
                    </Td>
                    <Td>
                      <span className="text-gray-600 truncate max-w-[180px] block">{b.division}</span>
                    </Td>
                    <Td>
                      <span className="text-gray-600 truncate max-w-[180px] block">{b.destination}</span>
                    </Td>
                    <Td className="text-gray-500">{formatDate(b.dateStart)}</Td>
                    <Td className="text-gray-500">{formatDate(b.dateEnd)}</Td>
                    <Td><StatusBadge status={b.status} /></Td>
                    <Td className="text-center">
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedId(b.id) }}
                        className="px-3 py-1.5 text-xs font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Detail
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Row count */}
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">
            Menampilkan {filtered.length} dari {bookings.length} permohonan
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedId(null)}
          onSetujui={() => handleSetujui(selectedBooking.id)}
          onTolak={() => handleTolak(selectedBooking.id)}
        />
      )}
    </div>
  )
}

/* ─── Table primitives ─────────────────────────────────────── */

function Th({ children, className = '' }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide ${className}`}>
      {children}
    </th>
  )
}

function Td({ children, className = '' }) {
  return (
    <td className={`px-4 py-3.5 text-sm ${className}`}>
      {children}
    </td>
  )
}

/* ─── Stat card ────────────────────────────────────────────── */

function StatCard({ label, count, color, bg }) {
  return (
    <div className={`${bg} rounded-2xl border border-gray-200 px-5 py-4`}>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{count}</p>
    </div>
  )
}

/* ─── Detail modal ─────────────────────────────────────────── */

function BookingDetailModal({ booking: b, onClose, onSetujui, onTolak }) {
  const photos = b.photos ?? {}

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Detail Permohonan</h3>
            <p className="text-xs text-gray-400 mt-0.5">Diajukan {formatDateTime(b.submittedAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={b.status} />
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal body — scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

          {/* Booking info grid */}
          <section>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Informasi Permohonan</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <Detail label="Nama Lengkap"            value={b.name} />
              <Detail label="Unit Kerja"               value={b.division} />
              <Detail label="Tujuan Perjalanan"        value={b.destination} span />
              <Detail label="Keperluan / Tujuan Dinas" value={b.purpose}     span />
              <Detail
                label="Waktu Berangkat"
                value={<span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5 text-gray-400" />{formatDateTime(b.dateStart)}</span>}
              />
              <Detail
                label="Waktu Kembali"
                value={<span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5 text-gray-400" />{formatDateTime(b.dateEnd)}</span>}
              />
            </div>
          </section>

          {/* Status-specific content */}
          {b.status === 'Menunggu Serah Terima' && (
            <StatusNote icon={<CameraIcon className="w-4 h-4" />} color="blue">
              Menunggu karyawan mengunggah foto kondisi kendaraan sebelum digunakan.
            </StatusNote>
          )}

          {b.status === 'Sedang Digunakan' && (
            <section className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Dokumentasi Kendaraan</p>
              <div className="grid grid-cols-2 gap-4">
                <PhotoDisplay label="Foto Sebelum Digunakan" src={photos.pre} />
                <div className="rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 py-8 text-gray-300">
                  <CameraIcon className="w-7 h-7" />
                  <span className="text-xs text-center px-2">Menunggu foto setelah kembali dari karyawan</span>
                </div>
              </div>
            </section>
          )}

          {b.status === 'Selesai' && (
            <section className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Dokumentasi Kendaraan</p>
              <div className="grid grid-cols-2 gap-4">
                <PhotoDisplay label="Foto Sebelum Digunakan" src={photos.pre} />
                <PhotoDisplay label="Foto Setelah Digunakan" src={photos.post} />
              </div>
            </section>
          )}

          {b.status === 'Ditolak' && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <XIcon className="w-4 h-4 flex-shrink-0" />
              Permohonan ini telah ditolak.
            </div>
          )}
        </div>

        {/* Modal footer — actions */}
        {b.status === 'Menunggu Konfirmasi' && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              onClick={onTolak}
              className="flex items-center gap-2 bg-white hover:bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <XIcon className="w-4 h-4" />
              Tolak
            </button>
            <button
              onClick={onSetujui}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <CheckIcon className="w-4 h-4" />
              Setujui Permohonan
            </button>
          </div>
        )}

        {b.status !== 'Menunggu Konfirmasi' && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end flex-shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Shared helpers ───────────────────────────────────────── */

function Detail({ label, value, span }) {
  return (
    <div className={span ? 'col-span-2' : ''}>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  )
}

function PhotoDisplay({ label, src }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="px-3 py-2 border-b border-gray-100">
        <p className="text-xs font-medium text-gray-500">{label}</p>
      </div>
      {src ? (
        <img src={src} alt={label} className="w-full max-h-48 object-cover" />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-300">
          <ImageIcon className="w-7 h-7" />
          <span className="text-xs">Foto tidak tersedia</span>
        </div>
      )}
    </div>
  )
}

function StatusNote({ icon, color, children }) {
  const styles = {
    blue:   'bg-blue-50 border-blue-200 text-blue-700',
    violet: 'bg-violet-50 border-violet-200 text-violet-700',
  }
  return (
    <div className={`flex items-start gap-2.5 border rounded-xl px-4 py-3 text-sm ${styles[color]}`}>
      <span className="flex-shrink-0 mt-0.5">{icon}</span>
      <span>{children}</span>
    </div>
  )
}
