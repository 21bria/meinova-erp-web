import { createFilters, filter } from "@framework"

export const attendanceFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search attendance...",
    placeholderKey: "hr.attendance.placeholder.search",
  },

  advanced: true,

  items: [
  filter.dateRange("work_date", "Work Date", {
    placement: "quick",
    labelKey: "hr.attendance.filters.work_date",
    fromKey: "date_from",
    toKey: "date_to",
    defaultRange: "current_month",
    maxDays: 90,
    presets: ["today","last_7_days","this_month","last_month","custom"],
    required: true,
  }),
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.attendance.filters.employee",
    lookupParams: {"feature":"attendance"},
  }),
  filter.select("approval_status", "Approval Status", [
    { label: "Draft", value: "draft" },
    { label: "Pending Approval", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance.filters.approval_status",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "hr.attendance.filters.company",
  }),
  filter.select("is_manual_adjustment", "Manual Adjustment", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance.filters.is_manual_adjustment",
  }),
  filter.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
    placement: "advanced",
    labelKey: "hr.attendance.filters.branch",
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "hr.attendance.filters.location",
  }),
  filter.lookup("shift", "Shift", "/api/administration/references/hr/lookup/shifts/", {
    placement: "advanced",
    labelKey: "hr.attendance.filters.shift",
  }),
  filter.select("status", "Attendance Status", [
    { label: "Present", value: "present" },
    { label: "Late", value: "late" },
    { label: "Absent", value: "absent" },
    { label: "Leave", value: "leave" },
    { label: "Sick", value: "sick" },
    { label: "Permit", value: "permit" },
    { label: "Business Trip", value: "business_trip" },
    { label: "Remote Work", value: "remote" },
    { label: "Holiday", value: "holiday" },
    { label: "Day Off", value: "day_off" },
    { label: "Incomplete", value: "incomplete" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance.filters.status",
  }),
  filter.select("is_geofence_valid", "Geofence Valid", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance.filters.is_geofence_valid",
  }),
  filter.select("source", "Source", [
    { label: "Manual", value: "manual" },
    { label: "Attendance Device", value: "device" },
    { label: "Mobile", value: "mobile" },
    { label: "Web", value: "web" },
    { label: "Import", value: "import" },
    { label: "API", value: "api" },
    { label: "System", value: "system" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance.filters.source",
  }),
  filter.select("leave_required_waived", "Waived", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance.filters.leave_required_waived",
  }),
  filter.select("review_decision", "Review Decision", [
    { label: "Valid exception", value: "valid" },
    { label: "Must submit leave", value: "require_leave" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance.filters.review_decision",
  }),
  filter.select("permission_state", "Permission", [
    { label: "Menunggu izin", value: "pending" },
    { label: "Permitted", value: "excused" },
    { label: "Partially permitted", value: "partial" },
    { label: "Unauthorised", value: "unauthorized" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance.filters.permission_state",
  }),
  filter.select("is_excused_absence", "Excused Absence", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance.filters.is_excused_absence",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): reviewed_by, approved_by
  ],
})