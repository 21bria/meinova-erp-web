import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { BankBranchesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: BankBranchesRow) => void
  onDelete?: (row: BankBranchesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getBankBranchesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<BankBranchesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<BankBranchesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Active"),
      column.text("code", "Code"),
      column.text("name", "Name"),
      column.text("branch_code", "Branch Code"),
      column.text("phone", "Phone"),
      column.text("email", "Email"),
      column.text("contact_person", "Contact person"),
      column.status("is_head_office", "Is head office"),
      column.text("bank_name", "Bank"),
      column.text("city_name", "City"),
      column.text("swift_code", "SWIFT Code"),
    ],
  })
}