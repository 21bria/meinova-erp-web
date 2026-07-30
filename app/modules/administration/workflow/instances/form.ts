import { createForm, field } from "@framework"

export const instancesForm = createForm([
  field.text("object_type", "Object type", {
      "required": true,
      "tab": "general"
    }),

  field.text("object_id", "Object id", {
      "required": true,
      "tab": "general"
    }),

  field.text("object_repr", "Object repr", {
      "tab": "general"
    }),
], {
  columns: 2,
})