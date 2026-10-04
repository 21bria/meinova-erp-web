// app/registry/section-hub/hr-attendance-leave.ts
//
// Isi hub Attendance & Leave.
//
// Folder ini dipisah dari `registry/master-hub/` dengan sengaja: yang di
// sana master dan kebijakan — dibuka sesekali saat menyiapkan sistem —
// sementara yang di sini **layar transaksi harian**. Komponennya sama
// (`~/features/master-hub` memang generik), yang berbeda isinya.
//
// Kartu di sini menautkan ke rute layar apa adanya, jadi seluruhnya ikut
// tersaring `RoleMenuPermission` lewat `MasterHub` — pegawai yang menu
// Leave Opening Balance-nya dicabut tidak mendapat kartunya.

import type {
  MasterHubCategory,
  MasterHubItem,
} from '~/features/master-hub'

export const hrAttendanceLeaveCategories: MasterHubCategory[] = [
  { key: 'attendance', label: 'Attendance', order: 10 },
  { key: 'leave', label: 'Leave', order: 20 },

  // Kelompok terakhir, dan isinya layar yang **bukan** alur harian:
  // baris mentah yang dibuka saat mengaudit atau menelusuri, bukan
  // saat menyusun jadwal. Dipisahkan supaya alur normalnya tinggal
  // tiga langkah — Roster, Shift Calendar, Attendance — dan layar
  // catatan tidak berdiri sebagai sesama pilihan di antaranya.
  { key: 'advanced', label: 'Advanced / Admin', order: 90 },
]

export const hrAttendanceLeaveItems: MasterHubItem[] = [
  {
    key: 'attendance',
    title: 'Attendance',
    description:
      'Catatan presensi harian — jam masuk, jam pulang, keterlambatan, dan pulang cepat.',
    icon: 'i-lucide-calendar-check',
    link: '/hr/attendance',
    category: 'attendance',
    order: 10,
    keywords: ['absensi', 'presensi', 'fingerprint', 'telat', 'tap'],
  },
  {
    // Izin kehadiran — **bukan** cuti, dan kartunya sengaja berdiri di
    // kelompok Attendance, bukan Leave. Yang membedakannya bukan
    // panjangnya izin melainkan apa yang dipotong: cuti memotong saldo,
    // izin tidak punya saldo sama sekali. Menaruhnya di sebelah Leave
    // membuat orang mencarinya di kartu saldo dan menyimpulkan
    // fiturnya rusak.
    key: 'attendance-permissions',
    title: 'Attendance Permission',
    description:
      'Izin kehadiran di luar cuti — datang terlambat, pulang lebih awal, keluar sementara, atau tidak masuk satu hari. Saldo cuti tidak berkurang.',
    icon: 'i-lucide-file-clock',
    link: '/hr/attendance-permissions',
    category: 'attendance',
    order: 12,
    keywords: [
      'izin',
      'izin kehadiran',
      'permit',
      'permission',
      'terlambat',
      'pulang cepat',
      'keluar sementara',
      'late arrival',
      'early leave',
      'temporary out',
    ],
  },
  {
    key: 'shift-calendar',
    title: 'Shift Calendar',
    description:
      'Jadwal efektif per pegawai: hasil roster ditambah adjustment. Shift normalnya ditetapkan dari Roster Schedule.',
    icon: 'i-lucide-calendar-clock',
    link: '/hr/shift-calendar',
    category: 'attendance',
    order: 15,
    keywords: ['shift', 'jadwal', 'roster', 'kalender', 'malam', 'night', 'override'],
  },
  {
    key: 'shift-assignments',
    title: 'Shift Assignment Records',
    // **Records**, dan kartunya turun ke kelompok Advanced. Layar ini
    // memperlihatkan baris mentahnya beserta lapis baseline/adjustment
    // — istilah tabel yang tidak perlu dipahami siapa pun yang cuma
    // menyusun jadwal. Yang dipertahankan gunanya: memeriksa,
    // mengaudit, dan membetulkan satu baris tanpa menyusun ulang
    // seluruh pola.
    //
    // Kartunya **tidak** dibuang: rute yang tidak punya kartu maupun
    // baris menu tetap bisa dibuka lewat URL, dan menyembunyikannya
    // cuma membuatnya sulit ditemukan oleh orang yang berhak.
    description:
      'Baris mentah rencana & penyesuaian shift, untuk audit dan penelusuran. Alur normalnya lewat Roster Schedule dan Shift Calendar.',
    icon: 'i-lucide-clock-arrow-up',
    link: '/hr/shift-assignments',
    category: 'advanced',
    // Urutannya **jauh di belakang**, bukan 10. Kategori di hub ini
    // adalah tab penyaring, bukan pengelompokan visual: daftar kartunya
    // datar dan diurutkan `order` saja. Tanpa angka besar, kartu yang
    // sudah dipindah ke kategori Advanced tetap berdiri di urutan kedua
    // pada tab "All" — persis di tengah alur yang mau disederhanakan.
    order: 900,
    keywords: ['shift', 'penugasan', 'assignment', 'baseline', 'override', 'adjustment', 'audit'],
  },
  {
    key: 'overtime',
    title: 'Overtime',
    description:
      'Pengajuan dan catatan lembur, beserta lama jamnya.',
    icon: 'i-lucide-briefcase-business',
    link: '/hr/overtime',
    category: 'attendance',
    order: 20,
    keywords: ['lembur', 'overtime', 'jam tambahan'],
  },
  {
    key: 'leave',
    title: 'Leave',
    description:
      'Pengajuan cuti pegawai dan pencatatan cuti yang sudah disetujui di luar sistem.',
    icon: 'i-lucide-clock-3',
    link: '/hr/leave',
    category: 'leave',
    order: 30,
    keywords: ['cuti', 'izin', 'sakit', 'leave request'],
  },
  {
    key: 'leave-balances',
    title: 'Leave Balance',
    description:
      'Kartu saldo cuti per pegawai per tahun — jatah, sisa tahun lalu, terpakai, dan sisanya.',
    icon: 'i-lucide-wallet-minimal',
    link: '/hr/leave-balances',
    category: 'leave',
    order: 40,
    keywords: ['saldo', 'sisa cuti', 'jatah', 'entitlement', 'carry over'],
  },
  {
    key: 'leave-go-live',
    title: 'Leave Go-Live',
    description:
      'Tanggal perusahaan menyerahkan pencatatan cutinya ke sistem ini. Langkah pertama sebelum saldo awal diimport.',
    icon: 'i-lucide-calendar-check-2',
    link: '/hr/leave-go-live',
    category: 'leave',
    order: 45,
    keywords: ['go live', 'migrasi', 'cut off', 'tanggal berlaku', 'takeover'],
  },
  {
    key: 'leave-opening-balances',
    title: 'Leave Opening Balance',
    description:
      'Saldo awal saat pindah dari sistem lama — satu titik awal bertanggal, bukan histori yang dikarang.',
    icon: 'i-lucide-file-input',
    link: '/hr/leave-opening-balances',
    category: 'leave',
    order: 50,
    keywords: ['migrasi', 'go-live', 'saldo awal', 'opening balance'],
  },
]
