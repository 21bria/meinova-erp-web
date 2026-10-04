import {
  useCrud,
} from "@framework"

import {
  definitionsConfig,
} from "../table"

import type {
  DefinitionsRow,
} from "../types"

export function useDefinitionsList() {
  const crud = useCrud<DefinitionsRow>({
    ...definitionsConfig,
    name: definitionsConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: DefinitionsRow,
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