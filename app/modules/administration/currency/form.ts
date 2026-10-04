import { createForm, field } from "@framework"

export const currencyForm = createForm([
  field.switch("is_active", "Is active", {
      "labelKey": "administration.currency.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.text("code", "Code", {
      "labelKey": "administration.currency.fields.code",
      "required": true,
      "tab": "general"
    }),

  field.text("name", "Name", {
      "labelKey": "administration.currency.fields.name",
      "required": true,
      "tab": "general"
    }),

  field.text("symbol", "Symbol", {
      "labelKey": "administration.currency.fields.symbol",
      "required": true,
      "tab": "general"
    }),

  field.number("decimal_places", "Decimal places", {
      "labelKey": "administration.currency.fields.decimal_places",
      "default": 2,
      "tab": "general"
    }),

  field.switch("is_base_currency", "Is base currency", {
      "labelKey": "administration.currency.fields.is_base_currency",
      "default": false,
      "tab": "general"
    }),
], {
  columns: 2,
})