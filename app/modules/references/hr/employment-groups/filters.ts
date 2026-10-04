import { createFilters, filter } from "@framework"

export const employmentGroupsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search employmentGroups...",
    placeholderKey: "references.hr.employment-groups.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("attendance_applicable", "Attendance", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "advanced",
    labelKey: "references.hr.employment-groups.filters.attendance_applicable",
  }),
  filter.select("leave_applicable", "Leave", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "advanced",
    labelKey: "references.hr.employment-groups.filters.leave_applicable",
  }),
  filter.select("roster_applicable", "Roster", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "advanced",
    labelKey: "references.hr.employment-groups.filters.roster_applicable",
  }),
  filter.select("shift_applicable", "Shift", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "advanced",
    labelKey: "references.hr.employment-groups.filters.shift_applicable",
  }),
  filter.select("overtime_applicable", "Overtime", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "advanced",
    labelKey: "references.hr.employment-groups.filters.overtime_applicable",
  }),
  filter.select("field_break_applicable", "Field Break / Travel Request", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "advanced",
    labelKey: "references.hr.employment-groups.filters.field_break_applicable",
  }),
  filter.select("business_trip_applicable", "Business Trip", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "advanced",
    labelKey: "references.hr.employment-groups.filters.business_trip_applicable",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.employment-groups.filters.is_active",
  }),
  ],
})