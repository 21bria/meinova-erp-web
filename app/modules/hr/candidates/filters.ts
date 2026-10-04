import { createFilters, filter } from "@framework"

export const candidatesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search candidates...",
    placeholderKey: "hr.candidates.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("vacancy", "Vacancy", "/api/hr/lookup/job-vacancies/", {
    placement: "advanced",
    labelKey: "hr.candidates.filters.vacancy",
  }),
  filter.lookup("status", "Status", "/api/administration/references/hr/lookup/candidate-statuses/", {
    placement: "advanced",
    labelKey: "hr.candidates.filters.status",
  }),
  filter.lookup("source", "Source", "/api/administration/references/hr/lookup/recruitment-sources/", {
    placement: "advanced",
    labelKey: "hr.candidates.filters.source",
  }),
  filter.text("applied_date", "Applied Date", {
    placement: "advanced",
    labelKey: "hr.candidates.filters.applied_date",
  }),
  filter.lookup("gender", "Gender", "/api/administration/references/hr/lookup/genders/", {
    placement: "advanced",
    labelKey: "hr.candidates.filters.gender",
  }),
  filter.lookup("education", "Education", "/api/administration/references/hr/lookup/educations/", {
    placement: "advanced",
    labelKey: "hr.candidates.filters.education",
  }),
  filter.lookup("currency", "Currency", "/api/administration/currency/lookup/currencies/", {
    placement: "advanced",
    labelKey: "hr.candidates.filters.currency",
  }),
  filter.lookup("rejection_reason", "Rejection Reason", "/api/administration/references/hr/lookup/rejection-reasons/", {
    placement: "advanced",
    labelKey: "hr.candidates.filters.rejection_reason",
  }),
  filter.lookup("hired_employee", "Hired Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.candidates.filters.hired_employee",
  }),
  filter.text("hired_date", "Hired Date", {
    placement: "advanced",
    labelKey: "hr.candidates.filters.hired_date",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.candidates.filters.is_active",
  }),
  ],
})