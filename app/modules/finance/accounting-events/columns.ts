import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { AccountingEventsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: AccountingEventsRow) => void
  onDelete?: (row: AccountingEventsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getAccountingEventsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<AccountingEventsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<AccountingEventsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("event_type", resourceLabel("finance.accounting-events.fields.event_type", "Event Type")),
      column.text("source_module", resourceLabel("finance.accounting-events.fields.source_module", "Source Module")),
      column.text("source_type", resourceLabel("finance.accounting-events.fields.source_type", "Source Type")),
      column.text("source_id", resourceLabel("finance.accounting-events.fields.source_id", "Source ID")),
      column.text("company_name", resourceLabel("finance.accounting-events.fields.company", "Company")),
      column.date("event_date", resourceLabel("finance.accounting-events.fields.event_date", "Event Date")),
      column.text("status_label", resourceLabel("finance.accounting-events.fields.status", "Status")),
      column.text("journal_number", resourceLabel("finance.accounting-events.fields.journal_number", "Journal")),

    ],
  })
}