import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { VillagesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: VillagesRow) => void
  onDelete?: (row: VillagesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getVillagesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<VillagesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<VillagesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.geography.villages.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.geography.villages.fields.code", "Code")),
      column.text("name", resourceLabel("references.geography.villages.fields.name", "Name")),
      column.text("aid", resourceLabel("references.geography.villages.fields.aid", "Area ID")),
      column.text("district_name", resourceLabel("references.geography.villages.fields.district", "Kecamatan")),
    ],
  })
}