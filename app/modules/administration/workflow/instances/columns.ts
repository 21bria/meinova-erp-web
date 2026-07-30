import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { InstancesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: InstancesRow) => void
  onDelete?: (row: InstancesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getInstancesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<InstancesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<InstancesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("workflow_name", "Workflow"),
      column.text("company_name", "Company"),
      column.text("site_name", "Site"),
      column.text("current_step_name", "Current step"),
      column.text("object_type", "Object type"),
      column.text("object_id", "Object id"),
      column.text("object_repr", "Object repr"),
      column.text("requested_by_name", "Requested by"),
      column.text("status", "Status"),
      column.text("completed_at", "Completed at"),
    ],
  })
}