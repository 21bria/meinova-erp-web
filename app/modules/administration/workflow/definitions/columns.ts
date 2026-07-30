import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { DefinitionsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: DefinitionsRow) => void
  onDelete?: (row: DefinitionsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getDefinitionsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<DefinitionsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<DefinitionsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Is active"),
      column.text("company_name", "Company"),
      column.text("module", "Module"),
      column.text("document_type", "Document type"),
      column.text("name", "Name"),
    ],
  })
}