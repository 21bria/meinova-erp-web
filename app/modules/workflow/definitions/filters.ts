import { createFilters, filter } from "@framework"

export const definitionsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search definitions...",
    placeholderKey: "workflow.definitions.placeholder.search",
  },

  advanced: true,

  items: [
  filter.text("module", "Module", {
    placement: "advanced",
    labelKey: "workflow.definitions.filters.module",
  }),
  filter.text("document_type", "Document Type", {
    placement: "advanced",
    labelKey: "workflow.definitions.filters.document_type",
  }),
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ], {
    placement: "quick",
    labelKey: "workflow.definitions.filters.status",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "workflow.definitions.filters.company",
  }),
  filter.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
    placement: "advanced",
    labelKey: "workflow.definitions.filters.branch",
    dependsOn: "company",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "workflow.definitions.filters.location",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","branch_id":"$branch"},
  }),
  filter.lookup("employee_group", "Employee Group", "/api/administration/references/hr/lookup/employee-groups/", {
    placement: "advanced",
    labelKey: "workflow.definitions.filters.employee_group",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "workflow.definitions.filters.is_active",
  }),
  ],
})