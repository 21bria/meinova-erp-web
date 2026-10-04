import { createForm, field } from "@framework"

export const villagesForm = createForm([
  field.lookup("district__city", "Kabupaten/Kota", "/api/administration/references/geography/lookup/cities/", {
      "labelKey": "references.geography.villages.fields.district__city",
      "hint": "Menyaring pilihan Kecamatan. Tidak disimpan — induk yang tersimpan adalah Kecamatan.",
      "tab": "general",
      "order": 5
    }),

  field.lookup("district", "Kecamatan", "/api/administration/references/geography/lookup/districts/", {
      "labelKey": "references.geography.villages.fields.district",
      "required": true,
      "dependsOn": [
        "district__city"
      ],
      "lookupParams": {
        "city_id": "$district__city"
      },
      "displayKey": "district_name",
      "tab": "general",
      "order": 10
    }),

  field.text("aid", "Area ID", {
      "labelKey": "references.geography.villages.fields.aid",
      "placeholder": "e.g. 11.01.01.2002",
      "hint": "Kode wilayah Kemendagri. Diisi otomatis oleh import dan dipakai sebagai identitas baris — jangan diubah manual.",
      "default": "",
      "tab": "general",
      "order": 15
    }),

  field.text("code", "Code", {
      "labelKey": "references.geography.villages.fields.code",
      "required": true,
      "placeholder": "e.g. 11.01.01.2002",
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Name", {
      "labelKey": "references.geography.villages.fields.name",
      "required": true,
      "placeholder": "Kelurahan/Desa name",
      "tab": "general",
      "order": 30
    }),

  field.switch("is_active", "Active", {
      "labelKey": "references.geography.villages.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})