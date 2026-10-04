import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { TrainingRow } from "./types"

type ColumnActions = {
  onEdit?: (row: TrainingRow) => void
  onDelete?: (row: TrainingRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getTrainingColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<TrainingRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<TrainingRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.training.fields.is_active", "Is active")),
      column.text("code", resourceLabel("hr.training.fields.code", "Code")),
      column.text("name", resourceLabel("hr.training.fields.name", "Program Name")),
      column.text("training_category_name", resourceLabel("hr.training.fields.training_category", "Category")),
      column.text("provider_name", resourceLabel("hr.training.fields.provider", "Provider")),
      column.date("start_date", resourceLabel("hr.training.fields.start_date", "Start Date")),
      column.date("end_date", resourceLabel("hr.training.fields.end_date", "End Date")),
      column.text("venue", resourceLabel("hr.training.fields.venue", "Venue")),
      column.text("quota", resourceLabel("hr.training.fields.quota", "Quota")),
      column.text("cost", resourceLabel("hr.training.fields.cost", "Cost")),
      column.text("status_label", resourceLabel("hr.training.fields.status", "Status")),
      column.status("is_mandatory", resourceLabel("hr.training.fields.is_mandatory", "Mandatory")),
      column.text("participant_count", resourceLabel("hr.training.fields.participant_count", "Participants")),

    ],
  })
}