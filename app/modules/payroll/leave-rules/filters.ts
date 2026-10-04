import { createFilters, filter } from "@framework"

export const leaveRulesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search leaveRules...",
    placeholderKey: "payroll.leave-rules.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("leave_type", "Leave Type", "/api/administration/references/hr/lookup/leave-types/", {
    placement: "advanced",
    labelKey: "payroll.leave-rules.filters.leave_type",
  }),
  filter.select("is_unpaid", "Unpaid Leave", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.leave-rules.filters.is_unpaid",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.leave-rules.filters.is_active",
  }),
  ],
})