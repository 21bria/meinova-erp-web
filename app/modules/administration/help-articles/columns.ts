import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { HelpArticlesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: HelpArticlesRow) => void
  onDelete?: (row: HelpArticlesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getHelpArticlesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<HelpArticlesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<HelpArticlesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("administration.help-articles.fields.is_active", "Is active")),
      column.text("category_name", resourceLabel("administration.help-articles.fields.category", "Category")),
      column.text("title", resourceLabel("administration.help-articles.fields.title", "Title")),
      column.text("summary", resourceLabel("administration.help-articles.fields.summary", "Summary")),
      column.text("route_prefix", resourceLabel("administration.help-articles.fields.route_prefix", "Related Screen")),
      column.text("role_name", resourceLabel("administration.help-articles.fields.role", "Visible To Role")),
      column.text("status_label", resourceLabel("administration.help-articles.fields.status", "Status")),
      column.text("sort_order", resourceLabel("administration.help-articles.fields.sort_order", "Sort Order")),
      column.text("view_count", resourceLabel("administration.help-articles.fields.view_count", "Views")),
      column.text("helpful_count", resourceLabel("administration.help-articles.fields.helpful_count", "Helpful")),
      column.text("not_helpful_count", resourceLabel("administration.help-articles.fields.not_helpful_count", "Not Helpful")),

    ],
  })
}