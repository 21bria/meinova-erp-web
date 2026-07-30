import { createFilters, filter } from "@framework"

export const instancesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search instances...",
  },

  advanced: true,

  items: [
  filter.lookup("workflow", "Workflow", null, {
    placement: "advanced",
  }),
  filter.lookup("company", "Company", null, {
    placement: "advanced",
  }),
  filter.lookup("site", "Site", null, {
    placement: "advanced",
  }),
  filter.lookup("current_step", "Current step", null, {
    placement: "advanced",
  }),
  filter.lookup("requested_by", "Requested by", null, {
    placement: "advanced",
  }),
  filter.text("status", "Status", {
    placement: "advanced",
  }),
  ],
})