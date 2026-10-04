import { createFilters, filter } from "@framework"

export const instancesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search instances...",
    placeholderKey: "workflow.instances.placeholder.search",
  },

  advanced: true,

  items: [
  filter.text("document_number", "Document No.", {
    placement: "advanced",
    labelKey: "workflow.instances.filters.document_number",
  }),
  filter.text("module", "Module", {
    placement: "advanced",
    labelKey: "workflow.instances.filters.module",
  }),
  filter.text("document_type", "Document Type", {
    placement: "advanced",
    labelKey: "workflow.instances.filters.document_type",
  }),
  filter.lookup("subject_employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "workflow.instances.filters.subject_employee",
  }),
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Returned", value: "returned" },
    { label: "Cancelled", value: "cancelled" },
  ], {
    placement: "quick",
    labelKey: "workflow.instances.filters.status",
  }),
  filter.text("submitted_at", "Submitted At", {
    placement: "advanced",
    labelKey: "workflow.instances.filters.submitted_at",
  }),
  filter.text("completed_at", "Completed At", {
    placement: "advanced",
    labelKey: "workflow.instances.filters.completed_at",
  }),
  ],
})