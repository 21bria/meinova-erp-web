export type CandidateInterviewsRow = {
  id: number
  is_active: boolean
  candidate: number | null
  candidate_name?: string | null
  interview_type: number | null
  interview_type_name?: string | null
  stage: string
  scheduled_at: string
  interviewer: number | null
  interviewer_name?: string | null
  result: string
  score: string
  notes: string
  candidate_number: string
  result_label: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type CandidateInterviewsPayload = {
  id?: number
  is_active: boolean
  candidate: number | null
  interview_type: number | null
  stage: string
  scheduled_at: string
  interviewer: number | null
  result: string
  score: string
  notes: string
}