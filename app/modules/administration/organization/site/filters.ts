import { createFilters, filter } from "@framework"

export const siteFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search site...",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
  }),
  filter.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
    placement: "quick",
  }),
  filter.lookup("site_type", "Site Type", "/api/administration/references/organization/lookup/site-types/", {
    placement: "quick",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  filter.lookup("country", "Country", null, {
    placement: "advanced",
  }),
  filter.lookup("province", "Province", null, {
    placement: "advanced",
  }),
  filter.lookup("city", "City", null, {
    placement: "advanced",
  }),
  ],
})