import { createFilters, filter } from "@framework"

export const usersFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search users...",
    placeholderKey: "administration.security.users.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.security.users.filters.is_active",
  }),
  filter.select("is_staff", "Staff", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.security.users.filters.is_staff",
  }),
  filter.select("is_superuser", "Superuser", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.security.users.filters.is_superuser",
  }),
  filter.select("language", "language", [
    { label: "English", value: "en" },
    { label: "Bahasa Indonesia", value: "id" },
  ], {
    placement: "quick",
    labelKey: "administration.security.users.filters.language",
  }),
  ],
})