# Sistem Peminjaman Kendaraan Dinas — Dewan Ekonomi Nasional (DEN)

## Ringkasan Proyek

Aplikasi web untuk mengelola peminjaman kendaraan dinas di lingkungan Dewan Ekonomi Nasional (DEN). Dirancang sebagai **prototipe statis** untuk validasi alur kerja dan presentasi ke stakeholder, sebelum dikembangkan menjadi sistem produksi berbasis backend (Laravel/etc.).

---

## Tech Stack (Prototipe)

| Layer | Teknologi |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v4 (konfigurasi via `@theme` di `src/index.css`, **tanpa** `tailwind.config.js`) |
| Routing | React Router v7 |
| State & Persistence | `useState` + `localStorage` (tidak ada backend) |
| Build | Vite |

---

## Struktur Direktori

```
src/
├── components/
│   ├── AdminView.jsx        # Modul peminjaman sisi admin (tabel, modal detail, aksi)
│   ├── EmployeeView.jsx     # Modul peminjaman sisi karyawan (form + riwayat)
│   ├── Sidebar.jsx          # Navigasi desktop + BottomNav mobile
│   ├── StatusBadge.jsx      # Badge warna per status
│   ├── Modal.jsx            # Modal dasar reusable
│   ├── ConfirmDialog.jsx    # Dialog konfirmasi hapus
│   └── Icons.jsx            # Semua ikon SVG sebagai komponen React
├── views/                   # Modul-modul SIAPPro (admin only)
│   ├── DashboardView.jsx
│   ├── KegiatanView.jsx
│   ├── MasterKegiatanView.jsx
│   ├── DokumentasiView.jsx
│   ├── LpdView.jsx
│   ├── PersidanganView.jsx
│   ├── PenggunaView.jsx
│   ├── PengaturanView.jsx
│   └── LogApiView.jsx
├── hooks/
│   └── useStore.js          # Generic CRUD hook dengan localStorage
├── pages/
│   ├── EmployeeLoginPage.jsx
│   └── AdminLoginPage.jsx
├── App.jsx                  # Root: routing, state global bookings, semua mutasi data
└── index.css                # Brand color tokens (@theme)
```

---

## Brand Colors

Didefinisikan di `src/index.css` dalam blok `@theme`:

```css
--color-brand-50:  #FAF8F2
--color-brand-100: #F0E8D0
--color-brand-200: #D4BF96
--color-brand-300: #BEAA75
--color-brand-400: #A08A53   /* primary */
--color-brand-500: #8A7547
--color-brand-600: #75623C
```

---

## Routing

| URL | Pengguna | Keterangan |
|---|---|---|
| `/` | Karyawan | Login karyawan → modul peminjaman |
| `/admin` | Admin | Login admin → semua modul |

Semua navigasi antar modul admin dilakukan via `module` state di `App.jsx` (tidak ada route tambahan).

---

## Alur Peminjaman Kendaraan

### Status Transitions

```
[Karyawan] Ajukan
    ↓
Menunggu Konfirmasi
    ↓ [Admin] Setujui + assign driver (jika diperlukan)
Menunggu Persetujuan Kepala Bagian
    ↓ [Kepala Bagian] Setujui
Menunggu Serah Terima
    ↓ [Karyawan] Isi data + 4 foto keberangkatan
Menunggu Verifikasi Keberangkatan
    ↓ [Admin] Konfirmasi keberangkatan
Sedang Digunakan
    ↓ [Karyawan] Isi data + 4 foto pengembalian
Menunggu Verifikasi Pengembalian
    ↓ [Admin] Verifikasi pengembalian
Menunggu Persetujuan Akhir Kepala Bagian
    ↓ [Kepala Bagian] Tandai selesai
Selesai

[Admin] Tolak → Ditolak (dari Menunggu Konfirmasi)
```

### Data yang Dicatat Per Tahap

| Tahap | Field |
|---|---|
| Pengajuan | name, division, needDriver, carType, plateNumber, destination, dateStart, dateEnd, purpose |
| Persetujuan Admin | driverName, driverPhone (jika needDriver = 'dengan') |
| Serah Terima | kmDepart, fuelDepart, eMoneyStart, photos.pre (4 foto) |
| Pengembalian | kmReturn, fuelReturn, eMoneyEnd, photos.post (4 foto) |

### Opsi Pengemudi

- **`needDriver: 'tanpa'`** — Peminjam mengemudi sendiri; tidak ada penugasan driver
- **`needDriver: 'dengan'`** — Admin wajib mengisi `driverName` + `driverPhone` (WA) saat menyetujui

---

## Shape Objek Booking

```js
{
  id:           number,          // Date.now()
  status:       string,          // lihat daftar status di atas
  submittedAt:  string,          // ISO datetime

  // Form karyawan
  name:         string,          // nama peminjam
  division:     string,          // unit kerja
  needDriver:   'tanpa'|'dengan',
  carType:      string,          // Zenix | Veloz | Xpander
  plateNumber:  string,
  destination:  string,
  dateStart:    string,          // datetime-local
  dateEnd:      string,
  purpose:      string,

  // Diisi admin saat approve (jika needDriver = 'dengan')
  driverName:   string | null,
  driverPhone:  string | null,

  // Diisi karyawan saat serah terima
  kmDepart:     string,
  fuelDepart:   string,          // E | 1/4 | 1/2 | 3/4 | F
  eMoneyStart:  string,
  photos: {
    pre:  string[],              // array 4 base64 JPEG (compressed)
  },

  // Diisi karyawan saat pengembalian
  kmReturn:     string,
  fuelReturn:   string,
  eMoneyEnd:    string,
  photos: {
    pre:  string[],
    post: string[],              // array 4 base64 JPEG (compressed)
  },
}
```

