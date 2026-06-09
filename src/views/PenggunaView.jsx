import { useState } from 'react'
import useStore from '../hooks/useStore'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import StatusBadge from '../components/StatusBadge'
import { PlusIcon, PencilIcon, TrashIcon } from '../components/Icons'

const SEED = [
  { id: 1, name: 'Rina Kusuma',   username: 'rina', email: 'rina.kusuma@den.go.id',   permission: 'admin' },
  { id: 2, name: 'Budi Santoso',  username: 'budi', email: 'budi.santoso@den.go.id',  permission: 'user' },
]

function emptyForm() {
  return { name: '', username: '', email: '', password: '', permission: 'user' }
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

export default function PenggunaView() {
  const { data, create, update, remove } = useStore('den_users', SEED)
  const [search, setSearch]         = useState('')
  const [formOpen, setFormOpen]     = useState(false)
  const [editing, setEditing]       = useState(null)
  const [form, setForm]             = useState(emptyForm)
  const [errors, setErrors]         = useState({})
  const [confirmId, setConfirmId]   = useState(null)

  const filtered = data.filter(u => {
    const q = search.trim().toLowerCase()
    return !q || u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })

  const adminCount = data.filter(u => u.permission === 'admin').length
  const userCount  = data.filter(u => u.permission === 'user').length

  function openCreate() {
    setEditing(null); setForm(emptyForm()); setErrors({}); setFormOpen(true)
  }

  function openEdit(item) {
    setEditing(item.id)
    setForm({ name: item.name, username: item.username, email: item.email, password: '', permission: item.permission })
    setErrors({}); setFormOpen(true)
  }

  function validate() {
    const e = {}
    if (!form.name.trim())     e.name     = 'Wajib diisi'
    if (!form.username.trim()) e.username = 'Wajib diisi'
    if (!form.email.trim())    e.email    = 'Wajib diisi'
    if (editing == null && !form.password.trim()) e.password = 'Wajib diisi saat membuat pengguna baru'
    return e
  }

  function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    if (editing != null) {
      const upd = { name: form.name, username: form.username, email: form.email, permission: form.permission }
      if (form.password.trim()) upd.password = form.password
      update(editing, upd)
    } else {
      create({ name: form.name, username: form.username, email: form.email, permission: form.permission, password: form.password })
    }
    setFormOpen(false)
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Pengguna" count={data.length} color="text-gray-700"  bg="bg-white" />
        <StatCard label="Admin"          count={adminCount}  color="text-slate-600" bg="bg-slate-50" />
        <StatCard label="User"           count={userCount}   color="text-gray-600"  bg="bg-gray-50" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Pengguna</h2>
              <p className="text-sm text-gray-500 mt-0.5">Kelola akun pengguna sistem</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" /></svg>
                <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama / username..." className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl outline-none w-48 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-gray-400" />
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
                  <Th>Nama</Th>
                  <Th className="w-32">Username</Th>
                  <Th className="w-52">Email</Th>
                  <Th className="w-24">Role</Th>
                  <Th className="w-28 text-center">Aksi</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-brand-50/40 transition-colors">
                    <Td className="text-center text-gray-400">{idx + 1}</Td>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-semibold shrink-0">
                          {item.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                    </Td>
                    <Td className="text-gray-600 font-mono text-xs">{item.username}</Td>
                    <Td className="text-gray-500">{item.email}</Td>
                    <Td><StatusBadge status={item.permission} /></Td>
                    <Td className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
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
            Menampilkan {filtered.length} dari {data.length} pengguna
          </div>
        )}
      </div>

      {/* Form modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing != null ? 'Edit Pengguna' : 'Tambah Pengguna'} maxWidth="max-w-lg"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setFormOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer">Batal</button>
            <button onClick={handleSave} className="px-5 py-2 text-sm font-medium text-white bg-brand-400 hover:bg-brand-500 rounded-xl cursor-pointer">Simpan</button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Nama Lengkap" required>
            <input className={INPUT_CLS} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </Field>
          <Field label="Username" required>
            <input className={INPUT_CLS} value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
          </Field>
          <Field label="Email" required>
            <input type="email" className={INPUT_CLS} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </Field>
          <Field label={editing != null ? 'Password (kosongkan jika tidak diubah)' : 'Password'} required={editing == null}>
            <input type="password" className={INPUT_CLS} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder={editing != null ? '••••••••' : ''} />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </Field>
          <Field label="Role">
            <select className={INPUT_CLS} value={form.permission} onChange={e => setForm(f => ({ ...f, permission: e.target.value }))}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmId != null}
        onClose={() => setConfirmId(null)}
        onConfirm={() => remove(confirmId)}
        title="Hapus Pengguna"
        message="Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan."
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
