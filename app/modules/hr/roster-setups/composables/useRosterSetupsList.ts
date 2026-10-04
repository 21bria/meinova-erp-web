import {
  useCrud,
} from "@framework"

import {
  rosterSetupsConfig,
} from "../table"

import type {
  RosterSetupsRow,
} from "../types"

export function useRosterSetupsList() {
  const crud = useCrud<RosterSetupsRow>({
    ...rosterSetupsConfig,
    name: rosterSetupsConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: RosterSetupsRow,
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