import { createFilters, filter } from "@framework"

export const allowanceTemplatesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search allowanceTemplates...",
    placeholderKey: "payroll.allowance-templates.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.allowance-templates.filters.is_active",
  }),
  ],
})