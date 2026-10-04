import { createForm, field } from "@framework"

export const districtsForm = createForm([
  field.lookup("city__province", "Province", "/api/administration/references/geography/lookup/provinces/", {
      "labelKey": "references.geography.districts.fields.city__province",
      "hint": "Menyaring pilihan Kabupaten/Kota. Tidak disimpan — induk yang tersimpan adalah Kabupaten/Kota.",
      "tab": "general",
      "order": 5
    }),

  field.lookup("city", "Kabupaten/Kota", "/api/administration/references/geography/lookup/cities/", {
      "labelKey": "references.geography.districts.fields.city",
      "required": true,
      "dependsOn": [
        "city__province"
      ],
      "lookupParams": {
        "province_id": "$city__province"
      },
      "displayKey": "city_name",
      "tab": "general",
      "order": 10
    }),

  field.text("aid", "Area ID", {
      "labelKey": "references.geography.districts.fields.aid",
      "placeholder": "e.g. 11.01.01",
      "hint": "Kode wilayah Kemendagri. Diisi otomatis oleh import dan dipakai sebagai identitas baris — jangan diubah manual.",
      "default": "",
      "tab": "general",
      "order": 15
    }),

  field.text("code", "Code", {
      "labelKey": "references.geography.districts.fields.code",
      "required": true,
      "placeholder": "e.g. 11.01.01",
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Name", {
      "labelKey": "references.geography.districts.fields.name",
      "required": true,
      "placeholder": "Kecamatan name",
      "tab": "general",
      "order": 30
    }),

  field.switch("is_active", "Active", {
      "labelKey": "references.geography.districts.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})