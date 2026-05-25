import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import EmployeeLoginPage from './pages/EmployeeLoginPage'
import AdminLoginPage from './pages/AdminLoginPage'
import EmployeeView from './components/EmployeeView'
import AdminView from './components/AdminView'
import Sidebar from './components/Sidebar'
import { LogOutIcon } from './components/Icons'

const MOCK_USERS = {
  employee: { role: 'employee', name: 'Budi Santoso', email: 'budi.santoso@den.go.id' },
  admin:    { role: 'admin',    name: 'Rina Kusuma',  email: 'rina.kusuma@den.go.id' },
}

function readLS(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v !== null ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [employeeUser, setEmployeeUser] = useState(() => readLS('den_employee_user', null))
  const [adminUser,    setAdminUser]    = useState(() => readLS('den_admin_user', null))
  const [module,       setModule]       = useState(() => readLS('den_module', 'peminjaman'))
  const [bookings,     setBookings]     = useState(() => readLS('den_bookings', []))

  useEffect(() => {
    if (employeeUser) localStorage.setItem('den_employee_user', JSON.stringify(employeeUser))
    else localStorage.removeItem('den_employee_user')
  }, [employeeUser])

  useEffect(() => {
    if (adminUser) localStorage.setItem('den_admin_user', JSON.stringify(adminUser))
    else localStorage.removeItem('den_admin_user')
  }, [adminUser])

  useEffect(() => { localStorage.setItem('den_module', JSON.stringify(module)) }, [module])
  useEffect(() => { localStorage.setItem('den_bookings', JSON.stringify(bookings)) }, [bookings])

  function addBooking(booking) {
    setBookings(prev => [{
      ...booking,
      id: Date.now(),
      status: 'Menunggu Konfirmasi',
      submittedAt: new Date().toISOString().slice(0, 16),
      photos: {},
    }, ...prev])
  }

  function updateStatus(id, status) {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  function uploadPrePhoto(id, dataUrl) {
    setBookings(prev => prev.map(b =>
      b.id === id
        ? { ...b, status: 'Sedang Digunakan', photos: { ...b.photos, pre: dataUrl } }
        : b
    ))
  }

  function uploadPostPhoto(id, dataUrl) {
    setBookings(prev => prev.map(b =>
      b.id === id
        ? { ...b, status: 'Selesai', photos: { ...b.photos, post: dataUrl } }
        : b
    ))
  }

  return (
    <Routes>
      <Route path="/" element={
        employeeUser
          ? (
            <AppShell user={employeeUser} module={module} onNavigate={setModule} onSignOut={() => setEmployeeUser(null)}>
              <EmployeeView
                onSubmit={addBooking}
                bookings={bookings}
                onUploadPrePhoto={uploadPrePhoto}
                onUploadPostPhoto={uploadPostPhoto}
              />
            </AppShell>
          )
          : <EmployeeLoginPage onLogin={() => setEmployeeUser(MOCK_USERS.employee)} />
      } />

      <Route path="/admin" element={
        adminUser
          ? (
            <AppShell user={adminUser} module={module} onNavigate={setModule} onSignOut={() => setAdminUser(null)}>
              <AdminView bookings={bookings} onUpdateStatus={updateStatus} />
            </AppShell>
          )
          : <AdminLoginPage onLogin={() => setAdminUser(MOCK_USERS.admin)} />
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function AppShell({ user, module, onNavigate, onSignOut, children }) {
  const isAdmin = user.role === 'admin'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20 flex-shrink-0">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="DEN" className="h-8 w-auto object-contain flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900 leading-tight">Dewan Ekonomi Nasional</p>
              <p className="text-xs text-gray-400 leading-tight">
                {isAdmin ? 'Portal Admin' : 'Sistem Layanan Internal'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <span className="hidden sm:inline text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full uppercase tracking-widest">
                Admin
              </span>
            )}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-800 leading-tight">{user.name}</span>
              <span className="text-xs text-gray-400 leading-tight">{user.email}</span>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              isAdmin ? 'bg-slate-700 text-white' : 'bg-brand-100 text-brand-600'
            }`}>
              <span className="text-sm font-semibold">{user.name.charAt(0)}</span>
            </div>
            <button
              onClick={onSignOut}
              title="Keluar"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 text-xs font-medium transition-all cursor-pointer"
            >
              <LogOutIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <Sidebar activeModule={module} onNavigate={onNavigate} onSignOut={onSignOut} />
        <main className="flex-1 overflow-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
