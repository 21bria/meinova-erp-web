import { createFilters, filter } from "@framework"

export const stepsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search steps...",
    placeholderKey: "workflow.steps.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("definition", "Workflow", "/api/workflow/lookup/workflow-definitions/", {
    placement: "advanced",
    labelKey: "workflow.steps.filters.definition",
  }),
  filter.select("approver_type", "Approver Type", [
    { label: "Direct Manager", value: "manager" },
    { label: "Role Holder", value: "role" },
    { label: "Specific User", value: "user" },
    { label: "Position Hierarchy", value: "position" },
    { label: "Department Head", value: "department_head" },
  ], {
    placement: "quick",
    labelKey: "workflow.steps.filters.approver_type",
  }),
  filter.lookup("approver_role", "Role", "/api/accounts/lookup/roles/", {
    placement: "advanced",
    labelKey: "workflow.steps.filters.approver_role",
  }),
  filter.select("approver_scope", "Role Scope", [
    { label: "Entire Tenant", value: "tenant" },
    { label: "Company", value: "company" },
    { label: "Branch", value: "branch" },
    { label: "Location", value: "location" },
    { label: "Division", value: "division" },
    { label: "Department", value: "department" },
    { label: "Section", value: "section" },
  ], {
    placement: "quick",
    labelKey: "workflow.steps.filters.approver_scope",
  }),
  filter.lookup("approver_user", "User", "/api/accounts/lookup/users/", {
    placement: "advanced",
    labelKey: "workflow.steps.filters.approver_user",
  }),
  filter.lookup("approver_position", "Position", "/api/administration/organization/lookup/positions/", {
    placement: "advanced",
    labelKey: "workflow.steps.filters.approver_position",
  }),
  filter.select("approval_mode", "Approval Mode", [
    { label: "Any Approver", value: "any" },
    { label: "All Approvers", value: "all" },
  ], {
    placement: "quick",
    labelKey: "workflow.steps.filters.approval_mode",
  }),
  filter.select("is_required", "Required", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "workflow.steps.filters.is_required",
  }),
  filter.select("can_reject", "Can Reject", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "workflow.steps.filters.can_reject",
  }),
  filter.select("can_return", "Can Return", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "workflow.steps.filters.can_return",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "workflow.steps.filters.is_active",
  }),
  ],
})