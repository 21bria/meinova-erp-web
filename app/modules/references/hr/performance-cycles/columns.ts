import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { PerformanceCyclesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: PerformanceCyclesRow) => void
  onDelete?: (row: PerformanceCyclesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getPerformanceCyclesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<PerformanceCyclesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<PerformanceCyclesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.performance-cycles.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.performance-cycles.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.performance-cycles.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.performance-cycles.fields.sort_order", "Sort order")),
    ],
  })
}