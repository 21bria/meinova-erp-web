import { createFilters, filter } from "@framework"

export const auditTrailFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search auditTrail...",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", null, {
    placement: "advanced",
  }),
  filter.lookup("site", "Site", null, {
    placement: "advanced",
  }),
  filter.lookup("user", "User", null, {
    placement: "advanced",
  }),
  filter.text("action", "Action", {
    placement: "advanced",
  }),
  ],
})