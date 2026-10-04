import { createFilters, filter } from "@framework"

export const overtimeFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search overtime...",
    placeholderKey: "hr.overtime.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.overtime.filters.employee",
  }),
  filter.text("work_date", "Work Date", {
    placement: "advanced",
    labelKey: "hr.overtime.filters.work_date",
  }),
  filter.lookup("overtime_type", "Overtime Type", "/api/administration/references/hr/lookup/overtime-types/", {
    placement: "advanced",
    labelKey: "hr.overtime.filters.overtime_type",
  }),
  filter.select("status", "Status", [
    { label: "Recorded", value: "recorded" },
    { label: "Cancelled", value: "cancelled" },
  ], {
    placement: "quick",
    labelKey: "hr.overtime.filters.status",
  }),
  filter.select("is_paid", "Paid", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.overtime.filters.is_paid",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "hr.overtime.filters.company",
  }),
  filter.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
    placement: "advanced",
    labelKey: "hr.overtime.filters.branch",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "hr.overtime.filters.location",
    lookupParams: {"company_id":"$company","branch_id":"$branch"},
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.overtime.filters.is_active",
  }),
  ],
})