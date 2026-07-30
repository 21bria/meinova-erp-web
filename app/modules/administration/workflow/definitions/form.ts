import { createForm, field } from "@framework"

export const definitionsForm = createForm([
  field.switch("is_active", "Is active", {
      "tab": "general"
    }),

  field.text("module", "Module", {
      "required": true,
      "tab": "general"
    }),

  field.text("document_type", "Document type", {
      "required": true,
      "tab": "general"
    }),

  field.text("name", "Name", {
      "required": true,
      "tab": "general"
    }),

  field.textarea("description", "Description", {
      "layout": "full",
      "tab": "general"
    }),
], {
  columns: 2,
})