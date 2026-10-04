import { createFilters, filter } from "@framework"

export const payrollRunsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search payrollRuns...",
    placeholderKey: "payroll.payroll-runs.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("period", "Payroll Period", "/api/payroll/payroll-periods/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payroll-runs.filters.period",
  }),
  filter.select("run_type", "Run Type", [
    { label: "Regular", value: "regular" },
    { label: "Off Cycle", value: "off_cycle" },
    { label: "Correction", value: "correction" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-runs.filters.run_type",
  }),
  filter.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
    placement: "advanced",
    labelKey: "payroll.payroll-runs.filters.branch",
  }),
  filter.lookup("location", "Location / Site", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "payroll.payroll-runs.filters.location",
  }),
  filter.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
    placement: "advanced",
    labelKey: "payroll.payroll-runs.filters.department",
  }),
  filter.lookup("section", "Section", "/api/administration/organization/lookup/sections/", {
    placement: "advanced",
    labelKey: "payroll.payroll-runs.filters.section",
    dependsOn: "department",
    lookupParams: {"department_id":"$department"},
  }),
  filter.select("warnings_acknowledged", "Warnings Acknowledged", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-runs.filters.warnings_acknowledged",
  }),
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Processing", value: "processing" },
    { label: "Review", value: "review" },
    { label: "Pending Approval", value: "submitted" },
    { label: "Approved", value: "approved" },
    { label: "Finalized / Locked", value: "finalized" },
    { label: "Rejected", value: "rejected" },
    { label: "Cancelled", value: "cancelled" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-runs.filters.status",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-runs.filters.is_active",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): company, acknowledged_by, calculated_by, submitted_by, approved_by, finalized_by
  ],
})