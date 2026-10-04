import { createFilters, filter } from "@framework"

export const attendancePermissionsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search attendancePermissions...",
    placeholderKey: "hr.attendance-permissions.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.attendance-permissions.filters.employee",
  }),
  filter.select("permission_type", "Permission Type", [
    { label: "Late Arrival", value: "late_arrival" },
    { label: "Early Leave", value: "early_leave" },
    { label: "Temporary Out", value: "temporary_out" },
    { label: "Full Day Permission", value: "full_day" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance-permissions.filters.permission_type",
  }),
  filter.text("date", "Date", {
    placement: "advanced",
    labelKey: "hr.attendance-permissions.filters.date",
  }),
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Submitted", value: "submitted" },
    { label: "In Review", value: "in_review" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Cancelled", value: "cancelled" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance-permissions.filters.status",
  }),
  filter.select("allow_outside_shift", "Allow Outside Shift (HR Override)", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance-permissions.filters.allow_outside_shift",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "hr.attendance-permissions.filters.company",
  }),
  filter.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
    placement: "advanced",
    labelKey: "hr.attendance-permissions.filters.branch",
    dependsOn: "company",
    lookupParams: {"company":"company"},
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "hr.attendance-permissions.filters.location",
    dependsOn: "company",
    lookupParams: {"company":"company"},
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance-permissions.filters.is_active",
  }),
  ],
})