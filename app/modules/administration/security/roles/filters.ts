import { createFilters, filter } from "@framework"

export const rolesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search roles...",
    placeholderKey: "administration.security.roles.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.security.roles.filters.is_active",
  }),
  ],
})