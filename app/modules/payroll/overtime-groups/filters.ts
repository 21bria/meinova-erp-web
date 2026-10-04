import { createFilters, filter } from "@framework"

export const overtimeGroupsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search overtimeGroups...",
    placeholderKey: "payroll.overtime-groups.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("tier_basis", "Tier Basis", [
    { label: "Per overtime day - each day restarts at the first tier", value: "daily" },
    { label: "Total hours per month - all hours tiered once", value: "monthly" },
  ], {
    placement: "quick",
    labelKey: "payroll.overtime-groups.filters.tier_basis",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.overtime-groups.filters.is_active",
  }),
  ],
})