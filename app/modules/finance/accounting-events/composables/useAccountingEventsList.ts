import {
  useCrud,
} from "@framework"

import {
  accountingEventsConfig,
} from "../table"

import type {
  AccountingEventsRow,
} from "../types"

export function useAccountingEventsList() {
  const crud = useCrud<AccountingEventsRow>({
    ...accountingEventsConfig,
    name: accountingEventsConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: AccountingEventsRow,
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