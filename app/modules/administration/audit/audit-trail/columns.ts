import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { AuditTrailRow } from "./types"

type ColumnActions = {
  onEdit?: (row: AuditTrailRow) => void
  onDelete?: (row: AuditTrailRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getAuditTrailColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<AuditTrailRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<AuditTrailRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("company_name", resourceLabel("administration.audit.audit-trail.fields.company", "Company")),
      column.text("location_name", resourceLabel("administration.audit.audit-trail.fields.location", "Location")),
      column.text("user_name", resourceLabel("administration.audit.audit-trail.fields.user", "User")),
      column.text("action", resourceLabel("administration.audit.audit-trail.fields.action", "Action")),
      column.text("module", resourceLabel("administration.audit.audit-trail.fields.module", "Module")),
      column.text("object_type", resourceLabel("administration.audit.audit-trail.fields.object_type", "Object Type")),
      column.text("object_id", resourceLabel("administration.audit.audit-trail.fields.object_id", "Object ID")),
      column.text("object_repr", resourceLabel("administration.audit.audit-trail.fields.object_repr", "Object")),
      column.text("ip_address", resourceLabel("administration.audit.audit-trail.fields.ip_address", "IP Address")),
      column.text("created_at", resourceLabel("administration.audit.audit-trail.fields.created_at", "Created At")),
    ],
  })
}