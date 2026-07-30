export type ApprovalsRow = {
  id: number
  instance: number | null
  instance_name?: string | null
  step: number | null
  step_name?: string | null
  approver: number | null
  approver_name?: string | null
  status: string
  notes: string
  acted_at: string
  id: string
}

export type ApprovalsPayload = {
  id?: number
  instance: number | null
  step: number | null
  approver: number | null
  notes: string
}