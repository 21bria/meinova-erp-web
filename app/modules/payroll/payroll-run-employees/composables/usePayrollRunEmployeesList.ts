import {
  useCrud,
} from "@framework"

import {
  payrollRunEmployeesConfig,
} from "../table"

import type {
  PayrollRunEmployeesRow,
} from "../types"

export function usePayrollRunEmployeesList() {
  const crud = useCrud<PayrollRunEmployeesRow>({
    ...payrollRunEmployeesConfig,
    name: payrollRunEmployeesConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: PayrollRunEmployeesRow,
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