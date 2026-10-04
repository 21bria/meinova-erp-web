import { createFilters, filter } from "@framework"

export const payrollSettingsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search payrollSettings...",
    placeholderKey: "payroll.payroll-settings.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "payroll.payroll-settings.filters.company",
  }),
  filter.select("proration_method", "Salary Proration Method", [
    { label: "Fixed 30 days per month", value: "fixed_30" },
    { label: "Calendar days in the month (28-31)", value: "calendar_days" },
    { label: "Working days in the month", value: "working_days" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-settings.filters.proration_method",
  }),
  filter.select("prorate_on_join", "Prorate New Joiners", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-settings.filters.prorate_on_join",
  }),
  filter.select("prorate_on_termination", "Prorate Leavers", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-settings.filters.prorate_on_termination",
  }),
  filter.select("attendance_deduction_method", "Attendance Deduction Method", [
    { label: "Fixed 30 days per month", value: "fixed_30" },
    { label: "Calendar days in the month (28-31)", value: "calendar_days" },
    { label: "Working days in the month", value: "working_days" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-settings.filters.attendance_deduction_method",
  }),
  filter.select("deduct_absence", "Deduct Absence", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-settings.filters.deduct_absence",
  }),
  filter.select("deduct_unpaid_leave", "Deduct Unpaid Leave", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-settings.filters.deduct_unpaid_leave",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-settings.filters.is_active",
  }),
  ],
})