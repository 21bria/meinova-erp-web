import { createFilters, filter } from "@framework"

export const deductionTemplatesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search deductionTemplates...",
    placeholderKey: "payroll.deduction-templates.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.deduction-templates.filters.is_active",
  }),
  ],
})