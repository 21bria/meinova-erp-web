import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { __Name__Row } from "./types"

type ColumnActions = {
  onEdit?: (row: __Name__Row) => void
  onDelete?: (row: __Name__Row) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function get__Name__Columns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<__Name__Row>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<__Name__Row>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
__COLUMN_ITEMS__

    ],
  })
}