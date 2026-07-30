import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { ApprovalsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: ApprovalsRow) => void
  onDelete?: (row: ApprovalsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getApprovalsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<ApprovalsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<ApprovalsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("instance_name", "Instance"),
      column.text("step_name", "Step"),
      column.text("approver_name", "Approver"),
      column.text("status", "Status"),
      column.text("acted_at", "Acted at"),
    ],
  })
}