// app/registry/section-hub/reports.ts
//
// Isi hub aplikasi Reports.
//
// Empat kategori, satu kartu yang bisa ditekan. Tiga sisanya berkartu
// **Coming Soon** dan sengaja begitu: Reports adalah rumah untuk seluruh
// laporan lintas modul, dan hub yang cuma memperlihatkan HR terbaca
// seperti "Reports = laporan HR" — lalu laporan Payroll berikutnya
// mendarat di dalam Payroll, dan pemisahan yang dibangun di sini hilang
// dalam satu sprint.
//
// Kartu Coming Soon menautkan ke `#`, bukan ke rute yang belum ada.
// Rute yang belum dibuat menghasilkan `[Vue Router warn] No match found`
// dan halaman kosong; `#` ditandai `disabled` dan tidak bisa ditekan
// sama sekali. `useMenuAccess.isVisible` juga melewatkan `#` apa adanya,
// jadi kartunya tidak ikut tersaring per role — memang tidak ada yang
// perlu dijaga di balik kartu yang tidak menuju ke mana pun.
//
// Kartu yang **bisa** ditekan menautkan ke rute layar apa adanya, jadi
// ikut tersaring `RoleMenuPermission` lewat `MasterHub`.

import type {
  MasterHubCategory,
  MasterHubItem,
} from '~/features/master-hub'

export const reportsCategories: MasterHubCategory[] = [
  { key: 'hr', label: 'HR', order: 10 },
  { key: 'payroll', label: 'Payroll', order: 20 },
  { key: 'scm', label: 'SCM', order: 30 },
  { key: 'finance', label: 'Finance', order: 40 },
]

/**
 * Kartu penanda untuk keluarga laporan yang belum punya isi.
 *
 * Satu tempat, bukan tiga salinan: yang membedakan ketiganya cuma nama
 * modulnya, dan tiga blok yang hampir sama persis adalah tiga tempat
 * untuk lupa mengganti satu kata.
 */
function comingSoon(
  category: string,
  label: string,
  icon: string,
  description: string,
): MasterHubItem {
  return {
    key: `${category}-coming-soon`,
    title: `${label} Reports`,
    description,
    icon,
    link: '#',
    category,
    order: 10,
    badge: 'Coming Soon',
    disabled: true,
  }
}

export const reportsItems: MasterHubItem[] = [
  {
    key: 'hr-period-summary',
    title: 'HR Period Summary',
    description:
      'Rekap kehadiran, cuti, dan lembur per pegawai pada satu periode, '
      + 'lengkap dengan penelusuran ke catatan sumbernya.',
    icon: 'i-lucide-table-2',
    link: '/reports/hr/period-summary',
    category: 'hr',
    order: 10,
    keywords: [
      'rekap',
      'periode',
      'kehadiran',
      'cuti',
      'lembur',
      'absensi',
      'attendance',
      'leave',
      'overtime',
    ],
  },

  {
    key: 'hr-employee-reporting-audit',
    title: 'Employee Reporting Audit',
    description:
      'Struktur pegawai, lokasi, Employee Group, garis pelaporan, dan '
      + 'akun login-nya dalam satu tabel — tanpa periode.',
    icon: 'i-lucide-network',
    link: '/reports/hr/employee-reporting-audit',
    category: 'hr',
    order: 20,
    keywords: [
      'audit',
      'struktur',
      'reporting line',
      'garis pelaporan',
      'atasan',
      'report to',
      'akun',
      'account',
      'email',
      'organisasi',
    ],
  },

  {
    key: 'hr-manpower-summary',
    title: 'Manpower Summary',
    description:
      'Jumlah dan komposisi tenaga kerja per company, lokasi, '
      + 'department, Employee Group, dan jenis kepegawaian.',
    icon: 'i-lucide-users-round',
    link: '/reports/hr/manpower-summary',
    category: 'hr',
    order: 30,
    keywords: [
      'manpower',
      'headcount',
      'jumlah pegawai',
      'komposisi',
      'workforce',
      'tenaga kerja',
      'permanent',
      'contract',
      'employee group',
      'employment type',
    ],
  },

  {
    key: 'hr-contract-expiry',
    title: 'Contract Expiry',
    description:
      'Kontrak yang sudah atau akan habis, dipecah per rentang sisa '
      + 'hari, lengkap dengan status perpanjangannya.',
    icon: 'i-lucide-file-clock',
    link: '/reports/hr/contract-expiry',
    category: 'hr',
    order: 40,
    keywords: [
      'kontrak',
      'contract',
      'expiry',
      'habis',
      'berakhir',
      'perpanjangan',
      'renewal',
      'extension',
      'pkwt',
      'masa kontrak',
      'days remaining',
    ],
  },

  comingSoon(
    'payroll',
    'Payroll',
    'i-lucide-wallet',
    'Rekap gaji, tunjangan, potongan, dan pajak per periode.',
  ),

  comingSoon(
    'scm',
    'SCM',
    'i-lucide-package',
    'Pembelian, persediaan, dan pergerakan stok per periode.',
  ),

  comingSoon(
    'finance',
    'Finance',
    'i-lucide-receipt-text',
    'Buku besar, hutang piutang, dan ringkasan keuangan per periode.',
  ),
]
