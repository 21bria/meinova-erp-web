import { createFilters, filter } from "@framework"

export const visitorPassesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search visitorPasses...",
    placeholderKey: "hr.visitor-passes.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("request", "Visitor Request", "/api/hr/lookup/visitor-requests/", {
    placement: "advanced",
    labelKey: "hr.visitor-passes.filters.request",
  }),
  filter.text("valid_from", "Valid From", {
    placement: "advanced",
    labelKey: "hr.visitor-passes.filters.valid_from",
  }),
  filter.text("valid_until", "Valid Until", {
    placement: "advanced",
    labelKey: "hr.visitor-passes.filters.valid_until",
  }),
  filter.select("status", "Status", [
    { label: "Issued", value: "issued" },
    { label: "Returned", value: "returned" },
    { label: "Expired", value: "expired" },
    { label: "Lost", value: "lost" },
  ], {
    placement: "quick",
    labelKey: "hr.visitor-passes.filters.status",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.visitor-passes.filters.is_active",
  }),
  ],
})