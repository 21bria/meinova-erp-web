import {
  useCrud,
} from "@framework"

import {
  helpArticlesConfig,
} from "../table"

import type {
  HelpArticlesRow,
} from "../types"

export function useHelpArticlesList() {
  const crud = useCrud<HelpArticlesRow>({
    ...helpArticlesConfig,
    name: helpArticlesConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: HelpArticlesRow,
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