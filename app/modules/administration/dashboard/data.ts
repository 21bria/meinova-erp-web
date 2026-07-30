export const kpiCards = [
  { label: 'Companies', value: '5', description: 'Registered companies', trend: '+2 this month', icon: 'Building2' },
  { label: 'Branches', value: '18', description: 'Operational branches', trend: '+4.2%', icon: 'Network' },
  { label: 'Sites', value: '42', description: 'Active work sites', trend: '+8.1%', icon: 'MapPin' },
  { label: 'Users', value: '286', description: 'System users', trend: '+12 new', icon: 'Users' },
  { label: 'Master Records', value: '1,245', description: 'Configured references', trend: '+96 records', icon: 'Database' },
  { label: 'Audit Today', value: '324', description: 'Recorded activities', trend: '+18%', icon: 'Activity' },
]

export const masterGrowth = [
  { month: 'Jan', records: 620 },
  { month: 'Feb', records: 710 },
  { month: 'Mar', records: 805 },
  { month: 'Apr', records: 920 },
  { month: 'May', records: 1040 },
  { month: 'Jun', records: 1145 },
  { month: 'Jul', records: 1245 },
]

export const configurationHealth = [
  { name: 'Organization', status: 'Ready', state: 'success' },
  { name: 'Geography', status: 'Ready', state: 'success' },
  { name: 'Bank References', status: 'Ready', state: 'success' },
  { name: 'Security Roles', status: 'Ready', state: 'success' },
  { name: 'Workflow Approval', status: 'Needs review', state: 'warning' },
  { name: 'Email Notification', status: 'Not configured', state: 'danger' },
]

export const organizationOverview = [
  { name: 'Companies', value: 5 },
  { name: 'Branches', value: 18 },
  { name: 'Sites', value: 42 },
  { name: 'Departments', value: 26 },
  { name: 'Positions', value: 74 },
]

export const recentActivities = [
  { title: 'Company profile updated', module: 'Organization', time: '09:12' },
  { title: 'New site created', module: 'Sites', time: '09:05' },
  { title: 'Bank branch imported', module: 'Bank', time: '08:54' },
  { title: 'Role permission changed', module: 'Security', time: '08:40' },
]

export const recentAuditLogs = [
  { time: '09:12', module: 'Organization', action: 'Update company', user: 'Admin', status: 'Success' },
  { time: '09:05', module: 'Sites', action: 'Create site', user: 'Admin', status: 'Success' },
  { time: '08:54', module: 'Bank', action: 'Import bank branch', user: 'Admin', status: 'Success' },
  { time: '08:40', module: 'Security', action: 'Update role', user: 'Super Admin', status: 'Success' },
]