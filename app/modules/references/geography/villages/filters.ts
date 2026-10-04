import { createFilters, filter } from "@framework"

export const villagesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search villages...",
    placeholderKey: "references.geography.villages.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("district__city", "Kabupaten/Kota", "/api/administration/references/geography/lookup/cities/", {
    placement: "quick",
    labelKey: "references.geography.villages.filters.district__city",
  }),
  filter.lookup("district", "Kecamatan", "/api/administration/references/geography/lookup/districts/", {
    placement: "quick",
    labelKey: "references.geography.villages.filters.district",
    dependsOn: ["district__city"],
    lookupParams: {"city_id":"$district__city"},
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.geography.villages.filters.is_active",
  }),
  ],
})