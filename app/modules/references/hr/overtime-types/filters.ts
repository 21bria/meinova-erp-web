import { createFilters, filter } from "@framework"

export const overtimeTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search overtimeTypes...",
    placeholderKey: "references.hr.overtime-types.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.overtime-types.filters.is_active",
  }),
  ],
})