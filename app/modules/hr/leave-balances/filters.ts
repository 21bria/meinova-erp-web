import { createFilters, filter } from "@framework"

export const leaveBalancesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search leaveBalances...",
    placeholderKey: "hr.leave-balances.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.leave-balances.filters.employee",
  }),
  filter.lookup("leave_type", "Leave Type", "/api/administration/references/hr/lookup/leave-types/", {
    placement: "advanced",
    labelKey: "hr.leave-balances.filters.leave_type",
  }),
  filter.text("year", "Year", {
    placement: "advanced",
    labelKey: "hr.leave-balances.filters.year",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.leave-balances.filters.is_active",
  }),
  ],
})