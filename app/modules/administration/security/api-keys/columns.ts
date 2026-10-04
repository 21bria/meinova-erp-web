import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { ApiKeysRow } from "./types"

type ColumnActions = {
  onEdit?: (row: ApiKeysRow) => void
  onDelete?: (row: ApiKeysRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getApiKeysColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<ApiKeysRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<ApiKeysRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("administration.security.api-keys.fields.is_active", "Is active")),
      column.text("user_name", resourceLabel("administration.security.api-keys.fields.user", "User")),
      column.text("name", resourceLabel("administration.security.api-keys.fields.name", "Name")),
      column.text("prefix", resourceLabel("administration.security.api-keys.fields.prefix", "Prefix")),
      column.text("hashed_key", resourceLabel("administration.security.api-keys.fields.hashed_key", "Hashed key")),
      column.datetime("last_used_at", resourceLabel("administration.security.api-keys.fields.last_used_at", "Last used at")),
      column.datetime("expires_at", resourceLabel("administration.security.api-keys.fields.expires_at", "Expires at")),
    ],
  })
}