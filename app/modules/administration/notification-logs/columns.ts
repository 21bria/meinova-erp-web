import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { NotificationLogsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: NotificationLogsRow) => void
  onDelete?: (row: NotificationLogsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getNotificationLogsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<NotificationLogsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<NotificationLogsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("event_label", resourceLabel("administration.notification-logs.fields.event", "Event")),
      column.text("recipient_email", resourceLabel("administration.notification-logs.fields.recipient_email", "Email")),
      column.text("recipient_name", resourceLabel("administration.notification-logs.fields.recipient_name", "Recipient")),
      column.text("channel_label", resourceLabel("administration.notification-logs.fields.channel", "Channel")),
      column.text("status_label", resourceLabel("administration.notification-logs.fields.status", "Status")),
      column.text("subject", resourceLabel("administration.notification-logs.fields.subject", "Subject")),
      column.text("detail", resourceLabel("administration.notification-logs.fields.detail", "Detail")),
      column.text("attempts", resourceLabel("administration.notification-logs.fields.attempts", "Attempts")),
      column.datetime("created_at", resourceLabel("administration.notification-logs.fields.created_at", "Time")),
    ],
  })
}