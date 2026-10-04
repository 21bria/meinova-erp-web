import { createForm, field } from "@framework"

export const registerForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "assets.register.fields.company",
      "required": true,
      "displayKey": "company_name",
      "readonlyWhen": {
        "status": [
          "DRAFT",
          "ACTIVE"
        ]
      },
      "hint": "Pemilik aset. Tidak bisa diubah sesudah aset dibuat.",
      "modes": [
        "create",
        "edit"
      ],
      "tab": "general",
      "order": 30
    }),

  field.lookup("category", "Category", "/api/assets/lookup/asset-categories/", {
      "labelKey": "assets.register.fields.category",
      "required": true,
      "displayKey": "category_name",
      "readonlyWhen": {
        "status": [
          "ACTIVE"
        ]
      },
      "tab": "general",
      "order": 40
    }),

  field.text("name", "Name", {
      "labelKey": "assets.register.fields.name",
      "required": true,
      "tab": "general",
      "order": 50
    }),

  field.textarea("description", "Description", {
      "labelKey": "assets.register.fields.description",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 60
    }),

  field.text("manufacturer", "Manufacturer", {
      "labelKey": "assets.register.fields.manufacturer",
      "default": "",
      "tab": "general",
      "order": 70
    }),

  field.text("model", "Model", {
      "labelKey": "assets.register.fields.model",
      "default": "",
      "tab": "general",
      "order": 80
    }),

  field.text("serial_number", "Serial Number", {
      "labelKey": "assets.register.fields.serial_number",
      "hint": "Opsional, kecuali kategorinya mewajibkan. Unik per company tanpa membedakan huruf.",
      "default": "",
      "tab": "general",
      "order": 90
    }),

  field.switch("is_active", "is active", {
      "labelKey": "assets.register.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.text("tag_number", "Tag Number", {
      "labelKey": "assets.register.fields.tag_number",
      "hint": "Label/barcode fisik. Unik per company bila diisi.",
      "default": "",
      "tab": "general",
      "order": 100
    }),

  field.select("condition", "Condition", {
      "labelKey": "assets.register.fields.condition",
      "required": true,
      "readonlyWhen": {
        "status": [
          "ACTIVE"
        ]
      },
      "hint": "Sesudah aktif, kondisi dicatat lewat Record Condition supaya riwayatnya utuh.",
      "default": "GOOD",
      "multiple": false,
      "tab": "general",
      "order": 110,
      "options": [
        {
          "label": "Good",
          "value": "GOOD"
        },
        {
          "label": "Fair",
          "value": "FAIR"
        },
        {
          "label": "Damaged",
          "value": "DAMAGED"
        },
        {
          "label": "Unserviceable",
          "value": "UNSERVICEABLE"
        }
      ]
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "assets.register.fields.location",
      "required": true,
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "location_name",
      "readonlyWhen": {
        "status": [
          "ACTIVE"
        ]
      },
      "hint": "Saat DRAFT: lokasi penyimpanan awal. Sesudah aktif: lokasi custody saat ini — berpindah hanya lewat dokumen custody.",
      "tab": "placement",
      "order": 200
    }),

  field.lookup("facility", "Facility", "/api/administration/organization/lookup/facilities/", {
      "labelKey": "assets.register.fields.facility",
      "dependsOn": "location",
      "lookupParams": {
        "company_id": "$company",
        "location_id": "$location"
      },
      "displayKey": "facility_name",
      "readonlyWhen": {
        "status": [
          "ACTIVE"
        ]
      },
      "tab": "placement",
      "order": 210
    }),

  field.date("acquisition_date", "Acquisition Date", {
      "labelKey": "assets.register.fields.acquisition_date",
      "tab": "acquisition",
      "order": 300
    }),

  field.text("acquisition_reference", "Acquisition Reference", {
      "labelKey": "assets.register.fields.acquisition_reference",
      "hint": "No. PO / invoice. Tanpa nilai uang — nilai milik Fixed Asset.",
      "default": "",
      "tab": "acquisition",
      "order": 310
    }),

  field.text("supplier_name", "Supplier", {
      "labelKey": "assets.register.fields.supplier_name",
      "default": "",
      "tab": "acquisition",
      "order": 320
    }),

  field.date("warranty_until", "Warranty Until", {
      "labelKey": "assets.register.fields.warranty_until",
      "tab": "acquisition",
      "order": 330
    }),
], {
  columns: 3,
})