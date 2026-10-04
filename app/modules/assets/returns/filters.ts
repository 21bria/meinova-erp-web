import { createFilters, filter } from "@framework"

export const returnsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search returns...",
    placeholderKey: "assets.returns.placeholder.search",
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
    labelKey: "assets.returns.filters.status",
  }),
  filter.lookup("asset", "Asset", "/api/assets/lookup/assets-in-use/", {
    placement: "advanced",
    labelKey: "assets.returns.filters.asset",
  }),
  filter.select("reason", "Reason", [
    { label: "End of use", value: "END_OF_USE" },
    { label: "Separation", value: "SEPARATION" },
    { label: "Replacement", value: "REPLACEMENT" },
    { label: "Damage", value: "DAMAGE" },
    { label: "Other", value: "OTHER" },
  ], {
    placement: "quick",
    labelKey: "assets.returns.filters.reason",
  }),
  filter.lookup("destination_location", "Storage Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "assets.returns.filters.destination_location",
  }),
  filter.lookup("destination_facility", "Storage Facility", "/api/administration/organization/lookup/facilities/", {
    placement: "advanced",
    labelKey: "assets.returns.filters.destination_facility",
    dependsOn: "destination_location",
    lookupParams: {"location_id":"$destination_location"},
  }),
  filter.lookup("company", "Owner Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "assets.returns.filters.company",
  }),
  filter.select("source_custody_type", "Returned From", [
    { label: "Employee", value: "EMPLOYEE" },
    { label: "Organization", value: "ORGANIZATION" },
  ], {
    placement: "quick",
    labelKey: "assets.returns.filters.source_custody_type",
  }),
  filter.lookup("source_employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "assets.returns.filters.source_employee",
  }),
  filter.lookup("source_department", "Department", "/api/administration/organization/lookup/departments/", {
    placement: "advanced",
    labelKey: "assets.returns.filters.source_department",
  }),
  filter.lookup("source_pic_employee", "PIC", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "assets.returns.filters.source_pic_employee",
  }),
  filter.lookup("source_location", "Source Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "assets.returns.filters.source_location",
  }),
  filter.select("return_condition", "Return Condition", [
    { label: "Good", value: "GOOD" },
    { label: "Fair", value: "FAIR" },
    { label: "Damaged", value: "DAMAGED" },
    { label: "Unserviceable", value: "UNSERVICEABLE" },
  ], {
    placement: "quick",
    labelKey: "assets.returns.filters.return_condition",
  }),
  filter.select("is_active", "is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "assets.returns.filters.is_active",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): source_custody, source_facility, resulting_custody, completed_by
  ],
})