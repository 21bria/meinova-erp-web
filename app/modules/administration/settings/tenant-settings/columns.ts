import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { TenantSettingsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: TenantSettingsRow) => void
  onDelete?: (row: TenantSettingsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getTenantSettingsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<TenantSettingsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<TenantSettingsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("administration.settings.tenant-settings.fields.is_active", "Is active")),
      column.text("company_name", resourceLabel("administration.settings.tenant-settings.fields.company", "Company")),
      column.text("currency_name", resourceLabel("administration.settings.tenant-settings.fields.currency", "Currency")),
      column.text("timezone", resourceLabel("administration.settings.tenant-settings.fields.timezone", "Timezone")),
      column.text("language", resourceLabel("administration.settings.tenant-settings.fields.language", "Language")),
      column.text("date_format", resourceLabel("administration.settings.tenant-settings.fields.date_format", "Date format")),
      column.text("decimal_separator", resourceLabel("administration.settings.tenant-settings.fields.decimal_separator", "Decimal separator")),
      column.text("thousand_separator", resourceLabel("administration.settings.tenant-settings.fields.thousand_separator", "Thousand separator")),
    ],
  })
}