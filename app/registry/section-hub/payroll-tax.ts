// app/registry/section-hub/payroll-tax.ts
//
// Isi workspace Tax.
//
// Sama alasannya dengan `payroll-bpjs.ts`: satu item Compliance, dan
// konfigurasi pajaknya tinggal di dalamnya. Sebelum ini "Tax" di
// sidebar menautkan langsung ke Tax Brackets, jadi Tax Statuses hanya
// bisa ditemukan lewat Master Hub — dua layar untuk satu urusan, di dua
// tempat yang tidak saling menyebut.
//
// Kartunya menautkan ke rute yang sudah ada, jadi penyaring hak akses
// dan bookmark lama keduanya tetap berlaku.

import type {
  MasterHubCategory,
  MasterHubItem,
} from '~/features/master-hub'

export const payrollTaxCategories: MasterHubCategory[] = [
  { key: 'rates', label: 'Rates & Brackets', order: 10 },
  { key: 'employee', label: 'Employee Tax Data', order: 20 },
]

export const payrollTaxItems: MasterHubItem[] = [
  {
    key: 'tax-brackets',
    title: 'Tax Brackets',
    description: 'Lapisan tarif PPh21 progresif (rupiah setahun).',
    icon: 'i-lucide-percent',
    link: '/payroll/tax-brackets',
    category: 'rates',
    permission: 'payroll.view_payrolltaxbracket',
    order: 10,
    keywords: ['pph21', 'pph 21', 'tarif', 'progresif', 'lapisan'],
  },
  {
    key: 'tax-statuses',
    title: 'Tax Statuses',
    description: 'Status PTKP pegawai — TK/0, K/1, dan seterusnya.',
    icon: 'i-lucide-file-badge',
    link: '/payroll/tax-statuses',
    category: 'employee',
    permission: 'payroll.view_taxstatus',
    order: 10,
    keywords: ['ptkp', 'tk', 'k/1', 'status', 'tanggungan'],
  },
]
