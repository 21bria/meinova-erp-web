import { createFilters, filter } from "@framework"

export const auditTrailFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search auditTrail...",
    placeholderKey: "administration.audit.audit-trail.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("action", "Action", [
    { label: "Login", value: "LOGIN" },
    { label: "Logout", value: "LOGOUT" },
    { label: "Create", value: "CREATE" },
    { label: "Update", value: "UPDATE" },
    { label: "Delete", value: "DELETE" },
    { label: "Approve", value: "APPROVE" },
    { label: "Reject", value: "REJECT" },
    { label: "Submit", value: "SUBMIT" },
    { label: "Cancel", value: "CANCEL" },
    { label: "Import", value: "IMPORT" },
    { label: "Export", value: "EXPORT" },
    { label: "Close Period", value: "CLOSE_PERIOD" },
    { label: "Reopen Period", value: "REOPEN_PERIOD" },
  ], {
    placement: "quick",
    labelKey: "administration.audit.audit-trail.filters.action",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): company, location, user
  ],
})