---

## Persistensi Data (Prototipe)

Semua data disimpan di `localStorage`. Key yang digunakan:

| Key | Isi |
|---|---|
| `den_bookings` | Array semua booking peminjaman |
| `den_employee_user` | Sesi login karyawan |
| `den_admin_user` | Sesi login admin |
| `den_module` | Modul admin terakhir aktif |
| `den_kegiatan` | Data kegiatan SIAPPro |
| `den_master_kegiatan` | Master data kegiatan |
| `den_dokumentasi` | Data dokumentasi |
| `den_lpd` | Data LPD |
| `den_persidangan` | Data persidangan |
| `den_pengguna` | Data pengguna |

### Foto

Foto dikompres via Canvas API sebelum disimpan (max 800px, JPEG quality 0.6 → ~30–60 KB/foto). Implementasi ada di `compressImage()` dalam `EmployeeView.jsx`.

**Limitasi**: localStorage ~5 MB. Untuk produksi, foto harus dikirim ke server (S3/GCS/storage lokal) dan hanya URL-nya yang disimpan di database.

---

## Modul SIAPPro (Admin)

Diakses via sidebar dropdown "SIAPPro" di portal admin.

| Modul | Key localStorage | Keterangan |
|---|---|---|
| Dashboard | — | Stat cards, baca semua key |
| Kegiatan | `den_kegiatan` | CRUD kegiatan + agenda + detail, status Plan/Done/Evaluasi |
| Master Kegiatan | `den_master_kegiatan` | Sama seperti Kegiatan, full CRUD |
| Dokumentasi | `den_dokumentasi` | Lampiran file per kegiatan |
| LPD | `den_lpd` | Laporan Pertanggungjawaban Dinas, multi-PIC |
| Persidangan | `den_persidangan` | Notulen, link Zoom, lampiran |
| Pengguna | `den_pengguna` | Manajemen user, role badge |
| Pengaturan | — | Tabel read-only setting sistem |
| Log API | — | Tabel log read-only, badge SUCCESS/FAILED |

---

## Autentikasi (Prototipe)

Login mock — tidak ada validasi password nyata:

```js
// App.jsx
const MOCK_USERS = {
  employee: { role: 'employee', name: 'Budi Santoso', email: 'budi.santoso@den.go.id' },
  admin:    { role: 'admin',    name: 'Rina Kusuma',  email: 'rina.kusuma@den.go.id' },
}
```

**Catatan**: Prototipe ini tidak memiliki role "Kepala Bagian" yang terpisah — semua aksi kepala bagian dilakukan dari akun admin yang sama (untuk keperluan demo/presentasi). Di sistem produksi, ini harus dipisahkan menjadi role tersendiri.

---

## Catatan untuk Pengembangan Produksi (Laravel/Backend)

### Role & Access

Prototipe saat ini mensimulasikan dua role dari satu akun admin. Di produksi:

| Role | Aksi |
|---|---|
| `admin` | Setujui/tolak permohonan, assign driver, konfirmasi keberangkatan, verifikasi pengembalian |
| `kepala_bagian` | Persetujuan tahap 2 (setelah admin), persetujuan akhir |
| `karyawan` | Ajukan peminjaman, upload foto serah terima & pengembalian |

### API Endpoints yang Dibutuhkan (Estimasi)

```
POST   /api/bookings                          # Ajukan permohonan
GET    /api/bookings                          # List semua (admin)
GET    /api/bookings/{id}                     # Detail
PATCH  /api/bookings/{id}/approve             # Admin setujui + assign driver
PATCH  /api/bookings/{id}/reject              # Admin tolak
PATCH  /api/bookings/{id}/approve-kepala      # Kepala bagian setujui
PATCH  /api/bookings/{id}/depart              # Upload foto + data keberangkatan
PATCH  /api/bookings/{id}/verify-departure    # Admin konfirmasi berangkat
PATCH  /api/bookings/{id}/return              # Upload foto + data pengembalian
PATCH  /api/bookings/{id}/verify-return       # Admin verifikasi kembali
PATCH  /api/bookings/{id}/complete            # Kepala bagian selesaikan
POST   /api/bookings/{id}/photos              # Upload foto ke storage
```

### Poin Penting Lainnya

- **Foto**: Kirim sebagai `multipart/form-data` ke endpoint dedicated, simpan di cloud storage, kembalikan URL.
- **Notifikasi**: Setiap perubahan status perlu notifikasi (email/WhatsApp) ke pihak yang relevan — terutama saat admin assign driver (kirim ke driver via WA).
- **Unit Kerja**: Daftar unit kerja saat ini hardcoded di `EmployeeView.jsx`. Di produksi, ambil dari API (`GET /api/unit-kerja`).
- **Kendaraan**: Jenis mobil dan nomor polisi saat ini input manual. Di produksi, buat master data kendaraan (`GET /api/vehicles`) agar bisa dicek ketersediaan.
- **Audit Trail**: Simpan history perubahan status per booking (who, what, when) untuk keperluan pelaporan.
- **Pagination**: Endpoint list booking perlu pagination — bisa banyak data di produksi.
