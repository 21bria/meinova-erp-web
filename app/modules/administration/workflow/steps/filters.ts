import { createFilters, filter } from "@framework"

export const stepsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search steps...",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  filter.lookup("workflow", "Workflow", null, {
    placement: "advanced",
  }),
  filter.text("approver_type", "Approver type", {
    placement: "advanced",
  }),
  filter.lookup("approver_user", "Approver user", null, {
    placement: "advanced",
  }),
  filter.select("require_all", "Require all", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  ],
})