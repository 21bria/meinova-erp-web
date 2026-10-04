import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { LanguageProficienciesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: LanguageProficienciesRow) => void
  onDelete?: (row: LanguageProficienciesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getLanguageProficienciesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<LanguageProficienciesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<LanguageProficienciesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.language-proficiencies.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.language-proficiencies.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.language-proficiencies.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.language-proficiencies.fields.sort_order", "Sort order")),
    ],
  })
}