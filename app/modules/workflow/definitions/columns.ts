import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

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
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<DefinitionsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("workflow.definitions.fields.is_active", "Is active")),
      column.text("code", resourceLabel("workflow.definitions.fields.code", "Code")),
      column.text("name", resourceLabel("workflow.definitions.fields.name", "Name")),
      column.text("module", resourceLabel("workflow.definitions.fields.module", "Module")),
      column.text("document_type", resourceLabel("workflow.definitions.fields.document_type", "Document Type")),
      column.text("company_name", resourceLabel("workflow.definitions.fields.company", "Company")),
      column.text("location_name", resourceLabel("workflow.definitions.fields.location", "Location")),
      column.text("status_label", resourceLabel("workflow.definitions.fields.status", "Status")),
      column.text("specificity", resourceLabel("workflow.definitions.fields.specificity", "Priority Score")),
      column.text("scope_label", resourceLabel("workflow.definitions.fields.scope_label", "Applies To")),

    ],
  })
}