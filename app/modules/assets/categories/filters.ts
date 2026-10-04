import { createFilters, filter } from "@framework"

export const categoriesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search categories...",
    placeholderKey: "assets.categories.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "assets.categories.filters.is_active",
  }),
  filter.select("requires_serial_number", "Requires Serial Number", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "assets.categories.filters.requires_serial_number",
  }),
  filter.select("allow_employee_custody", "Employee Custody", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "assets.categories.filters.allow_employee_custody",
  }),
  filter.select("allow_organization_custody", "Organization Custody", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "assets.categories.filters.allow_organization_custody",
  }),
  ],
})