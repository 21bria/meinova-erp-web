import { createFilters, filter } from "@framework"

export const leaveOpeningBalancesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search leaveOpeningBalances...",
    placeholderKey: "hr.leave-opening-balances.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Posted", value: "posted" },
  ], {
    placement: "quick",
    labelKey: "hr.leave-opening-balances.filters.status",
  }),
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.leave-opening-balances.filters.employee",
  }),
  filter.lookup("leave_type", "Leave Type", "/api/administration/references/hr/lookup/leave-types/", {
    placement: "advanced",
    labelKey: "hr.leave-opening-balances.filters.leave_type",
  }),
  filter.text("opening_date", "Opening Date", {
    placement: "advanced",
    labelKey: "hr.leave-opening-balances.filters.opening_date",
  }),
  filter.text("year", "Balance Year", {
    placement: "advanced",
    labelKey: "hr.leave-opening-balances.filters.year",
  }),
  filter.select("source", "Source", [
    { label: "Manual", value: "manual" },
    { label: "Import", value: "import" },
  ], {
    placement: "quick",
    labelKey: "hr.leave-opening-balances.filters.source",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.leave-opening-balances.filters.is_active",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): posted_by
  ],
})