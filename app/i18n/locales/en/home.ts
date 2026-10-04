/*
| Beranda: Application Launcher + tiga kartu utility di sebelahnya.
|
| Dipisah dari `common` karena isinya milik satu layar, bukan milik
| framework — dan `common` sudah 500 baris.
|
| Label status dokumen TIDAK ditulis ulang di sini: yang dipakai tetap
| `common.status.*`, kunci yang sama dengan seluruh aplikasi. Menuliskan
| "Pending" untuk kedua kalinya di berkas ini berarti dua tempat yang
| bisa berbeda bunyinya untuk kode API yang sama.
*/
export default {
  launcher: {
    title: 'Applications',
    subtitle: 'Pick an application to start working.',
    customizeHint: 'Choose which applications appear on your home.',
    empty: 'No applications available for your account.',
    inWorkspace: 'On your home',
    notInWorkspace: 'Hidden from home',
    noAccess: 'You don\'t have access to this application.',
    unavailable: 'This application is not available yet.',
  },

  /*
   * Status katalog aplikasi (`FavoriteApp.Status`), dihuruf-kecilkan
   * seperti `common.status.*`. Kunci = kode backend, bukan sebaliknya.
   */
  appStatus: {
    beta: 'Beta',
    coming_soon: 'Coming soon',
    maintenance: 'Maintenance',
    disabled: 'Disabled',
  },

  /*
   * Kendali susun beranda (`DashboardWidgetFrame`). Sebelumnya ditulis
   * langsung di templat dan hanya dalam bahasa Indonesia — satu-satunya
   * bagian layar berbahasa Inggris yang berbunyi "Naikkan".
   */
  widget: {
    moveUp: 'Move up',
    moveDown: 'Move down',
    show: 'Show',
    hide: 'Hide',
    expand: 'Open',
  },

  actions: {
    customize: 'Customize',
    done: 'Done',
  },

  utility: {
    approval: 'Approval Status',
    notifications: 'Notifications',
    recentDocuments: 'Recent Documents',
    viewAll: 'View all',
    expand: 'Expand {title}',
    collapse: 'Collapse {title}',
    show: 'Show {title}',
    hide: 'Hide {title}',
  },

  approval: {
    total: 'Total documents',
    empty: 'No running documents yet.',
  },

  notifications: {
    empty: 'No notifications.',
    unread: '{count} unread',
  },

  documents: {
    empty: 'No documents involving you yet.',
  },
}
