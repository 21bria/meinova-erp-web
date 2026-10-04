// app/registry/master-hub/payroll.ts
import type {
  MasterHubCategory,
  MasterHubItem,
} from '~/features/master-hub'

export const payrollMasterCategories: MasterHubCategory[] = [
  {
    key: 'payroll-setup',
    label: 'Payroll Setup',
    order: 10,
  },
  {
    key: 'salary-structure',
    label: 'Salary Structure',
    order: 20,
  },
  {
    key: 'compliance',
    label: 'Compliance',
    order: 30,
  },
  {
    key: 'templates',
    label: 'Templates',
    order: 40,
  },
]

export const payrollMasterItems: MasterHubItem[] = [
  {
    key: 'payroll-settings',
    title: 'Payroll Settings',
    description: 'Kebijakan penggajian per perusahaan, termasuk prorata gaji.',
    icon: 'i-lucide-sliders-horizontal',
    link: '/payroll/payroll-settings',
    category: 'payroll-setup',
    permission: 'payroll.view_payrollsetting',
    order: 5,
  },
  {
    // Aturan perhitungan per kelompok pegawai, di atas Payroll
    // Settings perusahaan. Ditaruh persis sesudahnya karena itu
    // urutan bacanya: default perusahaan dulu, baru pengecualiannya.
    key: 'payroll-policies',
    title: 'Payroll Policies',
    description:
      'Aturan perhitungan per kelompok pegawai: bulanan atau harian, prorata, potongan.',
    icon: 'i-lucide-scale',
    link: '/payroll/payroll-policies',
    category: 'payroll-setup',
    permission: 'payroll.view_payrollpolicy',
    order: 6,
  },
  {
    key: 'payroll-groups',
    title: 'Payroll Groups',
    description: 'Manage employee payroll grouping and pay frequency.',
    icon: 'i-lucide-users-round',
    link: '/payroll/payroll-groups',
    category: 'payroll-setup',
    permission: 'payroll.view_payrollgroup',
    order: 10,
  },
  {
    key: 'overtime-groups',
    title: 'Overtime Groups',
    description: 'Manage employee overtime groups and eligibility.',
    icon: 'i-lucide-clock-3',
    link: '/payroll/overtime-groups',
    category: 'payroll-setup',
    permission: 'payroll.view_overtimegroup',
    order: 20,
  },
  {
    // Tingkat pengali tinggal di layar sendiri, sama seperti Allowance
    // Component terhadap Allowance Template: layar master-nya memakai
    // editor dialog, dan mengubahnya jadi workspace bertab berarti
    // merombak layar yang sudah berjalan.
    key: 'overtime-group-tiers',
    title: 'Overtime Tiers',
    description: 'Configure tiered overtime multipliers per group.',
    icon: 'i-lucide-layers',
    link: '/payroll/overtime-group-tiers',
    category: 'payroll-setup',
    permission: 'payroll.view_overtimegrouptier',
    order: 21,
  },
  {
    key: 'salary-grades',
    title: 'Salary Grades',
    description: 'Manage salary grades and salary ranges.',
    icon: 'i-lucide-badge-dollar-sign',
    link: '/payroll/salary-grades',
    category: 'salary-structure',
    permission: 'payroll.view_salarygrade',
    order: 10,
  },
  {
    key: 'salary-levels',
    title: 'Salary Levels',
    description: 'Manage salary levels within each grade.',
    icon: 'i-lucide-layers-3',
    link: '/payroll/salary-levels',
    category: 'salary-structure',
    permission: 'payroll.view_salarylevel',
    order: 20,
  },
  {
    key: 'tax-statuses',
    title: 'Tax Statuses',
    description: 'Manage employee tax and PTKP statuses.',
    icon: 'i-lucide-file-badge',
    link: '/payroll/tax-statuses',
    category: 'compliance',
    permission: 'payroll.view_taxstatus',
    order: 10,
  },
  {
    key: 'allowance-templates',
    title: 'Allowance Templates',
    description: 'Manage reusable employee allowance templates.',
    icon: 'i-lucide-circle-plus',
    link: '/payroll/allowance-templates',
    category: 'templates',
    permission: 'payroll.view_allowancetemplate',
    order: 10,
  },
  {
    key: 'deduction-templates',
    title: 'Deduction Templates',
    description: 'Manage reusable employee deduction templates.',
    icon: 'i-lucide-circle-minus',
    link: '/payroll/deduction-templates',
    category: 'templates',
    permission: 'payroll.view_deductiontemplate',
    order: 20,
  },

  // Isi dari kedua template di atas. Layar tersendiri, bukan tab di
  // dalam halaman template-nya: halaman itu memakai editor dialog, dan
  // mengubahnya jadi workspace bertab berarti merombak layar master
  // yang sudah berjalan.
  {
    key: 'allowance-components',
    title: 'Allowance Components',
    description: 'Komponen dan nilai di dalam setiap Allowance Template.',
    icon: 'i-lucide-list-plus',
    link: '/payroll/allowance-components',
    category: 'templates',
    permission: 'payroll.view_allowancetemplateline',
    order: 30,
  },
  {
    key: 'deduction-components',
    title: 'Deduction Components',
    description: 'Komponen potongan, termasuk BPJS dan PPh21.',
    icon: 'i-lucide-list-minus',
    link: '/payroll/deduction-components',
    category: 'templates',
    permission: 'payroll.view_deductiontemplateline',
    order: 40,
  },

  {
    key: 'tax-brackets',
    title: 'Tax Brackets',
    description: 'Lapisan tarif PPh21 progresif (rupiah setahun).',
    icon: 'i-lucide-percent',
    link: '/payroll/tax-brackets',
    category: 'compliance',
    permission: 'payroll.view_payrolltaxbracket',
    order: 20,
  },
  {
    key: 'payroll-leave-rules',
    title: 'Payroll Leave Rules',
    description: 'Jenis cuti mana yang tidak dibayar.',
    icon: 'i-lucide-calendar-x',
    link: '/payroll/leave-rules',
    category: 'compliance',
    permission: 'payroll.view_payrollleaverule',
    order: 30,
  },
]
