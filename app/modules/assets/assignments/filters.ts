import { createFilters, filter } from "@framework"

export const assignmentsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search assignments...",
    placeholderKey: "assets.assignments.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("status", "Status", [
    { label: "Draft", value: "DRAFT" },
    { label: "Submitted", value: "SUBMITTED" },
    { label: "Approved", value: "APPROVED" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Cancelled", value: "CANCELLED" },
  ], {
    placement: "quick",
    labelKey: "assets.assignments.filters.status",
  }),
  filter.select("target_custody_type", "Assign To", [
    { label: "Employee", value: "EMPLOYEE" },
    { label: "Organization", value: "ORGANIZATION" },
  ], {
    placement: "quick",
    labelKey: "assets.assignments.filters.target_custody_type",
  }),
  filter.lookup("asset", "Asset", "/api/assets/lookup/available-assets/", {
    placement: "advanced",
    labelKey: "assets.assignments.filters.asset",
    dependsOn: "target_custody_type",
    lookupParams: {"target_custody_type":"$target_custody_type"},
  }),
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "assets.assignments.filters.employee",
  }),
  filter.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
    placement: "advanced",
    labelKey: "assets.assignments.filters.department",
  }),
  filter.lookup("pic_employee", "PIC", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "assets.assignments.filters.pic_employee",
  }),
  filter.lookup("location", "Target Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "assets.assignments.filters.location",
  }),
  filter.lookup("facility", "Target Facility", "/api/administration/organization/lookup/facilities/", {
    placement: "advanced",
    labelKey: "assets.assignments.filters.facility",
    dependsOn: "location",
    lookupParams: {"location_id":"$location"},
  }),
  filter.lookup("company", "Owner Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "assets.assignments.filters.company",
  }),
  filter.lookup("source_location", "Source Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "assets.assignments.filters.source_location",
  }),
  filter.select("is_cross_company", "Cross-Company", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "assets.assignments.filters.is_cross_company",
  }),
  filter.select("handover_condition", "Handover Condition", [
    { label: "Good", value: "GOOD" },
    { label: "Fair", value: "FAIR" },
    { label: "Damaged", value: "DAMAGED" },
    { label: "Unserviceable", value: "UNSERVICEABLE" },
  ], {
    placement: "quick",
    labelKey: "assets.assignments.filters.handover_condition",
  }),
  filter.select("is_active", "is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "assets.assignments.filters.is_active",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): source_custody, employee_company, employee_location, employee_department, resulting_custody, completed_by
  ],
})