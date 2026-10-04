import {
  useCrud,
} from "@framework"

import {
  siteRotationsConfig,
} from "../table"

import type {
  SiteRotationsRow,
} from "../types"

export function useSiteRotationsList() {
  const crud = useCrud<SiteRotationsRow>({
    ...siteRotationsConfig,
    name: siteRotationsConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: SiteRotationsRow,
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