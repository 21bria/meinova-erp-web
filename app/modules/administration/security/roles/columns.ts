import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { RolesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: RolesRow) => void
  onDelete?: (row: RolesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getRolesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<RolesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<RolesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("administration.security.roles.fields.is_active", "Is active")),
      column.text("code", resourceLabel("administration.security.roles.fields.code", "Code")),
      column.text("name", resourceLabel("administration.security.roles.fields.name", "Name")),
      // Kolom cakupan lama dibuang di Stage 4I: backend tidak
      // mengirimnya lagi, dan sebelum itu pun ia tidak menentukan
      // akses siapa pun. WHERE yang berlaku ada di tab User Roles.
    ],
  })
}