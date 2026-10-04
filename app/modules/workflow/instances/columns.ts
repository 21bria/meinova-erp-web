import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { InstancesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: InstancesRow) => void
  onDelete?: (row: InstancesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getInstancesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<InstancesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<InstancesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("module", resourceLabel("workflow.instances.fields.module", "Module")),
      column.text("document_type", resourceLabel("workflow.instances.fields.document_type", "Document Type")),
      column.text("document_number", resourceLabel("workflow.instances.fields.document_number", "Document No.")),
      column.text("document_label", resourceLabel("workflow.instances.fields.document_label", "Document")),
      column.text("subject_name", resourceLabel("workflow.instances.fields.subject_employee", "Employee")),
      column.text("subject_number", resourceLabel("workflow.instances.fields.subject_number", "Employee No.")),
      column.text("status_label", resourceLabel("workflow.instances.fields.status", "Status")),
      column.datetime("submitted_at", resourceLabel("workflow.instances.fields.submitted_at", "Submitted At")),
      column.text("definition_name", resourceLabel("workflow.instances.fields.definition_name", "Workflow")),
      column.text("current_step_name", resourceLabel("workflow.instances.fields.current_step_name", "Waiting At")),
      column.text("company_name", resourceLabel("workflow.instances.fields.company_name", "Company")),
      column.text("location_name", resourceLabel("workflow.instances.fields.location_name", "Location")),

    ],
  })
}