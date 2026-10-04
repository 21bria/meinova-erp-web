import { createFilters, filter } from "@framework"

export const skillsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search skills...",
    placeholderKey: "references.hr.skills.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.skills.filters.is_active",
  }),
  ],
})