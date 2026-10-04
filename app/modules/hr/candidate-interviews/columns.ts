import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { CandidateInterviewsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: CandidateInterviewsRow) => void
  onDelete?: (row: CandidateInterviewsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getCandidateInterviewsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<CandidateInterviewsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<CandidateInterviewsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.candidate-interviews.fields.is_active", "Is active")),
      column.text("candidate_name", resourceLabel("hr.candidate-interviews.fields.candidate", "Candidate")),
      column.text("interview_type_name", resourceLabel("hr.candidate-interviews.fields.interview_type", "Interview Type")),
      column.text("stage", resourceLabel("hr.candidate-interviews.fields.stage", "Stage")),
      column.datetime("scheduled_at", resourceLabel("hr.candidate-interviews.fields.scheduled_at", "Scheduled At")),
      column.text("interviewer_name", resourceLabel("hr.candidate-interviews.fields.interviewer", "Interviewer")),
      column.text("result_label", resourceLabel("hr.candidate-interviews.fields.result", "Result")),
      column.text("score", resourceLabel("hr.candidate-interviews.fields.score", "Score")),
    ],
  })
}