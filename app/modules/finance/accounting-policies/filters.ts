import { createFilters, filter } from "@framework"

export const accountingPoliciesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search accountingPolicies...",
    placeholderKey: "finance.accounting-policies.placeholder.search",
  },

  advanced: true,

  items: [
  filter.text("event_type", "Event Type", {
    placement: "quick",
    labelKey: "finance.accounting-policies.filters.event_type",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
    labelKey: "finance.accounting-policies.filters.company",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "finance.accounting-policies.filters.is_active",
  }),
  ],
})