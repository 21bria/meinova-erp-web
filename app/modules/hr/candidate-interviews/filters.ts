import { createFilters, filter } from "@framework"

export const candidateInterviewsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search candidateInterviews...",
    placeholderKey: "hr.candidate-interviews.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("candidate", "Candidate", "/api/hr/lookup/candidates/", {
    placement: "advanced",
    labelKey: "hr.candidate-interviews.filters.candidate",
  }),
  filter.text("stage", "Stage", {
    placement: "advanced",
    labelKey: "hr.candidate-interviews.filters.stage",
  }),
  filter.lookup("interview_type", "Interview Type", "/api/administration/references/hr/lookup/interview-types/", {
    placement: "advanced",
    labelKey: "hr.candidate-interviews.filters.interview_type",
  }),
  filter.text("scheduled_at", "Scheduled At", {
    placement: "advanced",
    labelKey: "hr.candidate-interviews.filters.scheduled_at",
  }),
  filter.lookup("interviewer", "Interviewer", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.candidate-interviews.filters.interviewer",
  }),
  filter.select("result", "Result", [
    { label: "Scheduled", value: "scheduled" },
    { label: "Passed", value: "passed" },
    { label: "Failed", value: "failed" },
    { label: "No Show", value: "no_show" },
    { label: "Cancelled", value: "cancelled" },
  ], {
    placement: "quick",
    labelKey: "hr.candidate-interviews.filters.result",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.candidate-interviews.filters.is_active",
  }),
  ],
})