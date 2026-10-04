import {
  useCrud,
} from "@framework"

import {
  payrollPeriodsConfig,
} from "../table"

import type {
  PayrollPeriodsRow,
} from "../types"

export function usePayrollPeriodsList() {
  const crud = useCrud<PayrollPeriodsRow>({
    ...payrollPeriodsConfig,
    name: payrollPeriodsConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: PayrollPeriodsRow,
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