import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { UsersRow } from "./types"

type ColumnActions = {
  onEdit?: (row: UsersRow) => void
  onDelete?: (row: UsersRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getUsersColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<UsersRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<UsersRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.datetime("last_login", resourceLabel("administration.security.users.fields.last_login", "Last Login")),
      column.status("is_superuser", resourceLabel("administration.security.users.fields.is_superuser", "Superuser")),
      column.text("username", resourceLabel("administration.security.users.fields.username", "Username")),
      column.text("first_name", resourceLabel("administration.security.users.fields.first_name", "First name")),
      column.text("last_name", resourceLabel("administration.security.users.fields.last_name", "Last name")),
      column.status("is_active", resourceLabel("administration.security.users.fields.is_active", "Active")),
      column.text("email", resourceLabel("administration.security.users.fields.email", "Email")),
      column.text("language", resourceLabel("administration.security.users.fields.language", "language")),
      column.text("full_name", resourceLabel("administration.security.users.fields.full_name", "Name")),
      column.text("role_names", resourceLabel("administration.security.users.fields.role_names", "Roles")),
    ],
  })
}