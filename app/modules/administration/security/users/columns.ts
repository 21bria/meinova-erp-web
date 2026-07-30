import type { ColumnDef } from "@tanstack/vue-table"

import type { UserRole } from "@/utils/roles"

import { column, createColumns } from "@framework"

export type UserRow = {
  id: number
  username: string
  email?: string | null
  first_name?: string | null
  last_name?: string | null
  is_active: boolean
  is_staff?: boolean
}

type ColumnActions = {
  onEdit: (row: UserRow) => void
  onDelete: (row: UserRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getUserColumns(

  actions: ColumnActions,

  opts: ColumnOptions = {},

): ColumnDef<UserRow>[] {

  const role = opts.role ?? "USER"

  const canMutate = role !== "VIEWER"

  return createColumns<UserRow>({

    selectable: true,

    canMutate,

    actions,

    items: [

      column.text("username", "Username"),

      column.text("email", "Email"),

      column.text("first_name", "First Name"),

      column.text("last_name", "Last Name"),

      column.status("is_active"),

    ],

  })

}