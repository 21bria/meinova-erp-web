import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { ExternalVisitorsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: ExternalVisitorsRow) => void
  onDelete?: (row: ExternalVisitorsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getExternalVisitorsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<ExternalVisitorsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<ExternalVisitorsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.external-visitors.fields.is_active", "Active")),
      column.text("visitor_number", resourceLabel("hr.external-visitors.fields.visitor_number", "Visitor ID")),
      column.text("full_name", resourceLabel("hr.external-visitors.fields.full_name", "Full Name")),
      column.text("identity_type_label", resourceLabel("hr.external-visitors.fields.identity_type", "Identity Type")),
      column.text("identity_number", resourceLabel("hr.external-visitors.fields.identity_number", "Identity Number")),
      column.text("mobile", resourceLabel("hr.external-visitors.fields.mobile", "Mobile")),
      column.text("organization_name", resourceLabel("hr.external-visitors.fields.organization_name", "Company / Institution")),
      column.text("city_name", resourceLabel("hr.external-visitors.fields.city", "City")),
      column.status("is_blacklisted", resourceLabel("hr.external-visitors.fields.is_blacklisted", "Blacklisted")),
      column.text("visit_count", resourceLabel("hr.external-visitors.fields.visit_count", "Total Visits")),
    ],
  })
}