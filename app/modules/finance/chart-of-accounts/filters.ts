import { createFilters, filter } from "@framework"

export const chartOfAccountsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search chartOfAccounts...",
    placeholderKey: "finance.chart-of-accounts.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
    labelKey: "finance.chart-of-accounts.filters.company",
  }),
  filter.select("account_category", "Category", [
    { label: "Current Asset", value: "current_asset" },
    { label: "Non-Current Asset", value: "non_current_asset" },
    { label: "Fixed Asset", value: "fixed_asset" },
    { label: "Intangible Asset", value: "intangible_asset" },
    { label: "Other Asset", value: "other_asset" },
    { label: "Current Liability", value: "current_liability" },
    { label: "Non-Current Liability", value: "non_current_liability" },
    { label: "Other Liability", value: "other_liability" },
    { label: "Equity", value: "equity" },
    { label: "Operating Revenue", value: "operating_revenue" },
    { label: "Other Income", value: "other_revenue" },
    { label: "Cost of Sales", value: "cost_of_sales" },
    { label: "Operating Expense", value: "operating_expense" },
    { label: "Other Expense", value: "other_expense" },
    { label: "Tax Expense", value: "tax_expense" },
  ], {
    placement: "advanced",
    labelKey: "finance.chart-of-accounts.filters.account_category",
  }),
  filter.select("account_type", "Account Type", [
    { label: "Asset", value: "asset" },
    { label: "Liability", value: "liability" },
    { label: "Equity", value: "equity" },
    { label: "Revenue", value: "revenue" },
    { label: "Expense", value: "expense" },
  ], {
    placement: "quick",
    labelKey: "finance.chart-of-accounts.filters.account_type",
  }),
  filter.select("posting_allowed", "Posting Allowed", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "finance.chart-of-accounts.filters.posting_allowed",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "finance.chart-of-accounts.filters.is_active",
  }),
  ],
})