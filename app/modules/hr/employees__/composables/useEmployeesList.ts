import {
  useCrud,
} from "@framework"

import {
  employeesConfig,
} from "../table"

import type {
  EmployeesRow,
} from "../types"

export function useEmployeesList() {
  const crud = useCrud<EmployeesRow>({
    ...employeesConfig,
    name: employeesConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: EmployeesRow,
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