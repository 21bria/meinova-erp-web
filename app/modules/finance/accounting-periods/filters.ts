import { createFilters, filter } from "@framework"

export const accountingPeriodsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search accountingPeriods...",
    placeholderKey: "finance.accounting-periods.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("fiscal_year", "Fiscal Year", "/api/finance/lookup/fiscal-years/", {
    placement: "quick",
    labelKey: "finance.accounting-periods.filters.fiscal_year",
  }),
  filter.select("status", "Status", [
    { label: "Open", value: "open" },
    { label: "Soft Closed", value: "soft_closed" },
    { label: "Closed", value: "closed" },
    { label: "Locked", value: "locked" },
  ], {
    placement: "quick",
    labelKey: "finance.accounting-periods.filters.status",
  }),
  filter.text("start_date", "Start Date", {
    placement: "advanced",
    labelKey: "finance.accounting-periods.filters.start_date",
  }),
  filter.text("end_date", "End Date", {
    placement: "advanced",
    labelKey: "finance.accounting-periods.filters.end_date",
  }),
  ],
})