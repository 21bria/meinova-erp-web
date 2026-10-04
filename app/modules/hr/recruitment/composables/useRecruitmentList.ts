import {
  useCrud,
} from "@framework"

import {
  recruitmentConfig,
} from "../table"

import type {
  RecruitmentRow,
} from "../types"

export function useRecruitmentList() {
  const crud = useCrud<RecruitmentRow>({
    ...recruitmentConfig,
    name: recruitmentConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: RecruitmentRow,
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