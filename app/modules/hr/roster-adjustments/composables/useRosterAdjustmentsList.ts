import {
  useCrud,
} from "@framework"

import {
  rosterAdjustmentsConfig,
} from "../table"

import type {
  RosterAdjustmentsRow,
} from "../types"

export function useRosterAdjustmentsList() {
  const crud = useCrud<RosterAdjustmentsRow>({
    ...rosterAdjustmentsConfig,
    name: rosterAdjustmentsConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: RosterAdjustmentsRow,
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