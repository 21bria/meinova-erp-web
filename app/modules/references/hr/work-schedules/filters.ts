import { createFilters, filter } from "@framework"

export const workSchedulesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search workSchedules...",
    placeholderKey: "references.hr.work-schedules.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("schedule_type", "Schedule Type", [
    { label: "Weekly", value: "WEEKLY" },
    { label: "Roster", value: "ROSTER" },
    { label: "Flexible", value: "FLEXIBLE" },
  ], {
    placement: "quick",
    labelKey: "references.hr.work-schedules.filters.schedule_type",
  }),
  filter.select("is_flexible", "Flexible", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.work-schedules.filters.is_flexible",
  }),
  filter.select("crosses_midnight", "Crosses Midnight", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.work-schedules.filters.crosses_midnight",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.work-schedules.filters.is_active",
  }),
  ],
})