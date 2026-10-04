import { createFilters, filter } from "@framework"

export const payrollPeriodsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search payrollPeriods...",
    placeholderKey: "payroll.payroll-periods.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "payroll.payroll-periods.filters.company",
  }),
  filter.lookup("payroll_group", "Payroll Group", "/api/payroll/payroll-groups/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payroll-periods.filters.payroll_group",
  }),
  filter.text("start_date", "Start Date", {
    placement: "advanced",
    labelKey: "payroll.payroll-periods.filters.start_date",
  }),
  filter.text("end_date", "End Date", {
    placement: "advanced",
    labelKey: "payroll.payroll-periods.filters.end_date",
  }),
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Processing", value: "processing" },
    { label: "Review", value: "review" },
    { label: "Approved", value: "approved" },
    { label: "Finalized / Locked", value: "finalized" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-periods.filters.status",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-periods.filters.is_active",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): locked_by
  ],
})