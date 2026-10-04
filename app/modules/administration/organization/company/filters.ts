import { createFilters, filter } from "@framework"

export const companyFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search company...",
    placeholderKey: "administration.organization.company.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("parent", "Parent Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "administration.organization.company.filters.parent",
  }),
  filter.lookup("company_type", "Company Type", "/api/administration/references/organization/lookup/company-types/", {
    placement: "quick",
    labelKey: "administration.organization.company.filters.company_type",
  }),
  filter.lookup("country", "Country", "/api/administration/references/geography/lookup/countries/", {
    placement: "advanced",
    labelKey: "administration.organization.company.filters.country",
  }),
  filter.lookup("province", "Province", "/api/administration/references/geography/lookup/provinces/", {
    placement: "advanced",
    labelKey: "administration.organization.company.filters.province",
    dependsOn: "country",
    lookupParams: {"country_id":"$country"},
  }),
  filter.lookup("city", "City", "/api/administration/references/geography/lookup/cities/", {
    placement: "advanced",
    labelKey: "administration.organization.company.filters.city",
    dependsOn: "province",
    lookupParams: {"province_id":"$province"},
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.organization.company.filters.is_active",
  }),
  ],
})