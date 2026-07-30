import {
  useCrud,
} from "@framework"

import {
  __name__Config,
} from "../table"

import type {
  __Name__Row,
} from "../types"

export function use__Name__List() {
  const crud = useCrud<__Name__Row>({
    ...__name__Config,
    name: __name__Config.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: __Name__Row,
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