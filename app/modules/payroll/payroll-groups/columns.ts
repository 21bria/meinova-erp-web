import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { PayrollGroupsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: PayrollGroupsRow) => void
  onDelete?: (row: PayrollGroupsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getPayrollGroupsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<PayrollGroupsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<PayrollGroupsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("code", "Code"),
      column.text("name", "Name"),
      column.text("pay_frequency", "Pay frequency"),
      column.status("is_active", "Is active"),
    ],
  })
}