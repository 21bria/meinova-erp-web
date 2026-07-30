import { createFilters, filter } from "@framework"

export const payrollGroupsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search payrollGroups...",
  },

  advanced: true,

  items: [
  filter.text("pay_frequency", "Pay frequency", {
    placement: "advanced",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  ],
})