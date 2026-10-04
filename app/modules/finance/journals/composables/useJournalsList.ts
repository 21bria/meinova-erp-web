import {
  useCrud,
} from "@framework"

import {
  journalsConfig,
} from "../table"

import type {
  JournalsRow,
} from "../types"

export function useJournalsList() {
  const crud = useCrud<JournalsRow>({
    ...journalsConfig,
    name: journalsConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: JournalsRow,
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