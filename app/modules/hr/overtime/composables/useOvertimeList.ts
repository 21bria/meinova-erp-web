import {
  useCrud,
} from "@framework"

import {
  overtimeConfig,
} from "../table"

import type {
  OvertimeRow,
} from "../types"

export function useOvertimeList() {
  const crud = useCrud<OvertimeRow>({
    ...overtimeConfig,
    name: overtimeConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: OvertimeRow,
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