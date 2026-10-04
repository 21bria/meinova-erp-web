import { createForm, field } from "@framework"

export const transfersForm = createForm([
  field.lookup("asset", "Asset", "/api/assets/lookup/transferable-assets/", {
      "labelKey": "assets.transfers.fields.asset",
      "required": true,
      "autofill": {
        "source_custody_type": "custody_type"
      },
      "displayKey": "asset_code",
      "readonlyWhen": {
        "status": [
          "SUBMITTED",
          "APPROVED",
          "COMPLETED",
          "REJECTED",
          "CANCELLED"
        ]
      },
      "hint": "Aset yang sedang dipakai (kondisi layak) atau di penyimpanan, dan tidak sedang dipesan dokumen lain. Asal diambil dari custody.",
      "tab": "general",
      "order": 30
    }),

  field.select("target_custody_type", "Transfer To", {
      "labelKey": "assets.transfers.fields.target_custody_type",
      "required": true,
      "readonlyWhen": {
        "status": [
          "SUBMITTED",
          "APPROVED",
          "COMPLETED",
          "REJECTED",
          "CANCELLED"
        ]
      },
      "hint": "Pemakaian → pemakaian, atau penyimpanan → penyimpanan. Dari penyimpanan ke pemakai = Assignment; dari pemakai ke penyimpanan = Return.",
      "multiple": false,
      "tab": "general",
      "order": 40,
      "options": [
        {
          "label": "Employee",
          "value": "EMPLOYEE",
          "visible_when": {
            "field": "source_custody_type",
            "op": "in",
            "value": [
              "EMPLOYEE",
              "ORGANIZATION"
            ]
          }
        },
        {
          "label": "Organization",
          "value": "ORGANIZATION",
          "visible_when": {
            "field": "source_custody_type",
            "op": "in",
            "value": [
              "EMPLOYEE",
              "ORGANIZATION"
            ]
          }
        },
        {
          "label": "Storage",
          "value": "STORAGE",
          "visible_when": {
            "field": "source_custody_type",
            "op": "eq",
            "value": "STORAGE"
          }
        }
      ]
    }),

  field.select("reason", "Reason", {
      "labelKey": "assets.transfers.fields.reason",
      "required": true,
      "readonlyWhen": {
        "status": [
          "SUBMITTED",
          "APPROVED",
          "COMPLETED",
          "REJECTED",
          "CANCELLED"
        ]
      },
      "multiple": false,
      "tab": "general",
      "order": 50,
      "options": [
        {
          "label": "Reassignment",
          "value": "REASSIGNMENT"
        },
        {
          "label": "PIC change",
          "value": "PIC_CHANGE"
        },
        {
          "label": "Relocation",
          "value": "RELOCATION"
        },
        {
          "label": "Reorganization",
          "value": "REORGANIZATION"
        },
        {
          "label": "Other",
          "value": "OTHER"
        }
      ]
    }),

  field.lookup("target_employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "assets.transfers.fields.target_employee",
      "displayKey": "target_employee_name",
      "visibleWhen": {
        "target_custody_type": [
          "EMPLOYEE"
        ]
      },
      "hint": "Pemegang baru — subjek dokumen, bukan approver.",
      "tab": "general",
      "order": 60
    }),

  field.textarea("cross_company_reason", "Cross-Company Reason", {
      "labelKey": "assets.transfers.fields.cross_company_reason",
      "visibleWhen": {
        "target_custody_type": [
          "EMPLOYEE"
        ]
      },
      "hint": "Wajib bila pegawai tujuan berpenempatan di company lain. Kepemilikan aset tidak berubah.",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 65
    }),

  field.lookup("target_department", "Department", "/api/administration/organization/lookup/departments/", {
      "labelKey": "assets.transfers.fields.target_department",
      "displayKey": "target_department_name",
      "visibleWhen": {
        "target_custody_type": [
          "ORGANIZATION"
        ]
      },
      "tab": "general",
      "order": 70
    }),

  field.lookup("target_pic_employee", "PIC", "/api/hr/employees/lookup/", {
      "labelKey": "assets.transfers.fields.target_pic_employee",
      "displayKey": "target_pic_employee_name",
      "visibleWhen": {
        "target_custody_type": [
          "ORGANIZATION"
        ]
      },
      "hint": "Penanggung jawab resmi (opsional). Ganti PIC = Transfer dengan department sama. Sopir/operator harian bukan PIC.",
      "tab": "general",
      "order": 80
    }),

  field.lookup("target_location", "Target Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "assets.transfers.fields.target_location",
      "required": true,
      "displayKey": "target_location_name",
      "readonlyWhen": {
        "status": [
          "SUBMITTED",
          "APPROVED",
          "COMPLETED",
          "REJECTED",
          "CANCELLED"
        ]
      },
      "hint": "Lokasi fisik tujuan, milik company pemilik aset.",
      "tab": "general",
      "order": 90
    }),

  field.switch("is_active", "is active", {
      "labelKey": "assets.transfers.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.lookup("target_facility", "Target Facility", "/api/administration/organization/lookup/facilities/", {
      "labelKey": "assets.transfers.fields.target_facility",
      "dependsOn": "target_location",
      "lookupParams": {
        "location_id": "$target_location"
      },
      "displayKey": "target_facility_name",
      "readonlyWhen": {
        "status": [
          "SUBMITTED",
          "APPROVED",
          "COMPLETED",
          "REJECTED",
          "CANCELLED"
        ]
      },
      "tab": "general",
      "order": 100
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "assets.transfers.fields.notes",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 110
    }),
], {
  columns: 3,
})