import { createFilters, filter } from "@framework"

export const helpCategoriesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search helpCategories...",
    placeholderKey: "administration.help-categories.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("module", "Module", [
    { label: "General", value: "" },
    { label: "HR", value: "hr" },
    { label: "Payroll", value: "payroll" },
    { label: "Administration", value: "administration" },
    { label: "Workflow", value: "workflow" },
    { label: "Finance", value: "finance" },
    { label: "Supply Chain", value: "scm" },
  ], {
    placement: "quick",
    labelKey: "administration.help-categories.filters.module",
  }),
  filter.select("is_published", "Published", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.help-categories.filters.is_published",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.help-categories.filters.is_active",
  }),
  ],
})