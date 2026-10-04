import { createFilters, filter } from "@framework"

export const journalsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search journals...",
    placeholderKey: "finance.journals.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
    labelKey: "finance.journals.filters.company",
  }),
  filter.text("source_module", "Source Module", {
    placement: "advanced",
    labelKey: "finance.journals.filters.source_module",
  }),
  filter.text("posting_date", "Posting Date", {
    placement: "quick",
    labelKey: "finance.journals.filters.posting_date",
  }),
  filter.select("journal_type", "Journal Type", [
    { label: "Manual", value: "manual" },
    { label: "Automatic", value: "automatic" },
    { label: "Adjustment", value: "adjustment" },
    { label: "Accrual", value: "accrual" },
    { label: "Reversal", value: "reversal" },
    { label: "Recurring", value: "recurring" },
    { label: "Opening", value: "opening" },
    { label: "Closing", value: "closing" },
    { label: "Intercompany", value: "intercompany" },
    { label: "Allocation", value: "allocation" },
  ], {
    placement: "quick",
    labelKey: "finance.journals.filters.journal_type",
  }),
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Pending Approval", value: "submitted" },
    { label: "Approved", value: "approved" },
    { label: "Posted", value: "posted" },
    { label: "Rejected", value: "rejected" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Reversed", value: "reversed" },
  ], {
    placement: "quick",
    labelKey: "finance.journals.filters.status",
  }),
  ],
})