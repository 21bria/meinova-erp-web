import { createFilters, filter } from "@framework"

export const accountingDimensionsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search accountingDimensions...",
    placeholderKey: "finance.accounting-dimensions.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("data_type", "Data Type", [
    { label: "Reference", value: "reference" },
    { label: "Text", value: "text" },
  ], {
    placement: "quick",
    labelKey: "finance.accounting-dimensions.filters.data_type",
  }),
  filter.select("is_required", "Required on Every Line", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "finance.accounting-dimensions.filters.is_required",
  }),
  ],
})