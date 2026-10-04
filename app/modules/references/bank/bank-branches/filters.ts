import { createFilters, filter } from "@framework"

export const bankBranchesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search bankBranches...",
    placeholderKey: "references.bank.bank-branches.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("bank", "Bank", "/api/administration/references/bank/lookup/banks/", {
    placement: "quick",
    labelKey: "references.bank.bank-branches.filters.bank",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.bank.bank-branches.filters.is_active",
  }),
  filter.select("is_head_office", "Is head office", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.bank.bank-branches.filters.is_head_office",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): city
  ],
})