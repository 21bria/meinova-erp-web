import {
  BarChart3,
  Bell,
  Building2,
  Clock3,
  FileText,
  Package,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-vue-next'

import type { DashboardWorkspace } from './types'

export const dashboardDummy: DashboardWorkspace = {
  kpis: [
    {
      code: 'companies',
      title: 'Total Companies',
      value: 4,
      change: 25,
      trend: 'up',
      icon: Building2,
      color: 'text-blue-600',
    },
    {
      code: 'employees',
      title: 'Active Employees',
      value: 248,
      change: 8,
      trend: 'up',
      icon: Users,
      color: 'text-emerald-600',
    },
    {
      code: 'approval',
      title: 'Pending Approval',
      value: 12,
      change: -3,
      trend: 'down',
      icon: Clock3,
      color: 'text-orange-600',
    },
    {
      code: 'payroll',
      title: 'Monthly Payroll',
      value: 'Rp 1.2B',
      change: 6,
      trend: 'up',
      icon: Wallet,
      color: 'text-violet-600',
    },
  ],

  charts: [
    {
      code: 'revenue-expense',
      title: 'Revenue vs Expense',
      type: 'area',
      height: 320,
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      series: [
        { name: 'Revenue', data: [920, 1100, 980, 1250, 1420, 1580] },
        { name: 'Expense', data: [610, 720, 690, 810, 860, 930] },
      ],
    },
    {
      code: 'approval-status',
      title: 'Approval Status',
      type: 'donut',
      height: 320,
      series: [12, 48, 5],
      categories: ['Pending', 'Approved', 'Rejected'],
    },
  ],

  favoriteMenus: [
    { code: 'employee-master', title: 'Employee Master', description: 'HR', href: '/hr/employees', icon: Users, position: 1 },
    { code: 'payroll-run', title: 'Payroll Run', description: 'Payroll', href: '/payroll/runs', icon: Wallet, position: 2 },
    { code: 'purchase-request', title: 'Purchase Request', description: 'SCM', href: '/scm/purchase-requests', icon: Package, position: 3 },
    { code: 'journal-entry', title: 'Journal Entry', description: 'Finance', href: '/finance/journals', icon: FileText, position: 4 },
  ],

  favoriteApps: [
    { code: 'organization', title: 'Organization', description: 'Company, branch, department', href: '/organization', icon: Building2, color: 'from-blue-500/15 to-cyan-500/5 text-blue-600', favorite: true, position: 1 },
    { code: 'hr', title: 'HR', description: 'Employees, attendance, leave', href: '/hr', icon: Users, color: 'from-emerald-500/15 to-green-500/5 text-emerald-600', favorite: true, position: 2 },
    { code: 'payroll', title: 'Payroll', description: 'Salary, payslip, tax', href: '/payroll', icon: Wallet, color: 'from-violet-500/15 to-purple-500/5 text-violet-600', favorite: true, position: 3 },
    { code: 'scm', title: 'SCM', description: 'Procurement, inventory, warehouse', href: '/scm', icon: Package, color: 'from-orange-500/15 to-amber-500/5 text-orange-600', favorite: true, position: 4 },
    { code: 'finance', title: 'Finance', description: 'GL, AP, AR, cash bank', href: '/finance', icon: FileText, color: 'from-sky-500/15 to-blue-500/5 text-sky-600', favorite: true, position: 5 },
    { code: 'reports', title: 'Reports', description: 'Analytics and summaries', href: '/reports', icon: BarChart3, color: 'from-rose-500/15 to-pink-500/5 text-rose-600', favorite: true, position: 6 },
  ],

  quickActions: [
    { code: 'add-employee', title: 'Add Employee', href: '/hr/employees/create', icon: Users, color: 'text-emerald-600 bg-emerald-500/10' },
    { code: 'new-pr', title: 'New Purchase Request', href: '/scm/purchase-requests/create', icon: Package, color: 'text-orange-600 bg-orange-500/10' },
    { code: 'journal-entry', title: 'New Journal', href: '/finance/journals/create', icon: FileText, color: 'text-sky-600 bg-sky-500/10' },
    { code: 'open-report', title: 'Open Report', href: '/reports', icon: TrendingUp, color: 'text-violet-600 bg-violet-500/10' },
  ],

  notifications: [
    { id: '1', title: 'Payroll approvals waiting', description: '3 payroll approvals need review.', type: 'warning', created_at: 'Today', is_read: false },
    { id: '2', title: 'Purchase requests', description: '5 purchase requests need review.', type: 'info', created_at: 'Today', is_read: false },
    { id: '3', title: 'Monthly report ready', description: 'Finance report is ready to download.', type: 'success', created_at: 'Yesterday', is_read: true },
  ],

  workflows: [
    { id: '1', title: 'Leave Request', module: 'HR', requester: 'Sofia Davis', status: 'Pending', created_at: 'Today' },
    { id: '2', title: 'Purchase Request', module: 'SCM', requester: 'Jackson Lee', status: 'Pending', created_at: 'Today' },
    { id: '3', title: 'Payroll Run', module: 'Payroll', requester: 'Finance Team', status: 'Draft', created_at: 'Yesterday' },
  ],
}