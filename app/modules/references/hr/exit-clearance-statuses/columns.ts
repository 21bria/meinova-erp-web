import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { ExitClearanceStatusesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: ExitClearanceStatusesRow) => void
  onDelete?: (row: ExitClearanceStatusesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getExitClearanceStatusesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<ExitClearanceStatusesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<ExitClearanceStatusesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.exit-clearance-statuses.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.exit-clearance-statuses.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.exit-clearance-statuses.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.exit-clearance-statuses.fields.sort_order", "Sort order")),
    ],
  })
}