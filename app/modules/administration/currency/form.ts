import { createForm, field } from "@framework"

export const currencyForm = createForm([
  field.switch("is_active", "Is active", {
      "tab": "general"
    }),

  field.text("code", "Code", {
      "required": true,
      "tab": "general"
    }),

  field.text("name", "Name", {
      "required": true,
      "tab": "general"
    }),

  field.text("symbol", "Symbol", {
      "required": true,
      "tab": "general"
    }),

  field.text("decimal_places", "Decimal places", {
      "tab": "general"
    }),

  field.switch("is_base_currency", "Is base currency", {
      "tab": "general"
    }),
], {
  columns: 2,
})