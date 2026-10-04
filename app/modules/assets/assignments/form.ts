import { createForm, field } from "@framework"

export const assignmentsForm = createForm([
  field.select("target_custody_type", "Assign To", {
      "labelKey": "assets.assignments.fields.target_custody_type",
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
      "order": 30,
      "options": [
        {
          "label": "Employee",
          "value": "EMPLOYEE"
        },
        {
          "label": "Organization",
          "value": "ORGANIZATION"
        }
      ]
    }),

  field.lookup("asset", "Asset", "/api/assets/lookup/available-assets/", {
      "labelKey": "assets.assignments.fields.asset",
      "required": true,
      "dependsOn": "target_custody_type",
      "lookupParams": {
        "target_custody_type": "$target_custody_type"
      },
      "displayKey": "asset_code",
      "hint": "Hanya aset aktif di penyimpanan (STORAGE) yang belum dipesan Assignment lain, dan kategorinya boleh dipegang tujuan ini.",
      "tab": "general",
      "order": 40
    }),

  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "assets.assignments.fields.employee",
      "displayKey": "employee_name",
      "visibleWhen": {
        "target_custody_type": [
          "EMPLOYEE"
        ]
      },
      "hint": "Penerima — subjek dokumen, bukan approver.",
      "tab": "general",
      "order": 50
    }),

  field.textarea("cross_company_reason", "Cross-Company Reason", {
      "labelKey": "assets.assignments.fields.cross_company_reason",
      "visibleWhen": {
        "target_custody_type": [
          "EMPLOYEE"
        ]
      },
      "hint": "Wajib bila penerima berpenempatan di company lain. Kepemilikan aset tidak berubah.",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 55
    }),

  field.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
      "labelKey": "assets.assignments.fields.department",
      "displayKey": "department_name",
      "visibleWhen": {
        "target_custody_type": [
          "ORGANIZATION"
        ]
      },
      "tab": "general",
      "order": 60
    }),

  field.lookup("pic_employee", "PIC", "/api/hr/employees/lookup/", {
      "labelKey": "assets.assignments.fields.pic_employee",
      "displayKey": "pic_employee_name",
      "visibleWhen": {
        "target_custody_type": [
          "ORGANIZATION"
        ]
      },
      "hint": "Penanggung jawab resmi (opsional). Sopir/operator harian bukan PIC dan tidak dicatat.",
      "tab": "general",
      "order": 70
    }),

  field.lookup("location", "Target Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "assets.assignments.fields.location",
      "required": true,
      "displayKey": "location_name",
      "hint": "Lokasi fisik barang, milik company pemilik. Boleh berbeda dari penempatan pegawai — penempatannya tidak diubah.",
      "tab": "general",
      "order": 80
    }),

  field.lookup("facility", "Target Facility", "/api/administration/organization/lookup/facilities/", {
      "labelKey": "assets.assignments.fields.facility",
      "dependsOn": "location",
      "lookupParams": {
        "location_id": "$location"
      },
      "displayKey": "facility_name",
      "tab": "general",
      "order": 90
    }),

  field.switch("is_active", "is active", {
      "labelKey": "assets.assignments.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.textarea("purpose", "Purpose", {
      "labelKey": "assets.assignments.fields.purpose",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 100
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "assets.assignments.fields.notes",
      "default": "",
      "layout": "full",
      "tab": "general"
    }),
], {
  columns: 3,
})