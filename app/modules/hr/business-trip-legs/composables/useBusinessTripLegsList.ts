import {
  useCrud,
} from "@framework"

import {
  businessTripLegsConfig,
} from "../table"

import type {
  BusinessTripLegsRow,
} from "../types"

export function useBusinessTripLegsList() {
  const crud = useCrud<BusinessTripLegsRow>({
    ...businessTripLegsConfig,
    name: businessTripLegsConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: BusinessTripLegsRow,
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