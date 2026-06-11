import { useState } from 'react'
import { TruckIcon, PlusIcon, PencilIcon, TrashIcon, CheckIcon, XIcon } from '../components/Icons'
import StatusBadge from '../components/StatusBadge'

const LOCKED_STATUSES = [
  'Menunggu Konfirmasi',
  'Menunggu Persetujuan Kepala Bagian',
  'Menunggu Serah Terima',
  'Menunggu Verifikasi Keberangkatan',
  'Sedang Digunakan',
  'Menunggu Verifikasi Pengembalian',
  'Menunggu Persetujuan Akhir Kepala Bagian',
]

const EMPTY_FORM = { name: '', plateNumber: '' }

export default function KendaraanView({ vehicles, bookings, onAdd, onRemove, onUpdate }) {
  const [showForm, setShowForm]     = useState(false)
  const [editId,   setEditId]       = useState(null)
  const [form,     setForm]         = useState(EMPTY_FORM)
  const [errors,   setErrors]       = useState({})
  const [confirmId, setConfirmId]   = useState(null)

  /* active booking plates */
  const lockedPlates = new Set(
    bookings
      .filter(b => LOCKED_STATUSES.includes(b.status))
      .flatMap(b => {
        if (b.vehicles?.length) return b.vehicles.map(v => v.plateNumber)
        if (b.plateNumber) return [b.plateNumber]
        return []
      })
  )

  function getActiveBooking(plateNumber) {
    return bookings.find(b =>
      LOCKED_STATUSES.includes(b.status) &&
      (b.vehicles?.some(v => v.plateNumber === plateNumber) || b.plateNumber === plateNumber)
    ) ?? null
  }

  function validate() {
    const e = {}
    if (!form.name.trim())        e.name        = 'Nama kendaraan wajib diisi'
    if (!form.plateNumber.trim()) e.plateNumber = 'Nomor polisi wajib diisi'
    const exists = vehicles.some(v =>
      v.plateNumber.toLowerCase() === form.plateNumber.trim().toLowerCase() && v.id !== editId
    )
    if (exists) e.plateNumber = 'Nomor polisi sudah terdaftar'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    if (editId != null) {
      onUpdate(editId, { name: form.name.trim(), plateNumber: form.plateNumber.trim() })
    } else {
      onAdd({ name: form.name.trim(), plateNumber: form.plateNumber.trim() })
    }
    resetForm()
  }

  function startEdit(v) {
    setEditId(v.id)
    setForm({ name: v.name, plateNumber: v.plateNumber })
    setErrors({})
    setShowForm(true)
  }

  function resetForm() {
    setShowForm(false)
    setEditId(null)
    setForm(EMPTY_FORM)
    setErrors({})
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Armada Kendaraan</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola daftar kendaraan dinas yang tersedia untuk dipinjam</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); setErrors({}) }}
            className="flex items-center gap-2 bg-brand-400 hover:bg-brand-500 active:bg-brand-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <PlusIcon className="w-4 h-4" />
            Tambah Kendaraan
          </button>
        )}
      </div>

      {/* Add / edit form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">
            {editId != null ? 'Edit Kendaraan' : 'Tambah Kendaraan Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Kendaraan</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="cth. Toyota Veloz"
                className={inputClass(errors.name)} />
              {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor Polisi</label>
              <input name="plateNumber" value={form.plateNumber} onChange={handleChange}
                placeholder="cth. B 1234 DEN"
                className={inputClass(errors.plateNumber)} />
              {errors.plateNumber && <p className="mt-1.5 text-xs text-red-500">{errors.plateNumber}</p>}
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <button type="submit"
                className="flex items-center gap-2 bg-brand-400 hover:bg-brand-500 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors cursor-pointer">
                <CheckIcon className="w-4 h-4" />
                {editId != null ? 'Simpan Perubahan' : 'Tambahkan'}
              </button>
              <button type="button" onClick={resetForm}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-xl transition-colors cursor-pointer">
                <XIcon className="w-4 h-4" />
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicle grid */}
      {vehicles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-3 py-16 text-gray-300">
          <TruckIcon className="w-12 h-12" />
          <p className="text-sm">Belum ada kendaraan terdaftar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map(v => {
            const locked      = lockedPlates.has(v.plateNumber)
            const active      = locked ? getActiveBooking(v.plateNumber) : null
            const isConfirm   = confirmId === v.id

            return (
              <div key={v.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${locked ? 'border-orange-200' : 'border-gray-200'}`}>
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${locked ? 'bg-orange-100' : 'bg-brand-100'}`}>
                        <TruckIcon className={`w-4 h-4 ${locked ? 'text-orange-500' : 'text-brand-500'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{v.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{v.plateNumber}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                      locked
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {locked ? 'Sedang Digunakan' : 'Tersedia'}
                    </span>
                  </div>

                  {active && (
                    <div className="mt-3 rounded-lg bg-orange-50 border border-orange-100 px-3 py-2 text-xs space-y-0.5">
                      <p className="text-orange-700 font-medium">{active.name}</p>
                      <p className="text-orange-500">ke {active.destination}</p>
                      <div className="pt-0.5">
                        <StatusBadge status={active.status} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {!isConfirm ? (
                  <div className="flex items-center gap-0 border-t border-gray-100 divide-x divide-gray-100">
                    <button onClick={() => startEdit(v)} disabled={locked}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                        locked ? 'text-gray-300 cursor-not-allowed' : 'text-brand-600 hover:bg-brand-50 cursor-pointer'
                      }`}>
                      <PencilIcon className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button onClick={() => setConfirmId(v.id)} disabled={locked}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                        locked ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50 cursor-pointer'
                      }`}>
                      <TrashIcon className="w-3.5 h-3.5" />
                      Hapus
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-red-100 bg-red-50 px-4 py-3 flex items-center justify-between gap-3">
                    <p className="text-xs text-red-600">Yakin hapus kendaraan ini?</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setConfirmId(null)}
                        className="text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        Batal
                      </button>
                      <button onClick={() => { onRemove(v.id); setConfirmId(null) }}
                        className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                        Hapus
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Summary */}
      {vehicles.length > 0 && (
        <div className="mt-5 flex items-center gap-5 text-xs text-gray-400">
          <span>{vehicles.length} kendaraan terdaftar</span>
          <span>{vehicles.filter(v => !lockedPlates.has(v.plateNumber)).length} tersedia</span>
          <span>{vehicles.filter(v => lockedPlates.has(v.plateNumber)).length} sedang digunakan</span>
        </div>
      )}
    </div>
  )
}

function inputClass(hasError) {
  return [
    'w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 bg-white',
    hasError
      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-gray-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100',
  ].join(' ')
}
