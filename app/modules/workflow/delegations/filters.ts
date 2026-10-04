import { createFilters, filter } from "@framework"

export const delegationsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search delegations...",
    placeholderKey: "workflow.delegations.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("delegator", "Delegator", "/api/accounts/lookup/users/", {
    placement: "advanced",
    labelKey: "workflow.delegations.filters.delegator",
  }),
  filter.lookup("delegate", "Delegate", "/api/accounts/lookup/users/", {
    placement: "advanced",
    labelKey: "workflow.delegations.filters.delegate",
  }),
  filter.text("starts_at", "Starts", {
    placement: "advanced",
    labelKey: "workflow.delegations.filters.starts_at",
  }),
  filter.text("ends_at", "Ends", {
    placement: "advanced",
    labelKey: "workflow.delegations.filters.ends_at",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "workflow.delegations.filters.is_active",
  }),
  filter.text("module", "Module", {
    placement: "advanced",
    labelKey: "workflow.delegations.filters.module",
  }),
  filter.text("document_type", "Document Type", {
    placement: "advanced",
    labelKey: "workflow.delegations.filters.document_type",
  }),
  ],
})