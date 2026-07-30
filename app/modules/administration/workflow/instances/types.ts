export type InstancesRow = {
  id: number
  workflow: number | null
  workflow_name?: string | null
  company: number | null
  company_name?: string | null
  site: number | null
  site_name?: string | null
  current_step: number | null
  current_step_name?: string | null
  object_type: string
  object_id: string
  object_repr: string
  requested_by: number | null
  requested_by_name?: string | null
  status: string
  completed_at: string
  id: string
  created_at: string
}

export type InstancesPayload = {
  id?: number
  workflow: number | null
  company: number | null
  site: number | null
  object_type: string
  object_id: string
  object_repr: string
  requested_by: number | null
}