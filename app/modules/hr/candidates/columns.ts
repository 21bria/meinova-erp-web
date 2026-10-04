import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { CandidatesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: CandidatesRow) => void
  onDelete?: (row: CandidatesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getCandidatesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<CandidatesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<CandidatesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.candidates.fields.is_active", "Is active")),
      column.text("candidate_number", resourceLabel("hr.candidates.fields.candidate_number", "Candidate Number")),
      column.text("vacancy_title", resourceLabel("hr.candidates.fields.vacancy", "Vacancy")),
      column.text("full_name", resourceLabel("hr.candidates.fields.full_name", "Full Name")),
      column.text("email", resourceLabel("hr.candidates.fields.email", "Email")),
      column.text("phone", resourceLabel("hr.candidates.fields.phone", "Phone")),
      column.text("education_name", resourceLabel("hr.candidates.fields.education", "Education")),
      column.text("source_name", resourceLabel("hr.candidates.fields.source", "Source")),
      column.text("status_name", resourceLabel("hr.candidates.fields.status", "Status")),
      column.date("applied_date", resourceLabel("hr.candidates.fields.applied_date", "Applied Date")),

    ],
  })
}