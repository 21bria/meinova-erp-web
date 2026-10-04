import { createForm, field } from "@framework"

export const citiesForm = createForm([
  field.lookup("province", "Province", "/api/administration/references/geography/lookup/provinces/", {
      "labelKey": "references.geography.cities.fields.province",
      "required": true,
      "displayKey": "province_name",
      "tab": "general",
      "order": 10
    }),

  field.text("aid", "Area ID", {
      "labelKey": "references.geography.cities.fields.aid",
      "placeholder": "e.g. 11.01",
      "hint": "Kode wilayah Kemendagri. Diisi otomatis oleh import dan dipakai sebagai identitas baris — jangan diubah manual.",
      "default": "",
      "tab": "general",
      "order": 15
    }),

  field.text("code", "Code", {
      "labelKey": "references.geography.cities.fields.code",
      "required": true,
      "placeholder": "e.g. 11.01",
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Name", {
      "labelKey": "references.geography.cities.fields.name",
      "required": true,
      "placeholder": "Kabupaten/Kota name",
      "tab": "general",
      "order": 30
    }),

  field.switch("is_active", "Active", {
      "labelKey": "references.geography.cities.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})