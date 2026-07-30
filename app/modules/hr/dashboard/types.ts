// framework/charts/types.ts

export interface ChartSeriesPoint {
  label: string
  value: number
}

export interface DonutChartSegment {
  label: string
  value: number
  percentage: number
  color?: string
}

export interface StatCardData {
  label: string
  value: string | number
  icon?: string
  trend?: {
    value: number // persentase, bisa negatif
    direction: 'up' | 'down'
    period: string // misal "dari bulan lalu"
  }
}

export interface LeaveRecapItem {
  label: string
  count: number
  color?: string
}

export interface RecentSubmissionItem {
  id: string | number
  name: string
  avatarUrl?: string
  type: string // "Cuti Tahunan", "Izin Sakit", dst
  date: string
  status: 'approved' | 'pending' | 'rejected'
}