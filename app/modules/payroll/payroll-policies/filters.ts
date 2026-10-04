import { createFilters, filter } from "@framework"

export const payrollPoliciesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search payrollPolicies...",
    placeholderKey: "payroll.payroll-policies.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "payroll.payroll-policies.filters.company",
  }),
  filter.select("pay_basis", "Pay Basis", [
    { label: "Monthly - a monthly salary split into daily entitlement", value: "monthly" },
    { label: "Daily - wage built from the days paid", value: "daily" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-policies.filters.pay_basis",
  }),
  filter.select("proration_method", "Monthly - Salary Proration Method", [
    { label: "Fixed 30 Days", value: "fixed_30" },
    { label: "Calendar Days", value: "calendar_days" },
    { label: "Working Days", value: "working_days" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-policies.filters.proration_method",
  }),
  filter.select("prorate_on_join", "Monthly - Prorate on Join", [
    { label: "Ikut kebijakan perusahaan", value: "inherit" },
    { label: "Ya", value: "on" },
    { label: "Tidak", value: "off" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-policies.filters.prorate_on_join",
  }),
  filter.select("prorate_on_termination", "Monthly - Prorate on Termination", [
    { label: "Ikut kebijakan perusahaan", value: "inherit" },
    { label: "Ya", value: "on" },
    { label: "Tidak", value: "off" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-policies.filters.prorate_on_termination",
  }),
  filter.select("attendance_deduction_method", "Monthly - Absence Deduction Method", [
    { label: "Fixed 30 Days", value: "fixed_30" },
    { label: "Calendar Days", value: "calendar_days" },
    { label: "Working Days", value: "working_days" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-policies.filters.attendance_deduction_method",
  }),
  filter.select("deduct_absence", "Monthly - Deduct Absence", [
    { label: "Ikut kebijakan perusahaan", value: "inherit" },
    { label: "Ya", value: "on" },
    { label: "Tidak", value: "off" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-policies.filters.deduct_absence",
  }),
  filter.select("deduct_unpaid_leave", "Monthly - Deduct Unpaid Leave", [
    { label: "Ikut kebijakan perusahaan", value: "inherit" },
    { label: "Ya", value: "on" },
    { label: "Tidak", value: "off" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-policies.filters.deduct_unpaid_leave",
  }),
  filter.select("daily_rate_method", "Daily - Daily Rate Method", [
    { label: "Daily rate recorded on the Payroll Assignment", value: "assignment_rate" },
    { label: "Monthly salary divided by the divisor below", value: "from_monthly" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-policies.filters.daily_rate_method",
  }),
  filter.select("pay_paid_leave", "Daily - Approved Leave Days", [
    { label: "Dibayar - hari cuti tetap menghasilkan upah sehari", value: "yes" },
    { label: "Tidak dibayar - hanya hari kerja nyata yang dibayar", value: "no" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-policies.filters.pay_paid_leave",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-policies.filters.is_active",
  }),
  ],
})