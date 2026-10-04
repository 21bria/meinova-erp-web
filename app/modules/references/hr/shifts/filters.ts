import { createFilters, filter } from "@framework"

export const shiftsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search shifts...",
    placeholderKey: "references.hr.shifts.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("shift_group", "Shift Group", "/api/administration/references/hr/lookup/shift-groups/", {
    placement: "advanced",
    labelKey: "references.hr.shifts.filters.shift_group",
  }),
  filter.select("crosses_midnight", "Crosses Midnight", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.shifts.filters.crosses_midnight",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.shifts.filters.is_active",
  }),
  ],
})