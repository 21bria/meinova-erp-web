import { createFilters, filter } from "@framework"

export const transfersFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search transfers...",
    placeholderKey: "assets.transfers.placeholder.search",
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
    labelKey: "assets.transfers.filters.status",
  }),
  filter.lookup("asset", "Asset", "/api/assets/lookup/transferable-assets/", {
    placement: "advanced",
    labelKey: "assets.transfers.filters.asset",
  }),
  filter.select("target_custody_type", "Transfer To", [
    { label: "Employee", value: "EMPLOYEE" },
    { label: "Organization", value: "ORGANIZATION" },
    { label: "Storage", value: "STORAGE" },
  ], {
    placement: "quick",
    labelKey: "assets.transfers.filters.target_custody_type",
  }),
  filter.select("reason", "Reason", [
    { label: "Reassignment", value: "REASSIGNMENT" },
    { label: "PIC change", value: "PIC_CHANGE" },
    { label: "Relocation", value: "RELOCATION" },
    { label: "Reorganization", value: "REORGANIZATION" },
    { label: "Other", value: "OTHER" },
  ], {
    placement: "quick",
    labelKey: "assets.transfers.filters.reason",
  }),
  filter.lookup("target_employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "assets.transfers.filters.target_employee",
  }),
  filter.lookup("target_department", "Department", "/api/administration/organization/lookup/departments/", {
    placement: "advanced",
    labelKey: "assets.transfers.filters.target_department",
  }),
  filter.lookup("target_pic_employee", "PIC", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "assets.transfers.filters.target_pic_employee",
  }),
  filter.lookup("target_location", "Target Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "assets.transfers.filters.target_location",
  }),
  filter.lookup("target_facility", "Target Facility", "/api/administration/organization/lookup/facilities/", {
    placement: "advanced",
    labelKey: "assets.transfers.filters.target_facility",
    dependsOn: "target_location",
    lookupParams: {"location_id":"$target_location"},
  }),
  filter.lookup("company", "Owner Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "assets.transfers.filters.company",
  }),
  filter.select("source_custody_type", "From", [
    { label: "Employee", value: "EMPLOYEE" },
    { label: "Organization", value: "ORGANIZATION" },
    { label: "Storage", value: "STORAGE" },
  ], {
    placement: "quick",
    labelKey: "assets.transfers.filters.source_custody_type",
  }),
  filter.lookup("source_employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "assets.transfers.filters.source_employee",
  }),
  filter.lookup("source_department", "Department", "/api/administration/organization/lookup/departments/", {
    placement: "advanced",
    labelKey: "assets.transfers.filters.source_department",
  }),
  filter.lookup("source_location", "Source Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "assets.transfers.filters.source_location",
  }),
  filter.select("is_cross_company", "Cross-Company", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "assets.transfers.filters.is_cross_company",
  }),
  filter.select("transfer_condition", "Transfer Condition", [
    { label: "Good", value: "GOOD" },
    { label: "Fair", value: "FAIR" },
    { label: "Damaged", value: "DAMAGED" },
    { label: "Unserviceable", value: "UNSERVICEABLE" },
  ], {
    placement: "quick",
    labelKey: "assets.transfers.filters.transfer_condition",
  }),
  filter.select("is_active", "is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "assets.transfers.filters.is_active",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): source_custody, employee_company, employee_location, employee_department, resulting_custody, completed_by
  ],
})