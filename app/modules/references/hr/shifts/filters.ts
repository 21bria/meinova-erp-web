import { createFilters, filter } from "@framework"

export const shiftsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search shifts...",
  },

  advanced: true,

  items: [
  filter.lookup("shift_group", "Shift Group", "/api/administration/references/hr/lookup/shift-groups/", {
    placement: "advanced",
  }),
  filter.select("crosses_midnight", "Crosses Midnight", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  ],
})