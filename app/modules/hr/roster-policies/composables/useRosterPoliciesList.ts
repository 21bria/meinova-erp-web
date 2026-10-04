import {
  useCrud,
} from "@framework"

import {
  rosterPoliciesConfig,
} from "../table"

import type {
  RosterPoliciesRow,
} from "../types"

export function useRosterPoliciesList() {
  const crud = useCrud<RosterPoliciesRow>({
    ...rosterPoliciesConfig,
    name: rosterPoliciesConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: RosterPoliciesRow,
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