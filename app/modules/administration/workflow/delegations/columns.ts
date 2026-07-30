import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { DelegationsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: DelegationsRow) => void
  onDelete?: (row: DelegationsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getDelegationsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<DelegationsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<DelegationsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Is active"),
      column.text("company_name", "Company"),
      column.text("site_name", "Site"),
      column.text("workflow_name", "Workflow"),
      column.text("delegator_name", "Delegator"),
      column.text("delegate_name", "Delegate"),
      column.text("start_date", "Start date"),
      column.text("end_date", "End date"),
      column.text("reason", "Reason"),
    ],
  })
}