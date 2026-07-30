import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { StepsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: StepsRow) => void
  onDelete?: (row: StepsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getStepsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<StepsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<StepsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Is active"),
      column.text("workflow_name", "Workflow"),
      column.text("step_order", "Step order"),
      column.text("name", "Name"),
      column.text("approver_type", "Approver type"),
      column.text("approver_role", "Approver role"),
      column.text("approver_user_name", "Approver user"),
      column.status("require_all", "Require all"),
    ],
  })
}