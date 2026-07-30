import { createFilters, filter } from "@framework"

export const delegationsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search delegations...",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  filter.lookup("company", "Company", null, {
    placement: "advanced",
  }),
  filter.lookup("site", "Site", null, {
    placement: "advanced",
  }),
  filter.lookup("workflow", "Workflow", null, {
    placement: "advanced",
  }),
  filter.lookup("delegator", "Delegator", null, {
    placement: "advanced",
  }),
  filter.lookup("delegate", "Delegate", null, {
    placement: "advanced",
  }),
  ],
})