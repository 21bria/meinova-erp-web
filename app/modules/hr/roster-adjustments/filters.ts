import { createFilters, filter } from "@framework"

export const rosterAdjustmentsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search rosterAdjustments...",
    placeholderKey: "hr.roster-adjustments.placeholder.search",
  },

  advanced: true,

  items: [
  filter.text("document_number", "Document No.", {
    placement: "advanced",
    labelKey: "hr.roster-adjustments.filters.document_number",
  }),
  filter.lookup("plan", "Roster Plan", "/api/hr/lookup/roster-plans/", {
    placement: "advanced",
    labelKey: "hr.roster-adjustments.filters.plan",
  }),
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.roster-adjustments.filters.employee",
  }),
  filter.select("adjustment_kind", "Adjustment Type", [
    { label: "Work Extension", value: "work_extension" },
    { label: "Early Return", value: "early_return" },
    { label: "Deferred Leave (KTT approved)", value: "deferred_leave" },
    { label: "Late Return (employee fault)", value: "late_return" },
    { label: "Deferred Leave (no approval)", value: "loyalty" },
    { label: "No Impact (beyond employee control)", value: "no_impact" },
    { label: "Schedule Shift", value: "schedule_shift" },
    { label: "Use Rotation Credit", value: "credit_use" },
  ], {
    placement: "quick",
    labelKey: "hr.roster-adjustments.filters.adjustment_kind",
  }),
  filter.text("effective_date", "Effective Date", {
    placement: "advanced",
    labelKey: "hr.roster-adjustments.filters.effective_date",
  }),
  filter.select("credit_impact", "Rotation Credit", [
    { label: "No Credit Impact", value: "none" },
    { label: "Earn Credit", value: "earn" },
    { label: "Use Credit", value: "use" },
  ], {
    placement: "quick",
    labelKey: "hr.roster-adjustments.filters.credit_impact",
  }),
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Pending Approval", value: "submitted" },
    { label: "Approved", value: "approved" },
    { label: "Applied", value: "applied" },
    { label: "Rejected", value: "rejected" },
    { label: "Cancelled", value: "cancelled" },
  ], {
    placement: "quick",
    labelKey: "hr.roster-adjustments.filters.status",
  }),
  ],
})