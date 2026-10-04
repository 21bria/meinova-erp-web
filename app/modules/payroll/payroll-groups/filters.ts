import { createFilters, filter } from "@framework"

export const payrollGroupsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search payrollGroups...",
    placeholderKey: "payroll.payroll-groups.placeholder.search",
  },

  advanced: true,

  items: [
  filter.text("pay_frequency", "Pay frequency", {
    placement: "advanced",
    labelKey: "payroll.payroll-groups.filters.pay_frequency",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-groups.filters.is_active",
  }),
  ],
})