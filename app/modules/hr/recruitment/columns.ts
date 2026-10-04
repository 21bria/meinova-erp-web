import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { RecruitmentRow } from "./types"

type ColumnActions = {
  onEdit?: (row: RecruitmentRow) => void
  onDelete?: (row: RecruitmentRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getRecruitmentColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<RecruitmentRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<RecruitmentRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.recruitment.fields.is_active", "Is active")),
      column.text("code", resourceLabel("hr.recruitment.fields.code", "Code")),
      column.text("title", resourceLabel("hr.recruitment.fields.title", "Title")),
      column.text("company_name", resourceLabel("hr.recruitment.fields.company", "Company")),
      column.text("department_name", resourceLabel("hr.recruitment.fields.department", "Department")),
      column.text("position_name", resourceLabel("hr.recruitment.fields.position", "Position")),
      column.text("employment_type_name", resourceLabel("hr.recruitment.fields.employment_type", "Employment Type")),
      column.text("quota", resourceLabel("hr.recruitment.fields.quota", "Quota")),
      column.date("open_date", resourceLabel("hr.recruitment.fields.open_date", "Open Date")),
      column.date("close_date", resourceLabel("hr.recruitment.fields.close_date", "Close Date")),
      column.text("status_label", resourceLabel("hr.recruitment.fields.status", "Status")),
      column.text("candidate_count", resourceLabel("hr.recruitment.fields.candidate_count", "Candidates")),

    ],
  })
}