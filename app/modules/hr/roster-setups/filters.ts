import { createFilters, filter } from "@framework"

export const rosterSetupsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search rosterSetups...",
    placeholderKey: "hr.roster-setups.placeholder.search",
  },

  advanced: true,

  items: [
  filter.text("document_number", "Document No.", {
    placement: "advanced",
    labelKey: "hr.roster-setups.filters.document_number",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "hr.roster-setups.filters.company",
  }),
  filter.lookup("location", "Site", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "hr.roster-setups.filters.location",
    dependsOn: "company",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
    placement: "advanced",
    labelKey: "hr.roster-setups.filters.department",
    dependsOn: ["company","location"],
    lookupParams: {"company_id":"$company","location_id":"$location"},
  }),
  filter.lookup("section", "Section", "/api/administration/organization/lookup/sections/", {
    placement: "advanced",
    labelKey: "hr.roster-setups.filters.section",
    dependsOn: ["company","location"],
    lookupParams: {"company_id":"$company","location_id":"$location","department_id":"$department"},
  }),
  filter.text("as_of_date", "As Of Date", {
    placement: "advanced",
    labelKey: "hr.roster-setups.filters.as_of_date",
  }),
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Pending Approval", value: "submitted" },
    { label: "Approved", value: "approved" },
    { label: "Committed", value: "committed" },
    { label: "Partially Committed", value: "partial" },
    { label: "Rejected", value: "rejected" },
    { label: "Cancelled", value: "cancelled" },
  ], {
    placement: "quick",
    labelKey: "hr.roster-setups.filters.status",
  }),
  ],
})