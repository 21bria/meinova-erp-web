import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { EmailTemplatesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: EmailTemplatesRow) => void
  onDelete?: (row: EmailTemplatesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getEmailTemplatesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<EmailTemplatesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<EmailTemplatesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("administration.email-templates.fields.is_active", "Active")),
      column.text("event_label", resourceLabel("administration.email-templates.fields.event", "Event")),
      column.text("company_name", resourceLabel("administration.email-templates.fields.company", "Company")),
      column.text("name", resourceLabel("administration.email-templates.fields.name", "Note")),
      column.text("subject", resourceLabel("administration.email-templates.fields.subject", "Subject")),

    ],
  })
}