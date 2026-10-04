import { createFilters, filter } from "@framework"

export const salaryLevelsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search salaryLevels...",
    placeholderKey: "payroll.salary-levels.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("salary_grade", "Salary Grade", "/api/payroll/salary-grades/lookup/", {
    placement: "quick",
    labelKey: "payroll.salary-levels.filters.salary_grade",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.salary-levels.filters.is_active",
  }),
  ],
})