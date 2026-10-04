import { createFilters, filter } from "@framework"

export const businessTripLegsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search businessTripLegs...",
    placeholderKey: "hr.business-trip-legs.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("trip", "Business Trip", "/api/hr/business-trips/", {
    placement: "advanced",
    labelKey: "hr.business-trip-legs.filters.trip",
  }),
  filter.select("direction", "Direction", [
    { label: "Outbound", value: "outbound" },
    { label: "Return", value: "return" },
    { label: "Intermediate", value: "intermediate" },
  ], {
    placement: "quick",
    labelKey: "hr.business-trip-legs.filters.direction",
  }),
  filter.lookup("transport_mode", "Transport", "/api/administration/references/hr/lookup/transport-modes/", {
    placement: "advanced",
    labelKey: "hr.business-trip-legs.filters.transport_mode",
  }),
  filter.select("accommodation_needed", "Accommodation Needed", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.business-trip-legs.filters.accommodation_needed",
  }),
  filter.lookup("accommodation_type", "Accommodation Type", "/api/administration/references/hr/lookup/accommodation-types/", {
    placement: "advanced",
    labelKey: "hr.business-trip-legs.filters.accommodation_type",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.business-trip-legs.filters.is_active",
  }),
  ],
})