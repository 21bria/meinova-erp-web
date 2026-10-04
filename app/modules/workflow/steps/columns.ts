import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

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
      column.status("is_active", resourceLabel("workflow.steps.fields.is_active", "Is active")),
      column.text("definition_name", resourceLabel("workflow.steps.fields.definition", "Workflow")),
      column.text("sequence", resourceLabel("workflow.steps.fields.sequence", "Step")),
      column.text("name", resourceLabel("workflow.steps.fields.name", "Step Name")),
      column.text("approver_type_label", resourceLabel("workflow.steps.fields.approver_type", "Approver Type")),
      column.text("approver_role_name", resourceLabel("workflow.steps.fields.approver_role", "Role")),
      column.text("level", resourceLabel("workflow.steps.fields.level", "Level")),
      column.text("approver_scope_label", resourceLabel("workflow.steps.fields.approver_scope", "Role Scope")),
      column.status("is_required", resourceLabel("workflow.steps.fields.is_required", "Required")),
    ],
  })
}