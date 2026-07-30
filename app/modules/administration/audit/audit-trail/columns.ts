import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { AuditTrailRow } from "./types"

type ColumnActions = {
  onEdit?: (row: AuditTrailRow) => void
  onDelete?: (row: AuditTrailRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getAuditTrailColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<AuditTrailRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<AuditTrailRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("company_name", "Company"),
      column.text("site_name", "Site"),
      column.text("user_name", "User"),
      column.text("action", "Action"),
      column.text("module", "Module"),
      column.text("object_type", "Object Type"),
      column.text("object_id", "Object ID"),
      column.text("object_repr", "Object"),
      column.text("ip_address", "IP Address"),
    ],
  })
}