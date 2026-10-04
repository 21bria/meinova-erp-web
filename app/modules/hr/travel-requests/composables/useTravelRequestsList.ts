import {
  useCrud,
} from "@framework"

import {
  travelRequestsConfig,
} from "../table"

import type {
  TravelRequestsRow,
} from "../types"

export function useTravelRequestsList() {
  const crud = useCrud<TravelRequestsRow>({
    ...travelRequestsConfig,
    name: travelRequestsConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: TravelRequestsRow,
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