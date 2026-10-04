import {
  useCrud,
} from "@framework"

import {
  attendanceConfig,
} from "../table"

import type {
  AttendanceRow,
} from "../types"

export function useAttendanceList() {
  const crud = useCrud<AttendanceRow>({
    ...attendanceConfig,
    name: attendanceConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: AttendanceRow,
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