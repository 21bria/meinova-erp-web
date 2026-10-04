import { createFilters, filter } from "@framework"

export const printSettingsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search printSettings...",
    placeholderKey: "administration.settings.print-settings.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
    labelKey: "administration.settings.print-settings.filters.company",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.settings.print-settings.filters.is_active",
  }),
  filter.select("show_logo", "Show logo", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.settings.print-settings.filters.show_logo",
  }),
  filter.select("show_footer", "Show footer", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.settings.print-settings.filters.show_footer",
  }),
  ],
})