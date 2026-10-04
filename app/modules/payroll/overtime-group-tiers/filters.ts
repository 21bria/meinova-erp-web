import { createFilters, filter } from "@framework"

export const overtimeGroupTiersFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search overtimeGroupTiers...",
    placeholderKey: "payroll.overtime-group-tiers.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("group", "Overtime Group", "/api/payroll/overtime-groups/lookup/", {
    placement: "advanced",
    labelKey: "payroll.overtime-group-tiers.filters.group",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.overtime-group-tiers.filters.is_active",
  }),
  ],
})