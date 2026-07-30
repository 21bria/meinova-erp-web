import { createForm, field } from "@framework"

export const provincesForm = createForm([
  field.lookup("country", "Country", "/api/administration/references/geography/lookup/countries/", {
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("code", "Code", {
      "required": true,
      "placeholder": "e.g. DKI",
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Name", {
      "required": true,
      "placeholder": "Province name",
      "tab": "general",
      "order": 30
    }),

  field.switch("is_active", "Active", {
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})