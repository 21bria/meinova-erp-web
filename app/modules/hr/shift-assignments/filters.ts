import { createFilters, filter } from "@framework"

export const shiftAssignmentsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search shiftAssignments...",
    placeholderKey: "hr.shift-assignments.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.shift-assignments.filters.employee",
  }),
  filter.select("kind", "Kind", [
    { label: "Working Shift", value: "work" },
    { label: "Recovery / Rest", value: "rest" },
  ], {
    placement: "quick",
    labelKey: "hr.shift-assignments.filters.kind",
  }),
  filter.lookup("shift", "Shift", "/api/administration/references/hr/lookup/shifts/", {
    placement: "advanced",
    labelKey: "hr.shift-assignments.filters.shift",
  }),
  filter.select("layer", "Layer", [
    { label: "Roster Baseline", value: "baseline" },
    { label: "Adjustment", value: "override" },
  ], {
    placement: "quick",
    labelKey: "hr.shift-assignments.filters.layer",
  }),
  filter.text("start_date", "Start Date", {
    placement: "advanced",
    labelKey: "hr.shift-assignments.filters.start_date",
  }),
  filter.text("end_date", "End Date", {
    placement: "advanced",
    labelKey: "hr.shift-assignments.filters.end_date",
  }),
  ],
})