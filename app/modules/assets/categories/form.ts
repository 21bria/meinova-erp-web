import { createForm, field } from "@framework"

export const categoriesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "assets.categories.fields.code",
      "required": true,
      "hint": "Kode tetap, mis. LAPTOP atau RADIO_HT. Disimpan dalam huruf besar; kode kategori yang sudah dihapus boleh dipakai lagi.",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "assets.categories.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.textarea("description", "Description", {
      "labelKey": "assets.categories.fields.description",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 30
    }),

  field.number("sort_order", "Sort Order", {
      "labelKey": "assets.categories.fields.sort_order",
      "hint": "Angka kecil tampil lebih dulu di dropdown.",
      "default": 0,
      "tab": "general",
      "order": 40
    }),

  field.switch("is_active", "Active", {
      "labelKey": "assets.categories.fields.is_active",
      "hint": "Dimatikan: kategori tidak bisa dipilih lagi untuk aset baru, tetapi aset yang sudah memakainya tidak berubah.",
      "default": true,
      "tab": "general",
      "order": 50
    }),

  field.switch("requires_serial_number", "Requires Serial Number", {
      "labelKey": "assets.categories.fields.requires_serial_number",
      "hint": "Dinyalakan: aset berkategori ini tidak bisa diaktifkan tanpa serial number. Tidak berlaku surut untuk aset yang sudah aktif.",
      "default": false,
      "tab": "general",
      "order": 60
    }),

  field.switch("allow_employee_custody", "Employee Custody", {
      "labelKey": "assets.categories.fields.allow_employee_custody",
      "hint": "Boleh dipegang perorangan (mis. laptop, HP).",
      "default": true,
      "tab": "general",
      "order": 70
    }),

  field.switch("allow_organization_custody", "Organization Custody", {
      "labelKey": "assets.categories.fields.allow_organization_custody",
      "hint": "Boleh dipegang unit/department dengan PIC (mis. kendaraan, alat berat). Minimal satu dari dua saklar ini harus hidup; penyimpanan (STORAGE) selalu boleh.",
      "default": true,
      "tab": "general",
      "order": 80
    }),
], {
  columns: 2,
})