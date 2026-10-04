import { createFilters, filter } from "@framework"

export const salaryGradesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search salaryGrades...",
    placeholderKey: "payroll.salary-grades.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.salary-grades.filters.is_active",
  }),
  ],
})