import { createForm, field } from "@framework"

export const auditTrailForm = createForm([
  field.select("action", "Action", {
      "labelKey": "administration.audit.audit-trail.fields.action",
      "required": true,
      "multiple": false,
      "tab": "general",
      "options": [
        {
          "value": "LOGIN",
          "label": "Login"
        },
        {
          "value": "LOGOUT",
          "label": "Logout"
        },
        {
          "value": "CREATE",
          "label": "Create"
        },
        {
          "value": "UPDATE",
          "label": "Update"
        },
        {
          "value": "DELETE",
          "label": "Delete"
        },
        {
          "value": "APPROVE",
          "label": "Approve"
        },
        {
          "value": "REJECT",
          "label": "Reject"
        },
        {
          "value": "SUBMIT",
          "label": "Submit"
        },
        {
          "value": "CANCEL",
          "label": "Cancel"
        },
        {
          "value": "IMPORT",
          "label": "Import"
        },
        {
          "value": "EXPORT",
          "label": "Export"
        },
        {
          "value": "CLOSE_PERIOD",
          "label": "Close Period"
        },
        {
          "value": "REOPEN_PERIOD",
          "label": "Reopen Period"
        }
      ]
    }),

  field.text("module", "Module", {
      "labelKey": "administration.audit.audit-trail.fields.module",
      "required": true,
      "tab": "general"
    }),

  field.text("object_type", "Object Type", {
      "labelKey": "administration.audit.audit-trail.fields.object_type",
      "tab": "general"
    }),

  field.text("object_id", "Object ID", {
      "labelKey": "administration.audit.audit-trail.fields.object_id",
      "tab": "general"
    }),

  field.text("object_repr", "Object", {
      "labelKey": "administration.audit.audit-trail.fields.object_repr",
      "tab": "general"
    }),

  field.text("before", "Before", {
      "labelKey": "administration.audit.audit-trail.fields.before",
      "tab": "general"
    }),

  field.text("after", "After", {
      "labelKey": "administration.audit.audit-trail.fields.after",
      "tab": "general"
    }),

  field.text("ip_address", "IP Address", {
      "labelKey": "administration.audit.audit-trail.fields.ip_address",
      "tab": "general"
    }),

  field.textarea("user_agent", "User agent", {
      "labelKey": "administration.audit.audit-trail.fields.user_agent",
      "layout": "full",
      "tab": "general"
    }),
], {
  columns: 2,
})