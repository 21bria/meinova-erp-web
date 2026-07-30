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
]