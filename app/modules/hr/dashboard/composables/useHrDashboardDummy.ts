// composables/useHrDashboardDummy.ts
type TrendDirection = 'up' | 'down'

type StatCardData = {
  label: string
  value: string
  trend?: {
    value: number
    direction: TrendDirection
    period: string
  }
}

type ChartSeriesPoint = {
  label: string
  value: number
}

type DonutChartSegment = {
  label: string
  value: number
  percentage: number
  color?: string
}

type LeaveRecapItem = {
  label: string
  count: number
  color?: string
}

type RecentSubmissionItem = {
  id: number
  name: string
  type: string
  date: string
  status: 'approved' | 'pending'
  avatarUrl?: string
}

export function useHrDashboardDummy() {
  const statCards: StatCardData[] = [
    {
      label: 'Total Pegawai',
      value: '1.254',
      trend: { value: 3.45, direction: 'up', period: 'dari bulan lalu' },
    },
    {
      label: 'Kehadiran (Rata-rata)',
      value: '96,2%',
      trend: { value: 2.15, direction: 'up', period: 'dari bulan lalu' },
    },
    {
      label: 'Cuti Aktif',
      value: '42',
      trend: { value: 5.66, direction: 'down', period: 'dari bulan lalu' },
    },
    {
      label: 'Kinerja Tercapai',
      value: '89,3%',
      trend: { value: 4.32, direction: 'up', period: 'dari bulan lalu' },
    },
    {
      label: 'Turnover Rate',
      value: '2,18%',
      trend: { value: 0.35, direction: 'down', period: 'dari bulan lalu' },
    },
    {
      label: 'Total Payroll',
      value: 'Rp 3,24 M',
      trend: { value: 6.21, direction: 'up', period: 'dari bulan lalu' },
    },
  ]

  const attendanceMonthly: ChartSeriesPoint[] = [
    { label: 'Jan', value: 92 },
    { label: 'Feb', value: 94 },
    { label: 'Mar', value: 91 },
    { label: 'Apr', value: 95 },
    { label: 'Mei', value: 96.2 },
    { label: 'Jun', value: 93 },
    { label: 'Jul', value: 94.5 },
  ]

  const employeeByDivision: DonutChartSegment[] = [
    { label: 'Direktorat Operasional', value: 412, percentage: 32.85, color: '#3b82f6' },
    { label: 'Direktorat Keuangan', value: 289, percentage: 23.05, color: '#8b5cf6' },
    { label: 'Direktorat SDM', value: 182, percentage: 14.52, color: '#10b981' },
    { label: 'Direktorat Teknologi', value: 164, percentage: 13.08, color: '#38bdf8' },
    { label: 'Direktorat Pemasaran', value: 120, percentage: 9.57, color: '#a855f7' },
    { label: 'Lainnya', value: 87, percentage: 6.93, color: '#9ca3af' },
  ]

  const employeeByEducation: ChartSeriesPoint[] = [
    { label: 'SMA/SMK', value: 152 },
    { label: 'D3', value: 198 },
    { label: 'S1', value: 652 },
    { label: 'S2', value: 210 },
    { label: 'S3', value: 42 },
  ]

  const leaveRecap: LeaveRecapItem[] = [
    { label: 'Cuti Tahunan', count: 28, color: '#3b82f6' },
    { label: 'Cuti Sakit', count: 7, color: '#10b981' },
    { label: 'Cuti Khusus', count: 4, color: '#f59e0b' },
    { label: 'Cuti Melahirkan', count: 3, color: '#a855f7' },
  ]

  const recentSubmissions: RecentSubmissionItem[] = [
    { id: 1, name: 'Andi Kurniawan', type: 'Cuti Tahunan', date: '20 Mei 2024', status: 'approved' },
    { id: 2, name: 'Siti Rahmawati', type: 'Izin Sakit', date: '19 Mei 2024', status: 'pending' },
    { id: 3, name: 'Budi Santoso', type: 'Cuti Tahunan', date: '18 Mei 2024', status: 'approved' },
    { id: 4, name: 'Dewi Lestari', type: 'Izin Dinas', date: '17 Mei 2024', status: 'approved' },
  ]

  return {
    statCards,
    attendanceMonthly,
    employeeByDivision,
    employeeByEducation,
    leaveRecap,
    recentSubmissions,
  }
}