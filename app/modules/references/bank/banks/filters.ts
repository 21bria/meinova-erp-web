import { createFilters, filter } from "@framework"

export const banksFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search banks...",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  filter.lookup("country", "Country", null, {
    placement: "advanced",
  }),
  ],
})