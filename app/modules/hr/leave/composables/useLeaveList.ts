import {
  useCrud,
} from "@framework"

import {
  leaveConfig,
} from "../table"

import type {
  LeaveRow,
} from "../types"

export function useLeaveList() {
  const crud = useCrud<LeaveRow>({
    ...leaveConfig,
    name: leaveConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: LeaveRow,
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