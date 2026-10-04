import { createFilters, filter } from "@framework"

export const accountMappingsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search accountMappings...",
    placeholderKey: "finance.account-mappings.placeholder.search",
  },

  advanced: true,

  items: [
  filter.text("mapping_key", "Mapping Key", {
    placement: "quick",
    labelKey: "finance.account-mappings.filters.mapping_key",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
    labelKey: "finance.account-mappings.filters.company",
  }),
  filter.text("event_type", "Event Type", {
    placement: "quick",
    labelKey: "finance.account-mappings.filters.event_type",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "finance.account-mappings.filters.is_active",
  }),
  filter.lookup("account", "Account", "/api/finance/lookup/accounts/", {
    placement: "advanced",
    labelKey: "finance.account-mappings.filters.account",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("location", "Site", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "finance.account-mappings.filters.location",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
    placement: "advanced",
    labelKey: "finance.account-mappings.filters.department",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("cost_center", "Cost Center", "/api/administration/organization/lookup/cost-centers/", {
    placement: "advanced",
    labelKey: "finance.account-mappings.filters.cost_center",
    lookupParams: {"company_id":"$company"},
  }),
  ],
})