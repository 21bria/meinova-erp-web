import { createFilters, filter } from "@framework"

export const tenantSettingsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search tenantSettings...",
    placeholderKey: "administration.settings.tenant-settings.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
    labelKey: "administration.settings.tenant-settings.filters.company",
  }),
  filter.lookup("currency", "Currency", "/api/administration/currency/lookup/currencies/", {
    placement: "advanced",
    labelKey: "administration.settings.tenant-settings.filters.currency",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.settings.tenant-settings.filters.is_active",
  }),
  ],
})