import type { NavMenu, NavMenuItems } from '~/types/nav'

export const appMenus = []

export const moduleMenus: Record<string, NavMenu[]> = {
  hr: [
    {
      heading: 'Human Resources',
      items: [
        { title: 'Dashboard', icon: 'i-lucide-layout-dashboard', link: '/hr' },
        { title: 'Employees', icon: 'i-lucide-users', link: '/hr/employees' },
        { title: 'Attendance', icon: 'i-lucide-calendar-check', link: '/hr/attendance' },
        { title: 'Leave', icon: 'i-lucide-clock-3', link: '/hr/leave' },
        { title: 'Overtime', icon: 'i-lucide-briefcase-business', link: '/hr/overtime' },
        { title: 'Training', icon: 'i-lucide-graduation-cap', link: '/hr/training' },
        { title: 'Recruitment', icon: 'i-lucide-user-plus', link: '/hr/recruitment' },
      ],
    },
  ],

  payroll: [
    {
      heading: 'Payroll',
      items: [
        {
          title: 'Dashboard',
          icon: 'i-lucide-layout-dashboard',
          link: '/payroll',
        },
      ],
    },

    {
      heading: 'Masters',
      items: [
        {
        title: 'Masters',
        icon: 'i-lucide-database',
        link: '/payroll/masters',
        },
      ],
    },

    {
      heading: 'Processing',
      items: [
        {
          title: 'Payroll Periods',
          icon: 'i-lucide-calendar-range',
          link: '/payroll/periods',
        },
        {
          title: 'Payroll Run',
          icon: 'i-lucide-calculator',
          link: '/payroll/runs',
        },
        {
          title: 'Payroll Adjustments',
          icon: 'i-lucide-sliders-horizontal',
          link: '/payroll/adjustments',
        },
        {
          title: 'Payslips',
          icon: 'i-lucide-receipt-text',
          link: '/payroll/payslips',
        },
      ],
    },

    {
      heading: 'Compliance',
      items: [
        {
          title: 'Tax',
          icon: 'i-lucide-file-text',
          link: '/payroll/tax',
        },
        {
          title: 'BPJS',
          icon: 'i-lucide-landmark',
          link: '/payroll/bpjs',
        },
      ],
    },

    {
      heading: 'Reports',
      items: [
        {
          title: 'Payroll Summary',
          icon: 'i-lucide-chart-column',
          link: '/payroll/reports/summary',
        },
        {
          title: 'Bank Transfer',
          icon: 'i-lucide-banknote-arrow-up',
          link: '/payroll/reports/bank-transfer',
        },
        {
          title: 'Tax Report',
          icon: 'i-lucide-file-chart-column',
          link: '/payroll/reports/tax',
        },
      ],
    },
  ],

  scm: [
    {
      heading: 'Supply Chain',
      items: [
        { title: 'Dashboard', icon: 'i-lucide-layout-dashboard', link: '/scm' },
        { title: 'Purchase Request', icon: 'i-lucide-clipboard-list', link: '/scm/purchase-requests', badge: '18' },
        { title: 'Purchase Order', icon: 'i-lucide-package-check', link: '/scm/purchase-orders' },
        { title: 'Vendors', icon: 'i-lucide-users-round', link: '/scm/vendors' },
        { title: 'Inventory', icon: 'i-lucide-boxes', link: '/scm/inventory' },
        { title: 'Warehouses', icon: 'i-lucide-warehouse', link: '/scm/warehouses' },
        { title: 'Stock Movement', icon: 'i-lucide-package', link: '/scm/stock-movement' },
        { title: 'Goods Receipt', icon: 'i-lucide-truck', link: '/scm/goods-receipt' },
      ],
    },
  ],

  finance: [
    {
      heading: 'Finance',
      items: [
        { title: 'Dashboard', icon: 'i-lucide-layout-dashboard', link: '/finance' },
        { title: 'Chart of Accounts', icon: 'i-lucide-book-open', link: '/finance/chart-of-accounts' },
        { title: 'Journal Entries', icon: 'i-lucide-file-text', link: '/finance/journals', badge: '12' },
        { title: 'Cash & Bank', icon: 'i-lucide-wallet', link: '/finance/cash-bank' },
        { title: 'Accounts Payable', icon: 'i-lucide-receipt', link: '/finance/ap' },
        { title: 'Accounts Receivable', icon: 'i-lucide-banknote', link: '/finance/ar' },
        { title: 'Budget', icon: 'i-lucide-file-bar-chart', link: '/finance/budget' },
        { title: 'Fixed Assets', icon: 'i-lucide-building-2', link: '/finance/fixed-assets' },
      ],
    },
  ],
    administration: [
    {
      heading: 'Administration',
      items: [
        { title: 'Dashboard', icon: 'i-lucide-layout-dashboard', link: '/administration' },
        { title: 'Organization', icon: 'i-lucide-building-2', link: '/administration/organization' },
        {title:  'Currency',icon: 'i-lucide-badge-dollar-sign',link:  '/administration/currency'},
        { title: 'Security', icon: 'i-lucide-shield-check', link: '/administration/security' },
        { title: 'Workflow', icon: 'i-lucide-git-branch', link: '/administration/workflow' },
        { title: 'Settings', icon: 'i-lucide-settings-2', link: '/administration/settings' },
        { title: 'Audit Trail', icon: 'i-lucide-history', link: '/administration/audit' },
        
      ],
    },
    {
      heading: 'References',
      items: [
        { title: 'Geography', icon: 'i-lucide-map', link: '/administration/master/geography' },
        { title: 'Organization', icon: 'i-lucide-building', link: '/administration/master/organization' },
        { title: 'Bank', icon: 'i-lucide-landmark', link: '/administration/master/bank' },
        { title: 'HR Reference', icon: 'i-lucide-user-cog', link: '/administration/master/hr' },
      ],
    },
  ],
}

export const navMenu: NavMenu[] = []

export const navMenuBottom: NavMenuItems = [
  { title: 'Help & Support', icon: 'i-lucide-circle-help', link: '#' },
  { title: 'Feedback', icon: 'i-lucide-send', link: '#' },
]