import { useState } from 'react'
import useStore from '../hooks/useStore'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { PlusIcon, PencilIcon, EyeIcon, TrashIcon } from '../components/Icons'

const SEED = [
  {
    id: 1,
    activity_name: 'Rapat Koordinasi',
    activity_group: 'Rapat',
    activity_type: 'Internal',
    titles: [{ id: 1, activity_titel_name: 'Agenda Utama', activity_title_seq: 1, details: [] }],
  },
]

function emptyForm() {
  return { activity_name: '', activity_group: '', activity_type: '', titles: [] }
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

export default function MasterKegiatanView() {
  const { data, create, update, remove } = useStore('den_master_kegiatan', SEED)
  const [search, setSearch]         = useState('')
  const [formOpen, setFormOpen]     = useState(false)
  const [detailItem, setDetailItem] = useState(null)
  const [editing, setEditing]       = useState(null)
  const [form, setForm]             = useState(emptyForm)
  const [errors, setErrors]         = useState({})
  const [confirmId, setConfirmId]   = useState(null)

  const filtered = data.filter(k => {
    const q = search.trim().toLowerCase()
    return !q || k.activity_name.toLowerCase().includes(q) || (k.activity_group ?? '').toLowerCase().includes(q)
  })

  function openCreate() {
    setEditing(null)
    setForm(emptyForm())
    setErrors({})
    setFormOpen(true)
  }

  function openEdit(item) {
    setEditing(item.id)
    setForm({ ...item, titles: (item.titles ?? []).map(t => ({ ...t, details: [...(t.details ?? [])] })) })
    setErrors({})
    setFormOpen(true)
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

  function addTitle() {
    const seq = (form.titles ?? []).length + 1
    setForm(f => ({ ...f, titles: [...(f.titles ?? []), { id: Date.now() + Math.random(), activity_titel_name: '', activity_title_seq: seq, details: [] }] }))
  }
  function updateTitle(tid, val) {
    setForm(f => ({ ...f, titles: f.titles.map(t => t.id === tid ? { ...t, activity_titel_name: val } : t) }))
  }
  function removeTitle(tid) {
    setForm(f => ({ ...f, titles: f.titles.filter(t => t.id !== tid) }))
  }
  function addDetail(tid) {
    setForm(f => ({
      ...f,
      titles: f.titles.map(t => {
        if (t.id !== tid) return t
        const seq = (t.details ?? []).length + 1
        return { ...t, details: [...(t.details ?? []), { id: Date.now() + Math.random(), activity_detail_name: '', activity_detail_seq: seq, activity_detail_result: '' }] }
      }),
    }))
  }
  function updateDetail(tid, did, key, val) {
    setForm(f => ({
      ...f,
      titles: f.titles.map(t => t.id !== tid ? t : {
        ...t, details: t.details.map(d => d.id === did ? { ...d, [key]: val } : d),
      }),
    }))
  }
  function removeDetail(tid, did) {
    setForm(f => ({
      ...f,
      titles: f.titles.map(t => t.id !== tid ? t : { ...t, details: t.details.filter(d => d.id !== did) }),
    }))
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Master Kegiatan" count={data.length} color="text-gray-700" bg="bg-white" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Master Kegiatan</h2>
              <p className="text-sm text-gray-500 mt-0.5">Template kegiatan yang dapat digunakan kembali</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" /></svg>
                <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama / grup..." className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl outline-none w-48 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-gray-400" />
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
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <Th className="w-10 text-center">No</Th>
                  <Th>Nama Kegiatan</Th>
                  <Th className="w-32">Grup</Th>
                  <Th className="w-32">Tipe</Th>
                  <Th className="w-36 text-center">Aksi</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-brand-50/40 transition-colors cursor-pointer" onClick={() => setDetailItem(item)}>
                    <Td className="text-center text-gray-400">{idx + 1}</Td>
                    <Td><span className="font-medium text-gray-900">{item.activity_name}</span></Td>
                    <Td className="text-gray-500">{item.activity_group}</Td>
                    <Td className="text-gray-500">{item.activity_type}</Td>
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
            Menampilkan {filtered.length} dari {data.length} master kegiatan
          </div>
        )}
      </div>

      {/* Form modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing != null ? 'Edit Master Kegiatan' : 'Tambah Master Kegiatan'} maxWidth="max-w-3xl"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setFormOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer">Batal</button>
            <button onClick={handleSave} className="px-5 py-2 text-sm font-medium text-white bg-brand-400 hover:bg-brand-500 rounded-xl cursor-pointer">Simpan</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nama Kegiatan" required>
              <input className={INPUT_CLS} value={form.activity_name} onChange={e => setForm(f => ({ ...f, activity_name: e.target.value }))} />
              {errors.activity_name && <p className="text-xs text-red-500 mt-1">{errors.activity_name}</p>}
            </Field>
            <Field label="Grup">
              <input className={INPUT_CLS} value={form.activity_group ?? ''} onChange={e => setForm(f => ({ ...f, activity_group: e.target.value }))} />
            </Field>
            <Field label="Tipe">
              <input className={INPUT_CLS} value={form.activity_type ?? ''} onChange={e => setForm(f => ({ ...f, activity_type: e.target.value }))} />
            </Field>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Agenda</p>
              <button onClick={addTitle} className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 cursor-pointer"><PlusIcon className="w-3.5 h-3.5" />Tambah Agenda</button>
            </div>
            {(form.titles ?? []).length === 0 ? (
              <p className="px-4 py-4 text-xs text-gray-400">Belum ada agenda</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {(form.titles ?? []).map((title, ti) => (
                  <div key={title.id} className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-400 shrink-0">#{ti + 1}</span>
                      <input className={INPUT_CLS + ' flex-1'} placeholder="Nama agenda..." value={title.activity_titel_name} onChange={e => updateTitle(title.id, e.target.value)} />
                      <button onClick={() => removeTitle(title.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                    <div className="ml-6 space-y-2">
                      {(title.details ?? []).map((detail, di) => (
                        <div key={detail.id} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                          <span className="text-xs text-gray-400 shrink-0">{di + 1}.</span>
                          <input className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400" placeholder="Nama detail..." value={detail.activity_detail_name} onChange={e => updateDetail(title.id, detail.id, 'activity_detail_name', e.target.value)} />
                          <input className="w-32 text-sm bg-transparent outline-none text-gray-600 placeholder:text-gray-400" placeholder="Hasil..." value={detail.activity_detail_result} onChange={e => updateDetail(title.id, detail.id, 'activity_detail_result', e.target.value)} />
                          <button onClick={() => removeDetail(title.id, detail.id)} className="p-1 text-red-400 hover:text-red-600 cursor-pointer"><TrashIcon className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                      <button onClick={() => addDetail(title.id)} className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600 cursor-pointer"><PlusIcon className="w-3 h-3" />Tambah Detail</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Detail modal */}
      {detailItem && (
        <Modal open={!!detailItem} onClose={() => setDetailItem(null)} title="Detail Master Kegiatan" maxWidth="max-w-3xl"
          footer={<div className="flex justify-end"><button onClick={() => setDetailItem(null)} className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer">Tutup</button></div>}
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <DetailRow label="Nama Kegiatan" value={detailItem.activity_name} span />
              <DetailRow label="Grup" value={detailItem.activity_group} />
              <DetailRow label="Tipe" value={detailItem.activity_type} />
            </div>
            {(detailItem.titles ?? []).length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Agenda</p>
                <div className="space-y-3">
                  {detailItem.titles.map((t, ti) => (
                    <div key={t.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">{ti + 1}. {t.activity_titel_name}</p>
                      </div>
                      {(t.details ?? []).length > 0 && (
                        <div className="divide-y divide-gray-100">
                          {t.details.map((d, di) => (
                            <div key={d.id} className="px-4 py-2.5 flex justify-between text-sm">
                              <span className="text-gray-700">{di + 1}. {d.activity_detail_name}</span>
                              <span className="text-gray-400">{d.activity_detail_result}</span>
                            </div>
                          ))}
                        </div>
                      )}
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
        title="Hapus Master Kegiatan"
        message="Apakah Anda yakin ingin menghapus master kegiatan ini? Tindakan ini tidak dapat dibatalkan."
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
