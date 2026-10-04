import {
  useCrud,
} from "@framework"

import {
  assignmentsConfig,
} from "../table"

import type {
  AssignmentsRow,
} from "../types"

export function useAssignmentsList() {
  const crud = useCrud<AssignmentsRow>({
    ...assignmentsConfig,
    name: assignmentsConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: AssignmentsRow,
  ) {
    return row
  }

  return {
    crud,

    rows: crud.rows,
    total: crud.total,
    page: crud.page,
    pageSize: crud.pageSize,
    search: crud.search,
    pending: crud.pending,
    ui: crud.ui,

    refresh,
    selectRow,

    onSearch: crud.onSearch,
    onApply: crud.onApply,
    onReset: crud.onReset,
    onChangePage: crud.onChangePage,
    onChangePageSize: crud.onChangePageSize,
    onSort: crud.onSort,
  }
}