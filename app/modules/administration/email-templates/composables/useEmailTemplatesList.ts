import {
  useCrud,
} from "@framework"

import {
  emailTemplatesConfig,
} from "../table"

import type {
  EmailTemplatesRow,
} from "../types"

export function useEmailTemplatesList() {
  const crud = useCrud<EmailTemplatesRow>({
    ...emailTemplatesConfig,
    name: emailTemplatesConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: EmailTemplatesRow,
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