import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { PermissionsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: PermissionsRow) => void
  onDelete?: (row: PermissionsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getPermissionsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<PermissionsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<PermissionsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("name", resourceLabel("administration.security.permissions.fields.name", "Permission")),
      column.text("code", resourceLabel("administration.security.permissions.fields.code", "Codename")),
      column.text("module", resourceLabel("administration.security.permissions.fields.module", "Module")),
      column.text("model", resourceLabel("administration.security.permissions.fields.model", "Object")),
    ],
  })
}