import { createForm, field } from "@framework"

export const costCenterForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.lookup("site", "Site", "/api/administration/organization/lookup/sites/", {
      "tab": "general",
      "order": 20
    }),

  field.text("code", "Cost Center Code", {
      "required": true,
      "placeholder": "e.g. CC-001",
      "tab": "general",
      "order": 30
    }),

  field.text("name", "Cost Center Name", {
      "required": true,
      "placeholder": "e.g. Mining Operation",
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