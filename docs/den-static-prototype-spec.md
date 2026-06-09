# DEN Dashboard — Spec Build Modul (Prototype Statis React + localStorage)

> **Cara pakai file ini:** taruh di root project React lo sebagai `CLAUDE.md` (kalau pakai Claude Code) atau `AGENTS.md`, atau paste sebagai context ke AI coding agent. Tujuannya: agent membangun **modul-modul baru** mengikuti pola dashboard "Peminjaman Kendaraan Dinas" yang sudah ada.

---

## 0. Tujuan & Aturan Main

- **Prototype statis, TANPA backend.** Semua data CRUD disimpan di **`localStorage` browser**.
- Dipakai untuk **presentasi ke stakeholder Dewan Ekonomi Nasional (DEN)** — fokus ke tampilan & alur, bukan persistensi nyata.
- **WAJIB konsisten** dengan modul yang sudah ada ("Peminjaman Kendaraan Dinas"): reuse layout, komponen, dan gaya yang sama. Jangan bikin desain baru.
- Field & nama entitas di bawah ini **diambil dari REST API asli** (Laravel) — bukan karangan. Jangan tambah/kurangi field tanpa alasan; boleh menyederhanakan untuk prototype (lihat catatan File).

---

## 1. Stack & Konvensi (asumsi — sesuaikan dgn project lo)

- Vite + React + Tailwind CSS + React Router (port dev 5173).
- **State per modul**: custom hook yang baca/tulis localStorage (atau Context/Zustand kalau sudah ada — IKUTI yang sudah dipakai modul peminjaman).
- **localStorage key**: `den_<module>` berisi JSON array. Contoh: `den_kegiatan`, `den_persidangan`.
- **ID**: `crypto.randomUUID()` atau auto-increment integer (pilih sesuai modul existing).
- **Seed**: kalau key kosong saat pertama load, isi dengan data contoh (disediakan di §6).
- **Audit fields** (`created_user`, `created_date`, `updated_user`, `updated_date`) di-generate otomatis (pakai user login dummy + `new Date()`), TIDAK perlu input form.

---

## 2. Design System (samakan dgn dashboard existing)

**Warna brand (gold):**
```
DEFAULT/400  #f0cf7d   ← primary (tombol, item aktif, aksen)
50  #fefaf0   100 #fcf2d7   200 #f8e6ae   300 #f4da92
500 #e3b352 (hover)   600 #d09a33   700 #a87a22 (teks link di bg putih)
800 #8a631f   900 #71511d
```
> Catatan kontras: gold itu terang → tombol pakai **teks gelap** (`text-slate-900`), link pakai shade **700**.

**Layout (ikut existing):**
- Header atas: logo + "Dewan Ekonomi Nasional / Portal Admin", badge role (ADMIN), nama user + avatar, tombol "Keluar".
- Sidebar kiri: label "MODUL" + daftar modul (item aktif highlight gold).
- Konten: **stat cards** (baris atas) → **card daftar** (judul + subjudul, search, filter status, tab status dgn jumlah, tabel, footer "Menampilkan X dari Y").
- Aksi per baris: tombol **Detail** (+ Edit/Hapus sesuai modul).

**Komponen reusable yang sebaiknya ada:** `StatCard`, `StatusBadge`, `DataTable`, `SearchInput`, `StatusTabs`, `Modal`/`Drawer` (untuk form create/edit & detail), `ConfirmDialog`.

---

## 3. Pola CRUD Standar (semua modul)

1. **List**: tabel + search + (opsional) tab status + paginasi/footer count.
2. **Create / Edit**: form di modal atau halaman terpisah (ikut existing). Validasi field `required`.
3. **Detail**: tampilkan semua field + child rows (kalau ada).
4. **Delete**: konfirmasi dulu.
5. **Header–Detail (nested)**: form punya "repeater" — tombol "+ Tambah baris" untuk child, tiap baris bisa dihapus.

**Penanganan File (penting untuk prototype):**
Beberapa modul punya field file (di API berupa base64). Untuk prototype **JANGAN simpan byte file** ke localStorage (bisa overflow). Cukup simpan metadata: `{ file_name, file_type, file_size }` dari `<input type="file">`. Tampilkan sebagai "📎 nama_file.pdf". Ini cukup untuk demo.

---

## 4. Daftar Modul (urutan menu sidebar)

