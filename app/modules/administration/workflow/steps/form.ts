import { createForm, field } from "@framework"

export const stepsForm = createForm([
  field.switch("is_active", "Is active", {
      "tab": "general"
    }),

  field.text("step_order", "Step order", {
      "required": true,
      "tab": "general"
    }),

  field.text("name", "Name", {
      "required": true,
      "tab": "general"
    }),

  field.text("approver_type", "Approver type", {
      "tab": "general"
    }),

  field.text("approver_role", "Approver role", {
      "tab": "general"
    }),

  field.switch("require_all", "Require all", {
      "tab": "general"
    }),
], {
  columns: 2,
})