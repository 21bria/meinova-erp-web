import { createFilters, filter } from "@framework"

export const employeesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search employees...",
    placeholderKey: "hr.employees.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.company",
  }),
  filter.lookup("employment_status", "Employment Status", "/api/administration/references/hr/lookup/employment-statuses/", {
    placement: "quick",
    labelKey: "hr.employees.filters.employment_status",
  }),
  filter.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.branch",
    dependsOn: "company",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("employment_type", "Employment Type", "/api/administration/references/hr/lookup/employment-types/", {
    placement: "quick",
    labelKey: "hr.employees.filters.employment_type",
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.location",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","branch_id":"$branch"},
  }),
  filter.lookup("employee_group", "Employee Group", "/api/administration/references/hr/lookup/employee-groups/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.employee_group",
  }),
  filter.lookup("division", "Division", "/api/administration/organization/lookup/divisions/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.division",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","branch_id":"$branch","location_id":"$location"},
  }),
  filter.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.department",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","location_id":"$location","division_id":"$division"},
  }),
  filter.lookup("contract_type", "Contract Type", "/api/administration/references/hr/lookup/contract-types/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.contract_type",
  }),
  filter.lookup("section", "Section", "/api/administration/organization/lookup/sections/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.section",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","location_id":"$location","division_id":"$division","department_id":"$department"},
  }),
  filter.lookup("position", "Position", "/api/administration/organization/lookup/positions/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.position",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","location_id":"$location","division_id":"$division","department_id":"$department","section_id":"$section"},
  }),
  filter.text("job_location", "Job Location", {
    placement: "advanced",
    labelKey: "hr.employees.filters.job_location",
  }),
  filter.lookup("point_of_hire", "Point of Hire", "/api/administration/references/geography/lookup/cities/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.point_of_hire",
  }),
  filter.lookup("job_level", "Job Level", "/api/administration/references/hr/lookup/job-levels/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.job_level",
  }),
  filter.lookup("job_grade", "Job Grade", "/api/administration/references/hr/lookup/job-grades/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.job_grade",
  }),
  filter.lookup("gender", "Gender", "/api/administration/references/hr/lookup/genders/", {
    placement: "quick",
    labelKey: "hr.employees.filters.gender",
  }),
  filter.lookup("reports_to", "Reports To", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.reports_to",
    dependsOn: "company",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("religion", "Religion", "/api/administration/references/hr/lookup/religions/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.religion",
  }),
  filter.lookup("nationality", "Nationality", "/api/administration/references/hr/lookup/nationalities/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.nationality",
  }),
  filter.lookup("cost_center", "Cost Center", "/api/administration/organization/lookup/cost-centers/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.cost_center",
    dependsOn: "company",
    lookupParams: {"company_id":"$company"},
  }),
  filter.text("contract_end", "Contract End", {
    placement: "advanced",
    labelKey: "hr.employees.filters.contract_end",
  }),
  filter.lookup("roster_policy", "Roster Policy", "/api/administration/references/hr/lookup/roster-policies/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.roster_policy",
    dependsOn: ["company"],
    lookupParams: {"company_id":"$company","location_id":"$location"},
  }),
  filter.lookup("roster_crew", "Roster Crew", "/api/administration/calendar/lookup/roster-crews/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.roster_crew",
    dependsOn: ["company"],
    lookupParams: {"company_id":"$company","location_id":"$location"},
  }),
  filter.lookup("blood_type", "Blood Type", "/api/administration/references/hr/lookup/blood-types/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.blood_type",
  }),
  filter.lookup("marital_status", "Marital Status", "/api/administration/references/hr/lookup/marital-statuses/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.marital_status",
  }),
  filter.lookup("shift", "Shift", "/api/administration/references/hr/lookup/shifts/", {
    placement: "advanced",
    labelKey: "hr.employees.filters.shift",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.employees.filters.is_active",
  }),
  ],
})