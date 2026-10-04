import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { RegisterRow } from "./types"

type ColumnActions = {
  onEdit?: (row: RegisterRow) => void
  onDelete?: (row: RegisterRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getRegisterColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<RegisterRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<RegisterRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("assets.register.fields.is_active", "is active")),
      column.text("company_name", resourceLabel("assets.register.fields.company", "Company")),
      column.text("asset_code", resourceLabel("assets.register.fields.asset_code", "Asset Code")),
      column.text("category_name", resourceLabel("assets.register.fields.category", "Category")),
      column.text("name", resourceLabel("assets.register.fields.name", "Name")),
      column.text("manufacturer", resourceLabel("assets.register.fields.manufacturer", "Manufacturer")),
      column.text("serial_number", resourceLabel("assets.register.fields.serial_number", "Serial Number")),
      column.text("condition", resourceLabel("assets.register.fields.condition", "Condition")),
      column.text("status", resourceLabel("assets.register.fields.status", "Status")),
      column.text("location_name", resourceLabel("assets.register.fields.location", "Location")),
      column.text("current_custody_name", resourceLabel("assets.register.fields.current_custody", "Current custody")),
      column.datetime("activated_at", resourceLabel("assets.register.fields.activated_at", "Activated at")),
      column.text("activated_by_name", resourceLabel("assets.register.fields.activated_by", "Activated by")),
      column.text("custody_type", resourceLabel("assets.register.fields.custody_type", "Custody")),
      column.text("custody_holder", resourceLabel("assets.register.fields.custody_holder", "Holder")),

    ],
  })
}