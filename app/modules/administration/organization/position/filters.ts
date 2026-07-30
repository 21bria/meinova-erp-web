import { createFilters, filter } from "@framework"

export const positionFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search position...",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
  }),
  filter.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
    placement: "quick",
  }),
  filter.lookup("site", "Site", "/api/administration/organization/lookup/sites/", {
    placement: "advanced",
  }),
  filter.lookup("division", "Division", "/api/administration/organization/lookup/divisions/", {
    placement: "advanced",
  }),
  filter.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
    placement: "advanced",
  }),
  filter.lookup("section", "Section", "/api/administration/organization/lookup/sections/", {
    placement: "advanced",
  }),
  filter.lookup("job_category", "Job Category", "/api/administration/references/hr/lookup/job-categories/", {
    placement: "advanced",
  }),
  filter.lookup("job_level", "Job Level", "/api/administration/references/hr/lookup/job-levels/", {
    placement: "advanced",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  filter.lookup("reports_to", "Reports to", null, {
    placement: "advanced",
  }),
  filter.select("is_manager", "Is manager", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  ],
})