import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { PerformanceTemplatesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: PerformanceTemplatesRow) => void
  onDelete?: (row: PerformanceTemplatesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getPerformanceTemplatesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<PerformanceTemplatesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<PerformanceTemplatesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.performance-templates.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.performance-templates.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.performance-templates.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.performance-templates.fields.sort_order", "Sort order")),
    ],
  })
}