import { createFilters, filter } from "@framework"

export const bpjsBaseComponentsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search bpjsBaseComponents...",
    placeholderKey: "payroll.bpjs-base-components.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("definition", "Base Definition", "/api/payroll/bpjs-base-definitions/lookup/", {
    placement: "advanced",
    labelKey: "payroll.bpjs-base-components.filters.definition",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.bpjs-base-components.filters.is_active",
  }),
  ],
})