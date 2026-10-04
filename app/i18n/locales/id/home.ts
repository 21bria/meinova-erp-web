/*
| Padanan Indonesia untuk `locales/en/home.ts`.
|
| Bentuk kuncinya wajib sama persis — `messages.spec.ts` menolak kunci
| yang hanya ada di sini, karena kunci seperti itu tidak punya fallback
| dan tampil mentah di layar pengguna berbahasa Inggris.
*/
export default {
  launcher: {
    title: 'Aplikasi',
    subtitle: 'Pilih aplikasi untuk mulai bekerja.',
    customizeHint: 'Pilih aplikasi yang tampil di beranda Anda.',
    empty: 'Belum ada aplikasi yang tersedia untuk akun Anda.',
    inWorkspace: 'Tampil di beranda',
    notInWorkspace: 'Disembunyikan dari beranda',
    noAccess: 'Anda tidak memiliki akses ke aplikasi ini.',
    unavailable: 'Aplikasi ini belum tersedia.',
  },

  appStatus: {
    beta: 'Beta',
    coming_soon: 'Segera hadir',
    maintenance: 'Pemeliharaan',
    disabled: 'Nonaktif',
  },

  widget: {
    moveUp: 'Naikkan',
    moveDown: 'Turunkan',
    show: 'Tampilkan',
    hide: 'Sembunyikan',
    expand: 'Buka',
  },

  actions: {
    customize: 'Sesuaikan',
    done: 'Selesai',
  },

  utility: {
    approval: 'Status Persetujuan',
    notifications: 'Notifikasi',
    recentDocuments: 'Dokumen Terakhir',
    viewAll: 'Lihat semua',
    expand: 'Buka {title}',
    collapse: 'Tutup {title}',
    show: 'Tampilkan {title}',
    hide: 'Sembunyikan {title}',
  },

  approval: {
    total: 'Total dokumen',
    empty: 'Belum ada dokumen berjalan.',
  },

  notifications: {
    empty: 'Belum ada notifikasi.',
    unread: '{count} belum dibaca',
  },

  documents: {
    empty: 'Belum ada dokumen yang melibatkan Anda.',
  },
}
