import { createFilters, filter } from "@framework"

export const trainingFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search training...",
    placeholderKey: "hr.training.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("training_category", "Category", "/api/administration/references/hr/lookup/training-categories/", {
    placement: "advanced",
    labelKey: "hr.training.filters.training_category",
  }),
  filter.lookup("provider", "Provider", "/api/administration/references/hr/lookup/training-providers/", {
    placement: "advanced",
    labelKey: "hr.training.filters.provider",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "hr.training.filters.company",
  }),
  filter.select("status", "Status", [
    { label: "Planned", value: "planned" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ], {
    placement: "quick",
    labelKey: "hr.training.filters.status",
  }),
  filter.select("is_mandatory", "Mandatory", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.training.filters.is_mandatory",
  }),
  filter.text("start_date", "Start Date", {
    placement: "advanced",
    labelKey: "hr.training.filters.start_date",
  }),
  filter.text("end_date", "End Date", {
    placement: "advanced",
    labelKey: "hr.training.filters.end_date",
  }),
  filter.lookup("currency", "Currency", "/api/administration/currency/lookup/currencies/", {
    placement: "advanced",
    labelKey: "hr.training.filters.currency",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.training.filters.is_active",
  }),
  ],
})