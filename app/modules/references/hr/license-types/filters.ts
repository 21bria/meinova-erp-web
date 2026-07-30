import { createFilters, filter } from "@framework"

export const licenseTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search licenseTypes...",
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