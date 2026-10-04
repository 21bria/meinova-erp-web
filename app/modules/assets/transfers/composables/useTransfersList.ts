import {
  useCrud,
} from "@framework"

import {
  transfersConfig,
} from "../table"

import type {
  TransfersRow,
} from "../types"

export function useTransfersList() {
  const crud = useCrud<TransfersRow>({
    ...transfersConfig,
    name: transfersConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: TransfersRow,
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