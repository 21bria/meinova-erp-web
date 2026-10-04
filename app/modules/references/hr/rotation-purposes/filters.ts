import { createFilters, filter } from "@framework"

export const rotationPurposesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search rotationPurposes...",
    placeholderKey: "references.hr.rotation-purposes.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("deducts_leave", "Deducts Leave", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.rotation-purposes.filters.deducts_leave",
  }),
  filter.lookup("leave_type", "Leave Type", "/api/administration/references/hr/lookup/leave-types/", {
    placement: "advanced",
    labelKey: "references.hr.rotation-purposes.filters.leave_type",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.rotation-purposes.filters.is_active",
  }),
  ],
})