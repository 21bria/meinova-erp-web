import { createFilters, filter } from "@framework"

export const apiKeysFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search apiKeys...",
    placeholderKey: "administration.security.api-keys.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.security.api-keys.filters.is_active",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): user
  ],
})