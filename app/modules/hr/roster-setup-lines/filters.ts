import { createFilters, filter } from "@framework"

export const rosterSetupLinesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search rosterSetupLines...",
    placeholderKey: "hr.roster-setup-lines.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.roster-setup-lines.filters.employee",
  }),
  filter.lookup("roster_policy", "Roster Policy", "/api/administration/references/hr/lookup/roster-policies/", {
    placement: "advanced",
    labelKey: "hr.roster-setup-lines.filters.roster_policy",
  }),
  filter.select("status", "Status", [
    { label: "Pending", value: "pending" },
    { label: "Committed", value: "committed" },
    { label: "Failed", value: "failed" },
    { label: "Skipped", value: "skipped" },
  ], {
    placement: "quick",
    labelKey: "hr.roster-setup-lines.filters.status",
  }),
  ],
})