import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { TrainingParticipantsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: TrainingParticipantsRow) => void
  onDelete?: (row: TrainingParticipantsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getTrainingParticipantsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<TrainingParticipantsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<TrainingParticipantsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.training-participants.fields.is_active", "Is active")),
      column.text("program_name", resourceLabel("hr.training-participants.fields.program", "Program")),
      column.text("employee_name", resourceLabel("hr.training-participants.fields.employee", "Employee")),
      column.text("employee_number", resourceLabel("hr.training-participants.fields.employee_number", "Employee No.")),
      column.text("status_label", resourceLabel("hr.training-participants.fields.status", "Status")),
      column.text("score", resourceLabel("hr.training-participants.fields.score", "Score")),
      column.status("is_passed", resourceLabel("hr.training-participants.fields.is_passed", "Passed")),
      column.text("certificate_number", resourceLabel("hr.training-participants.fields.certificate_number", "Certificate Number")),
    ],
  })
}