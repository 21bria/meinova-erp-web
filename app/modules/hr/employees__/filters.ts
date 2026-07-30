import { createFilters, filter } from "@framework"

export const employeesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search employees...",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  filter.lookup("user", "User", "/api/accounts/users/lookup/", {
    placement: "advanced",
  }),
  filter.lookup("gender", "Gender", "/api/administration/lookup/genders/", {
    placement: "advanced",
  }),
  filter.lookup("religion", "Religion", "/api/administration/lookup/religions/", {
    placement: "advanced",
  }),
  filter.lookup("nationality", "Nationality", "/api/administration/lookup/nationalities/", {
    placement: "advanced",
  }),
  filter.lookup("blood_type", "Blood Type", "/api/references/hr/blood-types/lookup/", {
    placement: "advanced",
  }),
  filter.lookup("marital_status", "Marital Status", "/api/references/hr/marital-status/lookup/", {
    placement: "advanced",
  }),
  ],
})