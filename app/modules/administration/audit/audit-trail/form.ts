import { createForm, field } from "@framework"

export const auditTrailForm = createForm([
  field.text("action", "Action", {
      "required": true,
      "tab": "general"
    }),

  field.text("module", "Module", {
      "required": true,
      "tab": "general"
    }),

  field.text("object_type", "Object Type", {
      "tab": "general"
    }),

  field.text("object_id", "Object ID", {
      "tab": "general"
    }),

  field.text("object_repr", "Object", {
      "tab": "general"
    }),

  field.text("before", "Before", {
      "tab": "general"
    }),

  field.text("after", "After", {
      "tab": "general"
    }),

  field.text("ip_address", "IP Address", {
      "tab": "general"
    }),

  field.textarea("user_agent", "User agent", {
      "layout": "full",
      "tab": "general"
    }),
], {
  columns: 2,
})