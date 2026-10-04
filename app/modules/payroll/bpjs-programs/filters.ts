import { createFilters, filter } from "@framework"

export const bpjsProgramsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search bpjsPrograms...",
    placeholderKey: "payroll.bpjs-programs.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("uses_risk_class", "Uses Risk Class", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.bpjs-programs.filters.uses_risk_class",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.bpjs-programs.filters.is_active",
  }),
  ],
})