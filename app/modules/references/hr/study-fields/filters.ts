import { createFilters, filter } from "@framework"

export const studyFieldsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search studyFields...",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  ],
})