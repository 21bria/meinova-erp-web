import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

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
      column.status("is_active", resourceLabel("workflow.delegations.fields.is_active", "Active")),
      column.text("delegator_name", resourceLabel("workflow.delegations.fields.delegator", "Delegator")),
      column.text("delegate_name", resourceLabel("workflow.delegations.fields.delegate", "Delegate")),
      column.text("module", resourceLabel("workflow.delegations.fields.module", "Module")),
      column.text("document_type", resourceLabel("workflow.delegations.fields.document_type", "Document Type")),
      column.datetime("starts_at", resourceLabel("workflow.delegations.fields.starts_at", "Starts")),
      column.datetime("ends_at", resourceLabel("workflow.delegations.fields.ends_at", "Ends")),
      column.status("is_running", resourceLabel("workflow.delegations.fields.is_running", "Currently Active")),
    ],
  })
}