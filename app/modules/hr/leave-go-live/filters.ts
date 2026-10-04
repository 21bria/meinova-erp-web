import { createFilters, filter } from "@framework"

export const leaveGoLiveFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search leaveGoLive...",
    placeholderKey: "hr.leave-go-live.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "hr.leave-go-live.filters.company",
  }),
  filter.text("go_live_date", "Go-Live Date", {
    placement: "advanced",
    labelKey: "hr.leave-go-live.filters.go_live_date",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.leave-go-live.filters.is_active",
  }),
  ],
})