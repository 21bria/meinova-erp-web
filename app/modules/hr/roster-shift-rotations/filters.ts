import { createFilters, filter } from "@framework"

export const rosterShiftRotationsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search rosterShiftRotations...",
    placeholderKey: "hr.roster-shift-rotations.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("shift", "Shift", "/api/administration/references/hr/lookup/shifts/", {
    placement: "advanced",
    labelKey: "hr.roster-shift-rotations.filters.shift",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.roster-shift-rotations.filters.is_active",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): policy
  ],
})