import { createFilters, filter } from "@framework"

export const provincesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search provinces...",
  },

  advanced: true,

  items: [
  filter.lookup("country", "Country", "/api/administration/references/geography/lookup/countries/", {
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