| # | Modul | Storage key | Tipe | CRUD |
|---|---|---|---|---|
| 1 | Dashboard | — | ringkasan | read |
| 2 | Kegiatan (Activity) | `den_kegiatan` | header + agenda + detail (nested 2 lvl) | Create, Edit (header), Detail (tanpa Delete*) |
| 3 | Master Kegiatan | `den_master_kegiatan` | header + agenda + detail | Full CRUD |
| 4 | Dokumentasi | `den_dokumentasi` | header + file detail | Full CRUD |
| 5 | LPD (Laporan) | `den_lpd` | header + file detail | Full CRUD |
| 6 | Persidangan | `den_persidangan` | header + file detail | Full CRUD |
| 7 | Pengguna (User) | `den_users` | tunggal | Full CRUD |
| 8 | Pengaturan (Setting) | `den_settings` | tunggal | Read-only |
| 9 | Log API | `den_apilogs` | tunggal | Read-only |

> *Di API asli, Activity tidak punya operasi delete. Untuk prototype boleh ditambahkan Delete kalau stakeholder butuh — tandai sebagai "tambahan prototype".

---

## 5. Spesifikasi Field per Modul

Legend tipe: `text`, `textarea`, `date`, `number`, `select`, `file`. ✅ = required.

### 5.1 Kegiatan (Activity) — `den_kegiatan`
**Header:**
| Field | Label | Tipe | Req | Catatan |
|---|---|---|---|---|
| activity_name | Nama Kegiatan | text | ✅ | |
| activity_date | Tanggal | date | ✅ | |
| activity_report_date | Tanggal Laporan | date | | |
| activity_pic | PIC | text | ✅ | |
| activity_group | Grup | text | ✅ | |
| activity_type | Tipe | text | ✅ | |
| pic_persidangan | PIC Persidangan | text | | |
| pic_dokumentasi | PIC Dokumentasi | text | | |
| lokasi | Lokasi | text | | |
| penjabat | Penjabat | text | | |
| activity_status | Status | select | | `P`=Plan, `D`=Done, `E`=Evaluasi (default P) |
| activity_remarks | Catatan | textarea | | |
| activity_have_problem | Ada Masalah | text | | opsional |
| activity_remarks_kabag | Catatan Kabag | textarea | | opsional |
| activity_remarks_kasubbag | Catatan Kasubbag | textarea | | opsional |

**Child 1 — Agenda (titles):** `activity_titel_name` (text), `activity_title_seq` (number, urutan)
**Child 2 — Detail (di dalam tiap Agenda):** `activity_detail_name` (text), `activity_detail_seq` (number), `activity_detail_result` (text/textarea, hasil)

- **List columns:** No, Nama Kegiatan, Tanggal, PIC, Status (badge).
- **Search:** nama kegiatan, PIC.
- **Tab status:** Semua / Plan / Done / Evaluasi.

### 5.2 Master Kegiatan — `den_master_kegiatan`
**Header:** `activity_name` (text ✅), `activity_group` (text), `activity_type` (text)
**Child — Agenda:** `activity_titel_name`, `activity_title_seq`
**Child — Detail:** `activity_detail_name`, `activity_detail_seq`, `activity_detail_result`
- **List columns:** No, Nama, Grup, Tipe, Aksi. **Search:** nama, grup. Full CRUD.

### 5.3 Dokumentasi — `den_dokumentasi`
**Header:**
| Field | Label | Tipe | Req |
|---|---|---|---|
| activity_id | Kegiatan (ref ID) | number/select | ✅ |
| activity_name | Nama Kegiatan | text | ✅ |
| activity_date | Tanggal | date | |
| pic_dokumentasi | PIC Dokumentasi | text | |
| link_voice | Link Voice | text | |
| link_video | Link Video | text | |

**Detail (file):** `file` (file → simpan metadata), `file_type` (text), `remarks` (text)
- **List columns:** No, Kegiatan, Tanggal, PIC, Aksi. **Search:** nama, PIC. Full CRUD.

### 5.4 LPD / Laporan — `den_lpd`
**Header:**
| Field | Label | Tipe | Req |
|---|---|---|---|
| activity_id | Kegiatan (ref ID) | number/select | ✅ |
| activity_name | Nama Kegiatan | text | ✅ |
| activity_date | Tanggal Mulai | date | |
| activity_date_end | Tanggal Selesai | date | |
| pic_kegiatan | PIC Kegiatan | text | |
| pic_dokumentasi | PIC Dokumentasi | text | |
| pic_persidangan | PIC Persidangan | text | |
| pic_penjabat | PIC Penjabat | text | |
| pic_perangkat | PIC Perangkat | text | |
| tautan_link | Tautan Link | text | |

**Detail (file):** `file`, `file_type`, `remarks`
- **List columns:** No, Kegiatan, Tanggal, PIC Kegiatan, Aksi. **Search:** nama, PIC kegiatan. Full CRUD.

