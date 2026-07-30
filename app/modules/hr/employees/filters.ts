import { createFilters, filter } from "@framework"

export const employeesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search employees...",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
  }),
  filter.lookup("employment_status", "Employment Status", "/api/administration/references/hr/lookup/employment-statuses/", {
    placement: "quick",
  }),
  filter.lookup("payroll_group", "Payroll Group", "/api/payroll/payroll-groups/lookup/", {
    placement: "advanced",
  }),
  filter.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
    placement: "advanced",
  }),
  filter.lookup("employment_type", "Employment Type", "/api/administration/references/hr/lookup/employment-types/", {
    placement: "quick",
  }),
  filter.lookup("salary_grade", "Salary Grade", "/api/payroll/salary-grades/lookup/", {
    placement: "advanced",
  }),
  filter.lookup("site", "Site", "/api/administration/organization/lookup/sites/", {
    placement: "advanced",
  }),
  filter.lookup("employee_group", "Employee Group", "/api/administration/references/hr/lookup/employee-groups/", {
    placement: "advanced",
  }),
  filter.lookup("division", "Division", "/api/administration/organization/lookup/divisions/", {
    placement: "advanced",
  }),
  filter.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
    placement: "advanced",
  }),
  filter.lookup("contract_type", "Contract Type", "/api/administration/references/hr/lookup/contract-types/", {
    placement: "advanced",
  }),
  filter.lookup("section", "Section", "/api/administration/organization/lookup/sections/", {
    placement: "advanced",
  }),
  filter.lookup("tax_status", "Tax Status", "/api/payroll/tax-statuses/lookup/", {
    placement: "advanced",
  }),
  filter.lookup("position", "Position", "/api/administration/organization/lookup/positions/", {
    placement: "advanced",
  }),
  filter.lookup("job_level", "Job Level", "/api/administration/references/hr/lookup/job-levels/", {
    placement: "advanced",
  }),
  filter.lookup("job_grade", "Job Grade", "/api/administration/references/hr/lookup/job-grades/", {
    placement: "advanced",
  }),
  filter.lookup("gender", "Gender", "/api/administration/references/hr/lookup/genders/", {
    placement: "quick",
  }),
  filter.lookup("reports_to", "Reports To", "/api/hr/lookup/employees/", {
    placement: "advanced",
  }),
  filter.lookup("religion", "Religion", "/api/administration/references/hr/lookup/religions/", {
    placement: "advanced",
  }),
  filter.lookup("nationality", "Nationality", "/api/administration/references/hr/lookup/nationalities/", {
    placement: "advanced",
  }),
  filter.lookup("cost_center", "Cost Center", "/api/administration/organization/lookup/cost-centers/", {
    placement: "advanced",
  }),
  filter.text("contract_end", "Contract End", {
    placement: "advanced",
  }),
  filter.lookup("blood_type", "Blood Type", "/api/administration/references/hr/lookup/blood-types/", {
    placement: "advanced",
  }),
  filter.lookup("marital_status", "Marital Status", "/api/administration/references/hr/lookup/marital-statuses/", {
    placement: "advanced",
  }),
  filter.lookup("shift", "Shift", "/api/administration/references/hr/lookup/shifts/", {
    placement: "advanced",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  ],
})