import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { NotificationRulesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: NotificationRulesRow) => void
  onDelete?: (row: NotificationRulesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getNotificationRulesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<NotificationRulesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<NotificationRulesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("administration.notification-rules.fields.is_active", "Active")),
      column.text("event_label", resourceLabel("administration.notification-rules.fields.event", "Event")),
      column.text("company_name", resourceLabel("administration.notification-rules.fields.company", "Company")),
      column.text("recipient_type_label", resourceLabel("administration.notification-rules.fields.recipient_type", "Recipient")),
      column.text("role_name", resourceLabel("administration.notification-rules.fields.role", "Role")),
      column.text("user_name", resourceLabel("administration.notification-rules.fields.user", "User")),
      column.status("send_in_app", resourceLabel("administration.notification-rules.fields.send_in_app", "Bell")),
      column.status("send_email", resourceLabel("administration.notification-rules.fields.send_email", "Email")),
    ],
  })
}