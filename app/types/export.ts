// types/export.ts

export interface ExportResponse {
  job_id: string
}

export interface ExportJobStatus {
  id: string
  status: 'pending' | 'processing' | 'done' | 'failed'
  progress?: number
  file?: string
  error?: string
}