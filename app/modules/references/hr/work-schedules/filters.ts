import { createFilters, filter } from "@framework"

export const workSchedulesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search workSchedules...",
  },

  advanced: true,

  items: [
  filter.text("schedule_type", "Schedule Type", {
    placement: "advanced",
  }),
  filter.select("is_flexible", "Flexible", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  filter.select("crosses_midnight", "Crosses Midnight", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  ],
})