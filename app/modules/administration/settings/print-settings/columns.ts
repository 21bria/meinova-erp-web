import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { PrintSettingsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: PrintSettingsRow) => void
  onDelete?: (row: PrintSettingsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getPrintSettingsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<PrintSettingsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<PrintSettingsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("administration.settings.print-settings.fields.is_active", "Is active")),
      column.text("company_name", resourceLabel("administration.settings.print-settings.fields.company", "Company")),
      column.text("default_paper_size", resourceLabel("administration.settings.print-settings.fields.default_paper_size", "Default paper size")),
      column.text("default_orientation", resourceLabel("administration.settings.print-settings.fields.default_orientation", "Default orientation")),
      column.status("show_logo", resourceLabel("administration.settings.print-settings.fields.show_logo", "Show logo")),
      column.status("show_footer", resourceLabel("administration.settings.print-settings.fields.show_footer", "Show footer")),
    ],
  })
}