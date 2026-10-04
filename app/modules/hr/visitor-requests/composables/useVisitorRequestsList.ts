import {
  useCrud,
} from "@framework"

import {
  visitorRequestsConfig,
} from "../table"

import type {
  VisitorRequestsRow,
} from "../types"

export function useVisitorRequestsList() {
  const crud = useCrud<VisitorRequestsRow>({
    ...visitorRequestsConfig,
    name: visitorRequestsConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: VisitorRequestsRow,
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