import { createFilters, filter } from "@framework"

export const approvalsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search approvals...",
  },

  advanced: true,

  items: [
  filter.lookup("instance", "Instance", null, {
    placement: "advanced",
  }),
  filter.lookup("step", "Step", null, {
    placement: "advanced",
  }),
  filter.lookup("approver", "Approver", null, {
    placement: "advanced",
  }),
  filter.text("status", "Status", {
    placement: "advanced",
  }),
  ],
})