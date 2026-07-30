import { createFilters, filter } from "@framework"

export const permissionFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search permission...",
  },

  advanced: true,

  items: [
    filter.text("module", "Module", {
      placement: "quick",
      placeholder: "Module",
    }),

    filter.text("model", "Model", {
      placement: "advanced",
      placeholder: "Model",
    }),
  ],
})