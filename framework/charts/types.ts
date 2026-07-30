export type ChartPointPayload = {
  label?: string
  name?: string
  value?: number | string
  seriesName?: string
  data?: Record<string, any>
  raw?: any
}

export type ChartSummaryItem = {
  label: string
  value: string | number
}

export type ChartSummary = {
  title?: string
  description?: string
  items: ChartSummaryItem[]
}