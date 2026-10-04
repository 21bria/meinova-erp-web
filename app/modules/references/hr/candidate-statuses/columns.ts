import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { CandidateStatusesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: CandidateStatusesRow) => void
  onDelete?: (row: CandidateStatusesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getCandidateStatusesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<CandidateStatusesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<CandidateStatusesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.candidate-statuses.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.candidate-statuses.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.candidate-statuses.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.candidate-statuses.fields.sort_order", "Sort order")),
    ],
  })
}