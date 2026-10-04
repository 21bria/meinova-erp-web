import { createFilters, filter } from "@framework"

export const studyFieldsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search studyFields...",
    placeholderKey: "references.hr.study-fields.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.study-fields.filters.is_active",
  }),
  ],
})