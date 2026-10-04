import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

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
      column.status("is_active", resourceLabel("references.bank.bank-branches.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.bank.bank-branches.fields.code", "Code")),
      column.text("name", resourceLabel("references.bank.bank-branches.fields.name", "Name")),
      column.text("branch_code", resourceLabel("references.bank.bank-branches.fields.branch_code", "Branch Code")),
      column.text("phone", resourceLabel("references.bank.bank-branches.fields.phone", "Phone")),
      column.text("email", resourceLabel("references.bank.bank-branches.fields.email", "Email")),
      column.text("contact_person", resourceLabel("references.bank.bank-branches.fields.contact_person", "Contact person")),
      column.status("is_head_office", resourceLabel("references.bank.bank-branches.fields.is_head_office", "Is head office")),
      column.text("bank_name", resourceLabel("references.bank.bank-branches.fields.bank", "Bank")),
      column.text("city_name", resourceLabel("references.bank.bank-branches.fields.city", "City")),
      column.text("swift_code", resourceLabel("references.bank.bank-branches.fields.swift_code", "SWIFT Code")),
    ],
  })
}