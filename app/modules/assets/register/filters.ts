import { createFilters, filter } from "@framework"

export const registerFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search register...",
    placeholderKey: "assets.register.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("status", "Status", [
    { label: "Draft", value: "DRAFT" },
    { label: "Active", value: "ACTIVE" },
  ], {
    placement: "quick",
    labelKey: "assets.register.filters.status",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "assets.register.filters.company",
  }),
  filter.lookup("category", "Category", "/api/assets/lookup/asset-categories/", {
    placement: "advanced",
    labelKey: "assets.register.filters.category",
  }),
  filter.select("condition", "Condition", [
    { label: "Good", value: "GOOD" },
    { label: "Fair", value: "FAIR" },
    { label: "Damaged", value: "DAMAGED" },
    { label: "Unserviceable", value: "UNSERVICEABLE" },
  ], {
    placement: "quick",
    labelKey: "assets.register.filters.condition",
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "assets.register.filters.location",
    dependsOn: "company",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("facility", "Facility", "/api/administration/organization/lookup/facilities/", {
    placement: "advanced",
    labelKey: "assets.register.filters.facility",
    dependsOn: "location",
    lookupParams: {"company_id":"$company","location_id":"$location"},
  }),
  filter.text("acquisition_date", "Acquisition Date", {
    placement: "advanced",
    labelKey: "assets.register.filters.acquisition_date",
  }),
  filter.select("is_active", "is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "assets.register.filters.is_active",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): current_custody, activated_by
  ],
})