import { createFilters, filter } from "@framework"

export const fiscalYearsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search fiscalYears...",
    placeholderKey: "finance.fiscal-years.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
    labelKey: "finance.fiscal-years.filters.company",
  }),
  filter.select("status", "Status", [
    { label: "Open", value: "open" },
    { label: "Closed", value: "closed" },
    { label: "Locked", value: "locked" },
  ], {
    placement: "quick",
    labelKey: "finance.fiscal-years.filters.status",
  }),
  filter.text("start_date", "Start Date", {
    placement: "advanced",
    labelKey: "finance.fiscal-years.filters.start_date",
  }),
  filter.text("end_date", "End Date", {
    placement: "advanced",
    labelKey: "finance.fiscal-years.filters.end_date",
  }),
  ],
})