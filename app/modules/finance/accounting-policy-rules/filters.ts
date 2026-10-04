import { createFilters, filter } from "@framework"

export const accountingPolicyRulesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search accountingPolicyRules...",
    placeholderKey: "finance.accounting-policy-rules.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("policy", "Policy", "/api/finance/lookup/accounting-policies/", {
    placement: "advanced",
    labelKey: "finance.accounting-policy-rules.filters.policy",
  }),
  filter.select("stop_on_match", "Stop On Match", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "finance.accounting-policy-rules.filters.stop_on_match",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "finance.accounting-policy-rules.filters.is_active",
  }),
  ],
})