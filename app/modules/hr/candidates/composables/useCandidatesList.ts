import {
  useCrud,
} from "@framework"

import {
  candidatesConfig,
} from "../table"

import type {
  CandidatesRow,
} from "../types"

export function useCandidatesList() {
  const crud = useCrud<CandidatesRow>({
    ...candidatesConfig,
    name: candidatesConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: CandidatesRow,
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