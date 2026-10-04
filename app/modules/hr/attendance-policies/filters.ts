import { createFilters, filter } from "@framework"

export const attendancePoliciesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search attendancePolicies...",
    placeholderKey: "hr.attendance-policies.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "hr.attendance-policies.filters.company",
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "hr.attendance-policies.filters.location",
    dependsOn: ["company"],
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("employee_group", "Employee Group", "/api/administration/references/hr/lookup/employee-groups/", {
    placement: "advanced",
    labelKey: "hr.attendance-policies.filters.employee_group",
  }),
  filter.select("late_counts_from_tolerance", "Count Late From Tolerance", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance-policies.filters.late_counts_from_tolerance",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance-policies.filters.is_active",
  }),
  filter.select("require_supervisor_review", "Require supervisor review", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance-policies.filters.require_supervisor_review",
  }),
  filter.select("notify_employee", "Notify employee", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance-policies.filters.notify_employee",
  }),
  filter.select("notify_supervisor", "Notify supervisor", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance-policies.filters.notify_supervisor",
  }),
  filter.select("notify_hr", "Notify hr", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.attendance-policies.filters.notify_hr",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): leave_type
  ],
})