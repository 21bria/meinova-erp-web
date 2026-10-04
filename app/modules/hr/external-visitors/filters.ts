import { createFilters, filter } from "@framework"

export const externalVisitorsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search externalVisitors...",
    placeholderKey: "hr.external-visitors.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("identity_type", "Identity Type", [
    { label: "KTP", value: "ktp" },
    { label: "Passport", value: "passport" },
    { label: "SIM", value: "sim" },
    { label: "KITAS / KITAP", value: "kitas" },
    { label: "Other", value: "other" },
  ], {
    placement: "quick",
    labelKey: "hr.external-visitors.filters.identity_type",
  }),
  filter.lookup("gender", "Gender", "/api/administration/references/hr/lookup/genders/", {
    placement: "advanced",
    labelKey: "hr.external-visitors.filters.gender",
  }),
  filter.lookup("nationality", "Nationality", "/api/administration/references/hr/lookup/nationalities/", {
    placement: "advanced",
    labelKey: "hr.external-visitors.filters.nationality",
  }),
  filter.lookup("city", "City", "/api/administration/references/geography/lookup/cities/", {
    placement: "advanced",
    labelKey: "hr.external-visitors.filters.city",
  }),
  filter.lookup("country", "Country", "/api/administration/references/geography/lookup/countries/", {
    placement: "advanced",
    labelKey: "hr.external-visitors.filters.country",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.external-visitors.filters.is_active",
  }),
  filter.select("is_blacklisted", "Blacklisted", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.external-visitors.filters.is_blacklisted",
  }),
  ],
})