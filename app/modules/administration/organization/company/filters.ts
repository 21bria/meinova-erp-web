import { createFilters, filter } from "@framework"

export const companyFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search company...",
  },

  advanced: true,

  items: [
  filter.lookup("parent", "Parent Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
  }),
  filter.lookup("company_type", "Company Type", "/api/administration/references/organization/lookup/company-types/", {
    placement: "quick",
  }),
  filter.lookup("country", "Country", "/api/administration/references/geography/lookup/countries/", {
    placement: "advanced",
  }),
  filter.lookup("province", "Province", "/api/administration/references/geography/lookup/provinces/", {
    placement: "advanced",
  }),
  filter.lookup("city", "City", "/api/administration/references/geography/lookup/cities/", {
    placement: "advanced",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  ],
})