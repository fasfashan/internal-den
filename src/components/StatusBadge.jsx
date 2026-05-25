const STATUS_CONFIG = {
  'Menunggu Konfirmasi': {
    ring: 'bg-amber-50 text-amber-700 ring-amber-200',
    dot:  'bg-amber-400',
  },
  'Menunggu Serah Terima': {
    ring: 'bg-blue-50 text-blue-700 ring-blue-200',
    dot:  'bg-blue-500',
  },
  'Sedang Digunakan': {
    ring: 'bg-violet-50 text-violet-700 ring-violet-200',
    dot:  'bg-violet-500',
  },
  'Selesai': {
    ring: 'bg-green-50 text-green-700 ring-green-200',
    dot:  'bg-green-500',
  },
  'Ditolak': {
    ring: 'bg-red-50 text-red-600 ring-red-200',
    dot:  'bg-red-500',
  },
}

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? {
    ring: 'bg-gray-50 text-gray-600 ring-gray-200',
    dot: 'bg-gray-400',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 whitespace-nowrap ${cfg.ring}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {status}
    </span>
  )
}
