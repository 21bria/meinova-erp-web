import { createForm, field } from "@framework"

export const provincesForm = createForm([
  field.lookup("country", "Country", "/api/administration/references/geography/lookup/countries/", {
      "labelKey": "references.geography.provinces.fields.country",
      "required": true,
      "displayKey": "country_name",
      "tab": "general",
      "order": 10
    }),

  field.text("aid", "Area ID", {
      "labelKey": "references.geography.provinces.fields.aid",
      "placeholder": "e.g. 11",
      "hint": "Kode wilayah Kemendagri. Diisi otomatis oleh import dan dipakai sebagai identitas baris — jangan diubah manual.",
      "default": "",
      "tab": "general",
      "order": 15
    }),

  field.text("code", "Code", {
      "labelKey": "references.geography.provinces.fields.code",
      "required": true,
      "placeholder": "e.g. 11",
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Name", {
      "labelKey": "references.geography.provinces.fields.name",
      "required": true,
      "placeholder": "Province name",
      "tab": "general",
      "order": 30
    }),

  field.switch("is_active", "Active", {
      "labelKey": "references.geography.provinces.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})