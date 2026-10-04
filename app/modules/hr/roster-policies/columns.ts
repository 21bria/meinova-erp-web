import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { RosterPoliciesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: RosterPoliciesRow) => void
  onDelete?: (row: RosterPoliciesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getRosterPoliciesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<RosterPoliciesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<RosterPoliciesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.roster-policies.fields.is_active", "Is active")),
      column.text("company_name", resourceLabel("hr.roster-policies.fields.company", "Company")),
      column.text("location_name", resourceLabel("hr.roster-policies.fields.location", "Site / Location")),
      column.text("code", resourceLabel("hr.roster-policies.fields.code", "Code")),
      column.text("name", resourceLabel("hr.roster-policies.fields.name", "Name")),
      column.status("is_default", resourceLabel("hr.roster-policies.fields.is_default", "Default For This Site")),
      column.text("cycle_work_days", resourceLabel("hr.roster-policies.fields.cycle_work_days", "Work Days")),
      column.text("cycle_off_days", resourceLabel("hr.roster-policies.fields.cycle_off_days", "Field Break Days")),
      column.text("min_rest_hours", resourceLabel("hr.roster-policies.fields.min_rest_hours", "Minimum Rest (hours)")),
      column.text("default_travel_out_days", resourceLabel("hr.roster-policies.fields.default_travel_out_days", "Default Travel Out (days)")),
      column.text("default_travel_in_days", resourceLabel("hr.roster-policies.fields.default_travel_in_days", "Default Travel In (days)")),
      column.text("travel_day_mode", resourceLabel("hr.roster-policies.fields.travel_day_mode", "Travel Day Mode")),
      column.status("credit_enabled", resourceLabel("hr.roster-policies.fields.credit_enabled", "Enable Rotation Credit")),
      column.text("request_lead_days", resourceLabel("hr.roster-policies.fields.request_lead_days", "Request Lead Time (days)")),
      column.text("cycle_length", resourceLabel("hr.roster-policies.fields.cycle_length", "Cycle Length (days)")),

    ],
  })
}