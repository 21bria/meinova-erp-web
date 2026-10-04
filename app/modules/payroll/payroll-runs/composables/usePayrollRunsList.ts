import {
  useCrud,
} from "@framework"

import {
  payrollRunsConfig,
} from "../table"

import type {
  PayrollRunsRow,
} from "../types"

export function usePayrollRunsList() {
  const crud = useCrud<PayrollRunsRow>({
    ...payrollRunsConfig,
    name: payrollRunsConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: PayrollRunsRow,
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