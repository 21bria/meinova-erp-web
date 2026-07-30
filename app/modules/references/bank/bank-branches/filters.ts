import { createFilters, filter } from "@framework"

export const bankBranchesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search bankBranches...",
  },

  advanced: true,

  items: [
  filter.lookup("bank", "Bank", "/api/administration/references/bank/lookup/banks/", {
    placement: "quick",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  filter.select("is_head_office", "Is head office", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  filter.lookup("city", "City", null, {
    placement: "advanced",
  }),
  ],
})