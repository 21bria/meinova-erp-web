import { createFilters, filter } from "@framework"

export const permissionsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search permissions...",
    placeholderKey: "administration.security.permissions.placeholder.search",
  },

  advanced: true,

  items: [

  ],
})