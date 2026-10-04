import { createFilters, filter } from "@framework"

export const rotationCreditsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search rotationCredits...",
    placeholderKey: "hr.rotation-credits.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.rotation-credits.filters.employee",
  }),
  filter.select("entry_type", "Entry Type", [
    { label: "Opening Balance", value: "opening_balance" },
    { label: "Earned", value: "earned" },
    { label: "Used", value: "used" },
    { label: "Adjustment (+)", value: "adjustment_plus" },
    { label: "Adjustment (−)", value: "adjustment_minus" },
    { label: "Expired", value: "expired" },
    { label: "Reversal", value: "reversal" },
  ], {
    placement: "quick",
    labelKey: "hr.rotation-credits.filters.entry_type",
  }),
  filter.text("effective_date", "Effective Date", {
    placement: "advanced",
    labelKey: "hr.rotation-credits.filters.effective_date",
  }),
  ],
})