### 5.5 Persidangan — `den_persidangan`
**Header:**
| Field | Label | Tipe | Req |
|---|---|---|---|
| activity_id | Kegiatan (ref ID) | number/select | ✅ |
| activity_name | Nama Kegiatan | text | ✅ |
| activity_date | Tanggal | date | |
| pic_persidangan | PIC Persidangan | text | |
| notulen | Notulen | textarea | |
| link_zoom | Link Zoom | text | |
| link_recorder | Link Recorder | text | |

**Detail (lampiran):** `file`, `file_type`, `file_name`, `file_size`, `remarks`
- **List columns:** No, Kegiatan, Tanggal, PIC, Aksi. **Search:** nama, PIC. Full CRUD.

### 5.6 Pengguna (User) — `den_users`
| Field | Label | Tipe | Req | Catatan |
|---|---|---|---|---|
| name | Nama | text | ✅ | |
| username | Username | text | ✅ | unik |
| email | Email | email | ✅ | unik |
| password | Password | password | ✅ saat create | kosongkan = tidak diubah (edit) |
| permission | Role | select | | `user` / `admin` |
- **List columns:** No, Nama, Username, Email, Role (badge), Aksi. **Search:** nama/username/email. Full CRUD.

### 5.7 Pengaturan (Setting) — `den_settings` (read-only)
Fields: `setting_name` (text), `setting_value` (text). Tampilkan sebagai tabel 2 kolom. Tanpa create/edit/delete.

### 5.8 Log API — `den_apilogs` (read-only)
Fields: `log_time` (datetime), `object_type`, `method`, `status` (badge: SUCCESS hijau / FAILED merah), `username`, `url`. Viewer + search (tipe/user/url).

---

## 6. Contoh Data Seed (localStorage)

```js
// den_kegiatan
[{
  id: 1, activity_name: "Rapat Koordinasi", activity_date: "2026-05-26",
  activity_pic: "Ardian Nugraha", activity_group: "Rapat", activity_type: "Internal",
  activity_status: "D", lokasi: "Ruang Rapat A", pic_dokumentasi: "Verdy",
  titles: [{ activity_titel_name: "Pembukaan", activity_title_seq: 1,
    details: [{ activity_detail_name: "Sambutan Ketua", activity_detail_seq: 1, activity_detail_result: "Lancar" }] }]
}]

// den_persidangan
[{ id: 1, activity_id: 1, activity_name: "Rapat Koordinasi", activity_date: "2026-05-26",
   pic_persidangan: "Ardian Nugraha", notulen: "Notulen awal", link_zoom: "https://zoom/abc",
   details: [{ file_name: "notulen.pdf", file_type: "pdf", remarks: "final" }] }]

// den_users
[{ id: 1, name: "Rina Kusuma", username: "rina", email: "rina.kusuma@den.go.id", permission: "admin" }]

// den_settings
[{ setting_name: "app_name", setting_value: "Dewan Ekonomi Nasional" },
 { setting_name: "app_version", setting_value: "1.0.0" }]
```

> Untuk modul header-detail, simpan child sebagai **array nested** di dalam objek header (lebih simpel untuk localStorage daripada tabel terpisah).

---

## 7. Status & Badge

| Konteks | Nilai | Label | Warna badge |
|---|---|---|---|
| Kegiatan | P | Plan | abu/biru |
| Kegiatan | D | Done | hijau |
| Kegiatan | E | Evaluasi | gold |
| Log API | SUCCESS | Sukses | hijau |
| Log API | FAILED | Gagal | merah |

---

## 8. Checklist Implementasi (per modul)
- [ ] Hook localStorage (`useModuleStore('den_xxx')`) — list, getById, create, update, remove, seedIfEmpty.
- [ ] Halaman List (stat cards opsional + search + tab status + tabel + footer count).
- [ ] Form Create/Edit (validasi required; repeater untuk header-detail).
- [ ] Detail view.
- [ ] Delete + konfirmasi (kecuali read-only).
- [ ] Daftar modul di sidebar + routing.
- [ ] Konsisten warna/komponen dgn modul Peminjaman Kendaraan Dinas.

---

## 9. Catatan kejujuran (untuk lo, bukan untuk agent)
- Semua field di atas diambil dari Repository Laravel asli (`ActivityRepository`, `DokumentasiRepository`, `LpdRepository`, `PersidanganRepository`, `UserRepository`, dll). Bukan karangan.
- Yang disederhanakan untuk prototype: (1) file disimpan metadata saja, (2) child disimpan nested (bukan tabel relasional), (3) beberapa field opsional Kegiatan boleh disembunyikan kalau form kepanjangan.
