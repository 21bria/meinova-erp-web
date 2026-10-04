// app/registry/section-hub/payroll-bpjs.ts
//
// Isi workspace BPJS.
//
// Ada karena sidebar Compliance sempat memuat tujuh item BPJS — satu
// per resource backend. Yang tampak di sidebar seharusnya alur kerja,
// bukan daftar tabel: orang membuka "BPJS", bukan "BpjsBaseComponent".
//
// Kartunya menautkan ke rute layar yang **sudah ada**, apa adanya. Itu
// dua hal sekaligus: bookmark lama tetap hidup, dan seluruh kartu ikut
// tersaring `RoleMenuPermission` lewat `MasterHub` — role yang menu
// BPJS Enrollments-nya dicabut tidak mendapat kartunya. Workspace ini
// tidak menambah satu pun jalan masuk baru ke resource mana pun.

import type {
  MasterHubCategory,
  MasterHubItem,
} from '~/features/master-hub'

export const payrollBpjsCategories: MasterHubCategory[] = [
  // Yang dibuka saat menjalankan BPJS: program apa yang diikuti,
  // aturan mana yang berlaku, siapa pesertanya.
  { key: 'core', label: 'Programs & Rules', order: 10 },

  // Kelompok terakhir, dan isinya memang teknis: kelas risiko dan
  // susunan dasar iuran. Dibuka saat menyiapkan atau mengoreksi
  // konfigurasi, bukan saat menjalankan payroll bulanan.
  { key: 'configuration', label: 'Configuration', order: 90 },
]

export const payrollBpjsItems: MasterHubItem[] = [
  {
    key: 'bpjs-programs',
    title: 'Programs',
    description:
      'Program BPJS yang dipakai tenant ini — JHT, JP, JKK, JKM, JKN.',
    icon: 'i-lucide-shield-check',
    link: '/payroll/bpjs-programs',
    category: 'core',
    permission: 'payroll.view_bpjsprogram',
    order: 10,
    keywords: ['jht', 'jp', 'jkk', 'jkm', 'jkn', 'jkp', 'program'],
  },
  {
    key: 'bpjs-rules',
    title: 'Rules',
    description:
      'Tarif pegawai/perusahaan, plafon, dan tanggal berlakunya per program.',
    icon: 'i-lucide-landmark',
    link: '/payroll/bpjs-rules',
    category: 'core',
    permission: 'payroll.view_bpjsrule',
    order: 20,
    keywords: ['tarif', 'iuran', 'plafon', 'aturan', 'effective'],
  },
  {
    key: 'bpjs-enrollments',
    title: 'Enrollments',
    description:
      'Kepesertaan per pegawai beserta nomor kepesertaannya. Tidak terdaftar berarti tidak ikut.',
    icon: 'i-lucide-user-check',
    link: '/payroll/bpjs-enrollments',
    category: 'core',
    permission: 'payroll.view_bpjsenrollment',
    order: 30,
    keywords: ['peserta', 'kepesertaan', 'membership', 'nomor'],
  },

  {
    key: 'bpjs-risk-classes',
    title: 'Risk Classes',
    description:
      'Kelas risiko JKK. Identitasnya saja — tarifnya tinggal di Rules.',
    icon: 'i-lucide-triangle-alert',
    link: '/payroll/bpjs-risk-classes',
    category: 'configuration',
    permission: 'payroll.view_bpjsriskclass',
    order: 10,
    keywords: ['jkk', 'risiko', 'kelas', 'risk'],
  },
  {
    key: 'bpjs-base-definitions',
    title: 'Base Definitions',
    description:
      'Susunan dasar iuran beserta versinya, termasuk cara upah harian dihitung.',
    icon: 'i-lucide-layers',
    link: '/payroll/bpjs-base-definitions',
    category: 'configuration',
    permission: 'payroll.view_bpjsbasedefinition',
    order: 20,
    keywords: ['dasar', 'upah', 'komposisi', 'versi', 'harian'],
  },
  {
    // Ditaruh persis sesudah Base Definitions karena itu urutan
    // bacanya: definisinya dulu, baru isinya. Layarnya sendiri sudah
    // punya penyaring `definition`, jadi menelusuri komponen milik satu
    // definisi tetap satu langkah.
    key: 'bpjs-base-components',
    title: 'Base Components',
    description:
      'Komponen yang disebut di dalam setiap Base Definition.',
    icon: 'i-lucide-list-tree',
    link: '/payroll/bpjs-base-components',
    category: 'configuration',
    permission: 'payroll.view_bpjsbasecomponent',
    order: 30,
    keywords: ['komponen', 'tunjangan', 'allowance', 'dasar'],
  },
]
