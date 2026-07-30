import { createForm, field } from "@framework"

export const citiesForm = createForm([
  field.lookup("province", "Province", "/api/administration/references/geography/lookup/provinces/", {
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("code", "Code", {
      "required": true,
      "placeholder": "e.g. JKT",
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Name", {
      "required": true,
      "placeholder": "City name",
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