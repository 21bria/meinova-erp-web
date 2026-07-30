import { createForm, field } from "@framework"

export const countriesForm = createForm([
  field.text("code", "Code", {
      "required": true,
      "placeholder": "e.g. ID",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "required": true,
      "placeholder": "Country name",
      "tab": "general",
      "order": 20
    }),

  field.text("phone_code", "Phone Code", {
      "required": true,
      "placeholder": "e.g. +62",
      "tab": "general",
      "order": 30
    }),

  field.text("currency_code", "Currency Code", {
      "required": true,
      "placeholder": "e.g. IDR",
      "tab": "general",
      "order": 40
    }),

  field.switch("is_active", "Active", {
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})