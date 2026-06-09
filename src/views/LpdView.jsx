import { useState } from 'react'
import useStore from '../hooks/useStore'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { PlusIcon, PencilIcon, EyeIcon, TrashIcon, AttachmentIcon } from '../components/Icons'

const SEED = [
  {
    id: 1,
    activity_id: 1,
    activity_name: 'Rapat Koordinasi Ekonomi',
    activity_date: '2026-05-26',
    activity_date_end: '2026-05-26',
    pic_kegiatan: 'Ardian Nugraha',
    pic_dokumentasi: 'Verdy',
    pic_persidangan: 'Hendra',
    pic_penjabat: '',
    pic_perangkat: '',
    tautan_link: '',
    details: [{ id: 1, file_name: 'lpd_rapat.pdf', file_type: 'pdf', file_size: '1.8 MB', remarks: 'Laporan final' }],
  },
]

function emptyForm() {
  return {
    activity_id: '', activity_name: '', activity_date: '', activity_date_end: '',
    pic_kegiatan: '', pic_dokumentasi: '', pic_persidangan: '', pic_penjabat: '', pic_perangkat: '', tautan_link: '',
    details: [],
  }
}

function readLS(key) {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]') } catch { return [] }
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatDate(d) {
  if (!d) return '-'
  return new Date(d + 'T00:00:00').toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const INPUT_CLS = 'w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 outline-none border-gray-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all'

export default function LpdView() {
  const { data, create, update, remove } = useStore('den_lpd', SEED)
  const [search, setSearch]         = useState('')
  const [formOpen, setFormOpen]     = useState(false)
  const [detailItem, setDetailItem] = useState(null)
  const [editing, setEditing]       = useState(null)
  const [form, setForm]             = useState(emptyForm)
  const [errors, setErrors]         = useState({})
  const [confirmId, setConfirmId]   = useState(null)

  const kegiatan = readLS('den_kegiatan')

  const filtered = data.filter(d => {
    const q = search.trim().toLowerCase()
    return !q || d.activity_name.toLowerCase().includes(q) || (d.pic_kegiatan ?? '').toLowerCase().includes(q)
  })

  function openCreate() {
    setEditing(null); setForm(emptyForm()); setErrors({}); setFormOpen(true)
  }

  function openEdit(item) {
    setEditing(item.id)
    setForm({ ...item, details: [...(item.details ?? [])] })
    setErrors({}); setFormOpen(true)
  }

  function validate() {
    const e = {}
    if (!form.activity_name.trim()) e.activity_name = 'Wajib diisi'
    return e
  }

  function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    editing != null ? update(editing, { ...form }) : create({ ...form })
    setFormOpen(false)
  }

  function pickKegiatan(id) {
    const k = kegiatan.find(k => String(k.id) === String(id))
    if (k) setForm(f => ({ ...f, activity_id: k.id, activity_name: k.activity_name, activity_date: k.activity_date ?? '', pic_persidangan: k.pic_persidangan ?? f.pic_persidangan, pic_dokumentasi: k.pic_dokumentasi ?? f.pic_dokumentasi }))
    else setForm(f => ({ ...f, activity_id: '', activity_name: '', activity_date: '' }))
  }

  function handleFileInput(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setForm(f => ({ ...f, details: [...(f.details ?? []), { id: Date.now() + Math.random(), file_name: file.name, file_type: file.type || file.name.split('.').pop(), file_size: formatFileSize(file.size), remarks: '' }] }))
    e.target.value = ''
  }

  function updateFileDetail(id, key, val) {
    setForm(f => ({ ...f, details: f.details.map(d => d.id === id ? { ...d, [key]: val } : d) }))
  }

  function removeFileDetail(id) {
    setForm(f => ({ ...f, details: f.details.filter(d => d.id !== id) }))
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total LPD" count={data.length} color="text-gray-700" bg="bg-white" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">LPD (Laporan Pelaksanaan Dinas)</h2>
              <p className="text-sm text-gray-500 mt-0.5">Kelola laporan pelaksanaan dinas kegiatan</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" /></svg>
                <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari kegiatan / PIC..." className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl outline-none w-48 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-gray-400" />
              </div>
              <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-brand-400 hover:bg-brand-500 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer">
                <PlusIcon className="w-4 h-4" /> Tambah
              </button>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">Tidak ada data</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <Th className="w-10 text-center">No</Th>
                  <Th>Kegiatan</Th>
                  <Th className="w-32">Tanggal</Th>
                  <Th className="w-36">PIC Kegiatan</Th>
                  <Th className="w-36 text-center">Aksi</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-brand-50/40 transition-colors cursor-pointer" onClick={() => setDetailItem(item)}>
                    <Td className="text-center text-gray-400">{idx + 1}</Td>
                    <Td><span className="font-medium text-gray-900">{item.activity_name}</span></Td>
                    <Td className="text-gray-500">{formatDate(item.activity_date)}</Td>
                    <Td className="text-gray-600">{item.pic_kegiatan}</Td>
                    <Td className="text-center">
                      <div className="flex items-center justify-center gap-1.5" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setDetailItem(item)} className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-600 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1"><EyeIcon className="w-3.5 h-3.5" />Detail</button>
                        <button onClick={() => openEdit(item)} className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-blue-200 text-blue-600 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1"><PencilIcon className="w-3.5 h-3.5" />Edit</button>
                        <button onClick={() => setConfirmId(item.id)} className="px-3 py-1.5 bg-white hover:bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1"><TrashIcon className="w-3.5 h-3.5" />Hapus</button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">
            Menampilkan {filtered.length} dari {data.length} LPD
          </div>
        )}
      </div>

      {/* Form modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing != null ? 'Edit LPD' : 'Tambah LPD'} maxWidth="max-w-2xl"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setFormOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer">Batal</button>
            <button onClick={handleSave} className="px-5 py-2 text-sm font-medium text-white bg-brand-400 hover:bg-brand-500 rounded-xl cursor-pointer">Simpan</button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Pilih Kegiatan">
            <select className={INPUT_CLS} value={form.activity_id ?? ''} onChange={e => pickKegiatan(e.target.value)}>
              <option value="">-- Pilih dari daftar kegiatan --</option>
              {kegiatan.map(k => <option key={k.id} value={k.id}>{k.activity_name}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nama Kegiatan" required>
              <input className={INPUT_CLS} value={form.activity_name} onChange={e => setForm(f => ({ ...f, activity_name: e.target.value }))} />
              {errors.activity_name && <p className="text-xs text-red-500 mt-1">{errors.activity_name}</p>}
            </Field>
            <Field label="Tanggal Mulai">
              <input type="date" className={INPUT_CLS} value={form.activity_date ?? ''} onChange={e => setForm(f => ({ ...f, activity_date: e.target.value }))} />
            </Field>
            <Field label="Tanggal Selesai">
              <input type="date" className={INPUT_CLS} value={form.activity_date_end ?? ''} onChange={e => setForm(f => ({ ...f, activity_date_end: e.target.value }))} />
            </Field>
            <Field label="PIC Kegiatan">
              <input className={INPUT_CLS} value={form.pic_kegiatan ?? ''} onChange={e => setForm(f => ({ ...f, pic_kegiatan: e.target.value }))} />
            </Field>
            <Field label="PIC Dokumentasi">
              <input className={INPUT_CLS} value={form.pic_dokumentasi ?? ''} onChange={e => setForm(f => ({ ...f, pic_dokumentasi: e.target.value }))} />
            </Field>
            <Field label="PIC Persidangan">
              <input className={INPUT_CLS} value={form.pic_persidangan ?? ''} onChange={e => setForm(f => ({ ...f, pic_persidangan: e.target.value }))} />
            </Field>
            <Field label="PIC Penjabat">
              <input className={INPUT_CLS} value={form.pic_penjabat ?? ''} onChange={e => setForm(f => ({ ...f, pic_penjabat: e.target.value }))} />
            </Field>
            <Field label="PIC Perangkat">
              <input className={INPUT_CLS} value={form.pic_perangkat ?? ''} onChange={e => setForm(f => ({ ...f, pic_perangkat: e.target.value }))} />
            </Field>
            <Field label="Tautan Link">
              <input type="url" className={INPUT_CLS} value={form.tautan_link ?? ''} onChange={e => setForm(f => ({ ...f, tautan_link: e.target.value }))} placeholder="https://..." />
            </Field>
          </div>

          {/* File repeater */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Lampiran File</p>
              <label className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 cursor-pointer">
                <PlusIcon className="w-3.5 h-3.5" />Tambah File
                <input type="file" className="hidden" onChange={handleFileInput} />
              </label>
            </div>
            {(form.details ?? []).length === 0 ? (
              <p className="px-4 py-4 text-xs text-gray-400">Belum ada file</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {(form.details ?? []).map(file => (
                  <div key={file.id} className="p-3 bg-gray-50 flex items-start gap-3">
                    <AttachmentIcon className="w-4 h-4 text-gray-400 mt-2 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800 truncate">{file.file_name}</span>
                        <span className="text-xs text-gray-400">{file.file_size}</span>
                        <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{file.file_type}</span>
                      </div>
                      <input className="w-full text-xs px-2 py-1.5 rounded-lg border border-gray-200 outline-none focus:border-brand-400 placeholder:text-gray-400" placeholder="Keterangan..." value={file.remarks} onChange={e => updateFileDetail(file.id, 'remarks', e.target.value)} />
                    </div>
                    <button onClick={() => removeFileDetail(file.id)} className="p-1 text-red-400 hover:text-red-600 cursor-pointer shrink-0"><TrashIcon className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Detail modal */}
      {detailItem && (
        <Modal open={!!detailItem} onClose={() => setDetailItem(null)} title="Detail LPD" maxWidth="max-w-2xl"
          footer={<div className="flex justify-end"><button onClick={() => setDetailItem(null)} className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer">Tutup</button></div>}
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <DetailRow label="Kegiatan" value={detailItem.activity_name} span />
              <DetailRow label="Tanggal Mulai" value={formatDate(detailItem.activity_date)} />
              <DetailRow label="Tanggal Selesai" value={formatDate(detailItem.activity_date_end)} />
              <DetailRow label="PIC Kegiatan" value={detailItem.pic_kegiatan} />
              <DetailRow label="PIC Dokumentasi" value={detailItem.pic_dokumentasi} />
              <DetailRow label="PIC Persidangan" value={detailItem.pic_persidangan} />
              <DetailRow label="PIC Penjabat" value={detailItem.pic_penjabat} />
              <DetailRow label="PIC Perangkat" value={detailItem.pic_perangkat} />
              {detailItem.tautan_link && <DetailRow label="Tautan Link" value={<a href={detailItem.tautan_link} target="_blank" rel="noreferrer" className="text-brand-500 hover:underline">{detailItem.tautan_link}</a>} span />}
            </div>
            {(detailItem.details ?? []).length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Lampiran</p>
                <div className="space-y-2">
                  {detailItem.details.map(f => (
                    <div key={f.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                      <AttachmentIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-sm font-medium text-gray-800 flex-1">{f.file_name}</span>
                      <span className="text-xs text-gray-400">{f.file_size}</span>
                      <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{f.file_type}</span>
                      {f.remarks && <span className="text-xs text-gray-500">— {f.remarks}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      <ConfirmDialog
        open={confirmId != null}
        onClose={() => setConfirmId(null)}
        onConfirm={() => remove(confirmId)}
        title="Hapus LPD"
        message="Apakah Anda yakin ingin menghapus data LPD ini?"
      />
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

function DetailRow({ label, value, span }) {
  return (
    <div className={span ? 'col-span-2' : ''}>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-gray-800">{value ?? '-'}</p>
    </div>
  )
}
