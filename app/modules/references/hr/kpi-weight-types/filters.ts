import { createFilters, filter } from "@framework"

export const kpiWeightTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search kpiWeightTypes...",
    placeholderKey: "references.hr.kpi-weight-types.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.kpi-weight-types.filters.is_active",
  }),
  ],
})