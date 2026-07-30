import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"
import type { SessionRow } from "./types"

type ColumnActions = {
  onEdit: (row: SessionRow) => void
  onDelete: (row: SessionRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getSessionColumns(
  actions: ColumnActions,
  opts: ColumnOptions = {},
): ColumnDef<SessionRow>[] {
  const role = opts.role ?? "SITE_USER"
  const canMutate = role !== "VIEWER"

  return createColumns<SessionRow>({
    selectable: true,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Active"),
      column.text("user_name", "User"),
      column.text("ip_address", "IP Address"),
      column.text("browser", "Browser"),
      column.text("operating_system", "Operating System"),
      column.datetime("last_activity", "Last Activity"),
      column.datetime("expires_at", "Expires"),
    ],
  })
}