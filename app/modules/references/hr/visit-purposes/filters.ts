import { createFilters, filter } from "@framework"

export const visitPurposesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search visitPurposes...",
    placeholderKey: "references.hr.visit-purposes.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("requires_approval", "Requires Approval", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.visit-purposes.filters.requires_approval",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.visit-purposes.filters.is_active",
  }),
  ],
})