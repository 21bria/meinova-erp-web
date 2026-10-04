import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { InterviewTypesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: InterviewTypesRow) => void
  onDelete?: (row: InterviewTypesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getInterviewTypesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<InterviewTypesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<InterviewTypesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.interview-types.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.interview-types.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.interview-types.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.interview-types.fields.sort_order", "Sort order")),
    ],
  })
}