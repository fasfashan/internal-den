import { useState } from 'react'
import useStore from '../hooks/useStore'
import StatusBadge from '../components/StatusBadge'

const SEED = [
  { id: 1, log_time: '2026-06-09T08:30:00', object_type: 'Kegiatan',     method: 'POST',   status: 'SUCCESS', username: 'rina', url: '/api/kegiatan' },
  { id: 2, log_time: '2026-06-09T08:31:00', object_type: 'Dokumentasi',  method: 'GET',    status: 'SUCCESS', username: 'budi', url: '/api/dokumentasi' },
  { id: 3, log_time: '2026-06-09T08:35:00', object_type: 'Pengguna',     method: 'DELETE', status: 'FAILED',  username: 'rina', url: '/api/users/3' },
  { id: 4, log_time: '2026-06-09T09:00:00', object_type: 'Persidangan',  method: 'PUT',    status: 'SUCCESS', username: 'rina', url: '/api/persidangan/1' },
]

function formatDateTime(dt) {
  if (!dt) return '-'
  return new Date(dt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const METHOD_COLORS = {
  GET:    'bg-blue-50 text-blue-700',
  POST:   'bg-green-50 text-green-700',
  PUT:    'bg-amber-50 text-amber-700',
  PATCH:  'bg-amber-50 text-amber-700',
  DELETE: 'bg-red-50 text-red-700',
}

export default function LogApiView() {
  const { data } = useStore('den_apilogs', SEED)
  const [search, setSearch] = useState('')

  const filtered = data.filter(l => {
    const q = search.trim().toLowerCase()
    return !q || l.object_type.toLowerCase().includes(q) || l.username.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)
  })

  const successCount = data.filter(l => l.status === 'SUCCESS').length
  const failedCount  = data.filter(l => l.status === 'FAILED').length

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Log"  count={data.length}    color="text-gray-700"  bg="bg-white" />
        <StatCard label="Sukses"     count={successCount}   color="text-green-600" bg="bg-green-50" />
        <StatCard label="Gagal"      count={failedCount}    color="text-red-600"   bg="bg-red-50" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Log API</h2>
              <p className="text-sm text-gray-500 mt-0.5">Riwayat aktivitas API sistem</p>
            </div>
            <div className="relative shrink-0">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" /></svg>
              <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari tipe / username / url..." className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl outline-none w-56 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-gray-400" />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">Tidak ada data</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <Th className="w-10 text-center">No</Th>
                  <Th className="w-44">Waktu</Th>
                  <Th className="w-32">Tipe Objek</Th>
                  <Th className="w-20">Method</Th>
                  <Th className="w-24">Status</Th>
                  <Th className="w-28">Username</Th>
                  <Th>URL</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-brand-50/40 transition-colors">
                    <Td className="text-center text-gray-400">{idx + 1}</Td>
                    <Td className="text-gray-500 text-xs">{formatDateTime(item.log_time)}</Td>
                    <Td className="text-gray-700 font-medium">{item.object_type}</Td>
                    <Td>
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded font-mono ${METHOD_COLORS[item.method] ?? 'bg-gray-100 text-gray-600'}`}>
                        {item.method}
                      </span>
                    </Td>
                    <Td><StatusBadge status={item.status} /></Td>
                    <Td className="text-gray-600 font-mono text-xs">{item.username}</Td>
                    <Td className="text-gray-500 font-mono text-xs">{item.url}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">
            Menampilkan {filtered.length} dari {data.length} log
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, count, color, bg }) {
  return (
    <div className={`${bg} rounded-2xl border border-gray-200 px-5 py-4`}>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{count}</p>
    </div>
  )
}

function Th({ children, className = '' }) {
  return <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide ${className}`}>{children}</th>
}

function Td({ children, className = '' }) {
  return <td className={`px-4 py-3.5 text-sm ${className}`}>{children}</td>
}
