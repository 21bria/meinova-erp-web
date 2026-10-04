import { createFilters, filter } from "@framework"

export const banksFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search banks...",
    placeholderKey: "references.bank.banks.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.bank.banks.filters.is_active",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): country
  ],
})