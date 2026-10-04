import {
  useCrud,
} from "@framework"

import {
  registerConfig,
} from "../table"

import type {
  RegisterRow,
} from "../types"

export function useRegisterList() {
  const crud = useCrud<RegisterRow>({
    ...registerConfig,
    name: registerConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: RegisterRow,
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