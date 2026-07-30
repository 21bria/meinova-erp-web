import { createFilters, filter } from "@framework"

export const salaryLevelsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search salaryLevels...",
  },

  advanced: true,

  items: [
  filter.lookup("salary_grade", "Salary Grade", "/api/payroll/salary-grades/lookup/", {
    placement: "quick",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  ],
})