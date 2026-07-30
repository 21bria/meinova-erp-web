import { createFilters, filter } from "@framework"

export const __name__Filters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search __name__...",
  },

  advanced: true,

  items: [
__FILTER_ITEMS__
  ],
})