import { createFilters, filter } from "@framework"

export const branchFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search branch...",
    placeholderKey: "administration.organization.branch.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
    labelKey: "administration.organization.branch.filters.company",
  }),
  filter.lookup("country", "Country", "/api/administration/references/geography/lookup/countries/", {
    placement: "advanced",
    labelKey: "administration.organization.branch.filters.country",
  }),
  filter.lookup("province", "Province", "/api/administration/references/geography/lookup/provinces/", {
    placement: "advanced",
    labelKey: "administration.organization.branch.filters.province",
    dependsOn: "country",
    lookupParams: {"country_id":"$country"},
  }),
  filter.lookup("city", "City", "/api/administration/references/geography/lookup/cities/", {
    placement: "advanced",
    labelKey: "administration.organization.branch.filters.city",
    dependsOn: "province",
    lookupParams: {"province_id":"$province"},
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.organization.branch.filters.is_active",
  }),
  ],
})