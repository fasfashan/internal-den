import { useState, useRef } from 'react'
import StatusBadge from './StatusBadge'
import { ClockIcon, MapPinIcon, CameraIcon, CheckIcon, XIcon, ImageIcon } from './Icons'

const UNIT_KERJA = [
  'Sekretariat Jenderal',
  'Bidang Kajian Ekonomi Makro',
  'Bidang Kebijakan Fiskal',
  'Bidang Perdagangan dan Investasi',
  'Bidang Ketahanan Pangan',
  'Bidang Infrastruktur dan Energi',
  'Bidang Sumber Daya Manusia',
  'Bidang Hukum dan Tata Kelola',
  'Inspektorat',
]

const EMPTY_FORM = {
  name: '',
  division: '',
  destination: '',
  dateStart: '',
  dateEnd: '',
  purpose: '',
}

const NEEDS_ACTION = ['Menunggu Serah Terima', 'Sedang Digunakan']

function formatDateTime(dt) {
  if (!dt) return '-'
  const d = new Date(dt)
  return d.toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function EmployeeView({ onSubmit, bookings, onUploadPrePhoto, onUploadPostPhoto }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [expanded, setExpanded] = useState(null)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Nama wajib diisi'
    if (!form.division) e.division = 'Unit kerja wajib dipilih'
    if (!form.destination.trim()) e.destination = 'Tujuan wajib diisi'
    if (!form.dateStart) e.dateStart = 'Waktu berangkat wajib diisi'
    if (!form.dateEnd) e.dateEnd = 'Waktu kembali wajib diisi'
    if (form.dateStart && form.dateEnd && form.dateEnd <= form.dateStart)
      e.dateEnd = 'Waktu kembali harus setelah waktu berangkat'
    if (!form.purpose.trim()) e.purpose = 'Keperluan wajib diisi'
    return e
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    onSubmit(form)
    setForm(EMPTY_FORM)
    setErrors({})
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  function toggleExpanded(id) {
    setExpanded(prev => prev === id ? null : id)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Form */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Permohonan Peminjaman Kendaraan</h2>
            <p className="text-sm text-gray-500 mt-0.5">Lengkapi detail perjalanan dinas Anda</p>
          </div>

          {submitted && (
            <div className="mx-6 mt-5 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Permohonan berhasil diajukan. Menunggu persetujuan admin.
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Nama Lengkap" error={errors.name}>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="cth. Budi Santoso"
                  className={inputClass(errors.name)}
                />
              </Field>

              <Field label="Unit Kerja" error={errors.division}>
                <select
                  name="division"
                  value={form.division}
                  onChange={handleChange}
                  className={inputClass(errors.division)}
                >
                  <option value="">Pilih unit kerja</option>
                  {UNIT_KERJA.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Tujuan Perjalanan" error={errors.destination}>
              <input
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="cth. Kementerian Keuangan RI, Jakarta Pusat"
                className={inputClass(errors.destination)}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Waktu Berangkat" error={errors.dateStart}>
                <input type="datetime-local" name="dateStart" value={form.dateStart} onChange={handleChange} className={inputClass(errors.dateStart)} />
              </Field>
              <Field label="Waktu Kembali" error={errors.dateEnd}>
                <input type="datetime-local" name="dateEnd" value={form.dateEnd} onChange={handleChange} className={inputClass(errors.dateEnd)} />
              </Field>
            </div>

            <Field label="Keperluan / Tujuan Dinas" error={errors.purpose}>
              <textarea
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                rows={3}
                placeholder="Jelaskan keperluan dan tujuan perjalanan dinas..."
                className={`${inputClass(errors.purpose)} resize-none`}
              />
            </Field>

            <div className="pt-1">
              <button type="submit" className="w-full bg-brand-400 hover:bg-brand-500 active:bg-brand-600 text-white font-medium py-2.5 px-4 rounded-xl transition-colors cursor-pointer">
                Ajukan Permohonan
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Riwayat */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Riwayat Permohonan</h2>
            <p className="text-sm text-gray-500 mt-0.5">Pantau status permohonan Anda</p>
          </div>

          {bookings.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">Belum ada permohonan</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {bookings.map(b => {
                const isExpanded = expanded === b.id
                const needsAction = NEEDS_ACTION.includes(b.status)
                const bookingPhotos = b.photos ?? {}

                return (
                  <li key={b.id}>
                    {/* Summary row */}
                    <button
                      onClick={() => toggleExpanded(b.id)}
                      className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <MapPinIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900 truncate">{b.destination}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {needsAction && (
                            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse flex-shrink-0" title="Perlu tindakan" />
                          )}
                          <StatusBadge status={b.status} />
                          <svg
                            className={`w-3.5 h-3.5 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                          >
                            <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <ClockIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{formatDateTime(b.dateStart)}</span>
                        <span className="text-gray-300">–</span>
                        <span>{formatDateTime(b.dateEnd)}</span>
                      </div>
                    </button>

                    {/* Expanded section */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50 px-6 pb-5 pt-4 space-y-4">
                        {/* Trip detail */}
                        <div className="text-xs text-gray-500 space-y-1">
                          <p><span className="font-medium text-gray-600">Keperluan:</span> {b.purpose}</p>
                        </div>

                        {b.status === 'Menunggu Serah Terima' && (
                          <PhotoUploadSection
                            title="Foto Kondisi Kendaraan Sebelum Digunakan"
                            description="Unggah 4 foto kendaraan dari berbagai sisi sebelum perjalanan dimulai"
                            confirmLabel="Konfirmasi Serah Terima & Mulai Perjalanan"
                            existingPhotos={bookingPhotos.pre}
                            onConfirm={photos => onUploadPrePhoto(b.id, photos)}
                          />
                        )}

                        {b.status === 'Sedang Digunakan' && (
                          <div className="space-y-4">
                            <PhotoDisplay label="Foto Sebelum Digunakan" src={bookingPhotos.pre} />
                            <PhotoUploadSection
                              title="Foto Kondisi Kendaraan Setelah Digunakan"
                              description="Unggah 4 foto kendaraan dari berbagai sisi setelah perjalanan selesai"
                              confirmLabel="Tandai Perjalanan Selesai"
                              existingPhotos={bookingPhotos.post}
                              onConfirm={photos => onUploadPostPhoto(b.id, photos)}
                            />
                          </div>
                        )}

                        {b.status === 'Selesai' && (
                          <div className="space-y-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Dokumentasi Kendaraan</p>
                            <PhotoDisplay label="Foto Sebelum Digunakan" src={bookingPhotos.pre} />
                            <PhotoDisplay label="Foto Setelah Digunakan" src={bookingPhotos.post} />
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function PhotoUploadSection({ title, description, confirmLabel, existingPhotos, onConfirm }) {
  const SLOT_COUNT = 4
  const [previews, setPreviews] = useState(() =>
    Array.isArray(existingPhotos) ? [...existingPhotos] : Array(SLOT_COUNT).fill(null)
  )
  const [confirmed, setConfirmed] = useState(false)

  const inputRef0 = useRef(null)
  const inputRef1 = useRef(null)
  const inputRef2 = useRef(null)
  const inputRef3 = useRef(null)
  const inputRefs = [inputRef0, inputRef1, inputRef2, inputRef3]

  const filledCount = previews.filter(Boolean).length
  const allFilled = filledCount === SLOT_COUNT

  function handleFile(index, e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      setPreviews(prev => {
        const next = [...prev]
        next[index] = evt.target.result
        return next
      })
    }
    reader.readAsDataURL(file)
  }

  function handleRemove(index) {
    setPreviews(prev => {
      const next = [...prev]
      next[index] = null
      return next
    })
    if (inputRefs[index].current) inputRefs[index].current.value = ''
  }

  function handleConfirm() {
    if (!allFilled) return
    setConfirmed(true)
    onConfirm(previews)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      <p className="text-xs font-semibold text-gray-800 mb-0.5">{title}</p>
      <p className="text-xs text-gray-400 mb-3">{description}</p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {previews.map((preview, i) => (
          <div key={i}>
            {preview ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img src={preview} alt={`Foto ${i + 1}`} className="w-full h-28 object-cover" />
                {!confirmed && (
                  <button
                    onClick={() => handleRemove(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                )}
                <span className="absolute bottom-1 left-1 text-[10px] font-medium bg-black/40 text-white px-1.5 py-0.5 rounded">
                  Foto {i + 1}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputRefs[i].current?.click()}
                className="w-full h-28 rounded-lg border-2 border-dashed border-gray-200 hover:border-brand-400 hover:bg-brand-50 active:bg-brand-100 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-brand-500 transition-colors cursor-pointer"
              >
                <CameraIcon className="w-6 h-6" />
                <span className="text-[10px] font-semibold text-gray-400">Foto {i + 1}</span>
              </button>
            )}
            <input ref={inputRefs[i]} type="file" accept="image/*" className="hidden" onChange={e => handleFile(i, e)} />
          </div>
        ))}
      </div>

      {!confirmed && (
        <button
          onClick={handleConfirm}
          disabled={!allFilled}
          className={`w-full flex items-center justify-center gap-2 text-xs font-medium py-2.5 rounded-lg transition-colors ${
            allFilled
              ? 'bg-brand-400 hover:bg-brand-500 active:bg-brand-600 text-white cursor-pointer'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <CheckIcon className="w-3.5 h-3.5" />
          {allFilled ? confirmLabel : `Unggah ${SLOT_COUNT - filledCount} foto lagi`}
        </button>
      )}
    </div>
  )
}

function PhotoDisplay({ label, src }) {
  const photos = Array.isArray(src) ? src.filter(Boolean) : []
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="px-3 py-2 border-b border-gray-100">
        <p className="text-xs font-medium text-gray-500">{label}</p>
      </div>
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 gap-1 p-1">
          {photos.map((photo, i) => (
            <div key={i} className="relative rounded overflow-hidden">
              <img src={photo} alt={`${label} ${i + 1}`} className="w-full h-20 object-cover" />
              <span className="absolute bottom-1 left-1 text-[10px] font-medium bg-black/40 text-white px-1.5 py-0.5 rounded">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-1.5 py-6 text-gray-300">
          <ImageIcon className="w-6 h-6" />
          <span className="text-xs">Foto tidak tersedia di sesi ini</span>
        </div>
      )}
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}

function inputClass(hasError) {
  return [
    'w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 outline-none transition-all',
    'placeholder:text-gray-400 bg-white',
    hasError
      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-gray-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100',
  ].join(' ')
}
