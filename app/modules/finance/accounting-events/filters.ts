import { createFilters, filter } from "@framework"

export const accountingEventsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search accountingEvents...",
    placeholderKey: "finance.accounting-events.placeholder.search",
  },

  advanced: true,

  items: [
  filter.text("event_type", "Event Type", {
    placement: "quick",
    labelKey: "finance.accounting-events.filters.event_type",
  }),
  filter.text("source_module", "Source Module", {
    placement: "advanced",
    labelKey: "finance.accounting-events.filters.source_module",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
    labelKey: "finance.accounting-events.filters.company",
  }),
  filter.text("event_date", "Event Date", {
    placement: "quick",
    labelKey: "finance.accounting-events.filters.event_date",
  }),
  filter.select("status", "Status", [
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Processed", value: "processed" },
    { label: "Failed", value: "failed" },
    { label: "Skipped", value: "skipped" },
    { label: "Cancelled", value: "cancelled" },
  ], {
    placement: "quick",
    labelKey: "finance.accounting-events.filters.status",
  }),
  filter.text("source_type", "Source Type", {
    placement: "advanced",
    labelKey: "finance.accounting-events.filters.source_type",
  }),
  ],
})