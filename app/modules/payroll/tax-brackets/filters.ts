import { createFilters, filter } from "@framework"

export const taxBracketsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search taxBrackets...",
    placeholderKey: "payroll.tax-brackets.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.tax-brackets.filters.is_active",
  }),
  ],
})