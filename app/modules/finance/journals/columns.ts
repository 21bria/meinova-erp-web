import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { JournalsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: JournalsRow) => void
  onDelete?: (row: JournalsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getJournalsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<JournalsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<JournalsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("company_name", resourceLabel("finance.journals.fields.company", "Company")),
      column.text("journal_number", resourceLabel("finance.journals.fields.journal_number", "Journal No.")),
      column.text("journal_type_label", resourceLabel("finance.journals.fields.journal_type", "Journal Type")),
      column.date("posting_date", resourceLabel("finance.journals.fields.posting_date", "Posting Date")),
      column.text("description", resourceLabel("finance.journals.fields.description", "Description")),
      column.text("status_label", resourceLabel("finance.journals.fields.status", "Status")),
      column.text("total_debit", resourceLabel("finance.journals.fields.total_debit", "Total Debit")),
      column.text("total_credit", resourceLabel("finance.journals.fields.total_credit", "Total Credit")),

    ],
  })
}