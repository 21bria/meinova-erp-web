import {
  useCrud,
} from "@framework"

import {
  returnsConfig,
} from "../table"

import type {
  ReturnsRow,
} from "../types"

export function useReturnsList() {
  const crud = useCrud<ReturnsRow>({
    ...returnsConfig,
    name: returnsConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: ReturnsRow,
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