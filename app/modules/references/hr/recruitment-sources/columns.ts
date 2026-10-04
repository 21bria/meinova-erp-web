import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { RecruitmentSourcesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: RecruitmentSourcesRow) => void
  onDelete?: (row: RecruitmentSourcesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getRecruitmentSourcesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<RecruitmentSourcesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<RecruitmentSourcesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.recruitment-sources.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.recruitment-sources.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.recruitment-sources.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.recruitment-sources.fields.sort_order", "Sort order")),
    ],
  })
}