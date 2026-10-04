import { createFilters, filter } from "@framework"

export const districtsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search districts...",
    placeholderKey: "references.geography.districts.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("city__province", "Province", "/api/administration/references/geography/lookup/provinces/", {
    placement: "quick",
    labelKey: "references.geography.districts.filters.city__province",
  }),
  filter.lookup("city", "Kabupaten/Kota", "/api/administration/references/geography/lookup/cities/", {
    placement: "quick",
    labelKey: "references.geography.districts.filters.city",
    dependsOn: ["city__province"],
    lookupParams: {"province_id":"$city__province"},
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.geography.districts.filters.is_active",
  }),
  ],
})