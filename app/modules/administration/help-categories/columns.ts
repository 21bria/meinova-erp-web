import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { HelpCategoriesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: HelpCategoriesRow) => void
  onDelete?: (row: HelpCategoriesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getHelpCategoriesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<HelpCategoriesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<HelpCategoriesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("administration.help-categories.fields.is_active", "Is active")),
      column.text("code", resourceLabel("administration.help-categories.fields.code", "Code")),
      column.text("name", resourceLabel("administration.help-categories.fields.name", "Name")),
      column.text("sort_order", resourceLabel("administration.help-categories.fields.sort_order", "Sort Order")),
      column.text("module", resourceLabel("administration.help-categories.fields.module", "Module")),
      column.status("is_published", resourceLabel("administration.help-categories.fields.is_published", "Published")),
      column.text("article_count", resourceLabel("administration.help-categories.fields.article_count", "Articles")),
    ],
  })
}