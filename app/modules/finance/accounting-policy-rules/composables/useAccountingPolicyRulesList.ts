import {
  useCrud,
} from "@framework"

import {
  accountingPolicyRulesConfig,
} from "../table"

import type {
  AccountingPolicyRulesRow,
} from "../types"

export function useAccountingPolicyRulesList() {
  const crud = useCrud<AccountingPolicyRulesRow>({
    ...accountingPolicyRulesConfig,
    name: accountingPolicyRulesConfig.id,
  })

  async function refresh() {
    await crud.refresh()
  }

  function selectRow(
    row: AccountingPolicyRulesRow,
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