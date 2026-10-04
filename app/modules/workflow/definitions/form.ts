import { createForm, field } from "@framework"

export const definitionsForm = createForm([
  field.text("code", "Code", {
      "labelKey": "workflow.definitions.fields.code",
      "required": true,
      "hint": "Kode unik alur, mis. HR-HO-ANNUAL-LEAVE.",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "workflow.definitions.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.text("module", "Module", {
      "labelKey": "workflow.definitions.fields.module",
      "required": true,
      "hint": "Modul pemilik dokumen, mis. hr.",
      "tab": "general",
      "order": 30
    }),

  field.text("document_type", "Document Type", {
      "labelKey": "workflow.definitions.fields.document_type",
      "required": true,
      "hint": "Jenis dokumen yang dilayani, mis. leave_request atau travel_request.",
      "tab": "general",
      "order": 40
    }),

  field.select("status", "Status", {
      "labelKey": "workflow.definitions.fields.status",
      "required": true,
      "displayKey": "status_label",
      "hint": "Hanya alur berstatus Aktif yang dipakai saat dokumen diajukan.",
      "default": "draft",
      "multiple": false,
      "tab": "general",
      "order": 50,
      "options": [
        {
          "label": "Draft",
          "value": "draft"
        },
        {
          "label": "Active",
          "value": "active"
        },
        {
          "label": "Inactive",
          "value": "inactive"
        }
      ]
    }),

  field.number("version", "Version", {
      "labelKey": "workflow.definitions.fields.version",
      "hint": "Penanda untuk manusia. Dokumen yang sudah berjalan menunjuk step-nya langsung, jadi mengubah alur tidak mengubah dokumen yang sedang berjalan.",
      "default": 1,
      "tab": "general",
      "order": 60
    }),

  field.textarea("description", "Description", {
      "labelKey": "workflow.definitions.fields.description",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 70
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "workflow.definitions.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "workflow.definitions.fields.company",
      "displayKey": "company_name",
      "hint": "Dikosongkan = berlaku untuk semua company. Kosong berarti 'semua', bukan 'belum diisi'.",
      "tab": "scope",
      "order": 110
    }),

  field.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
      "labelKey": "workflow.definitions.fields.branch",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "branch_name",
      "hint": "Dikosongkan = berlaku untuk semua branch.",
      "tab": "scope",
      "order": 120
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "workflow.definitions.fields.location",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "branch_id": "$branch"
      },
      "displayKey": "location_name",
      "hint": "Lokasi kerja pengaju. Ini kolom yang membedakan alur Head Office dari alur site.",
      "tab": "scope",
      "order": 130
    }),

  field.lookup("employee_group", "Employee Group", "/api/administration/references/hr/lookup/employee-groups/", {
      "labelKey": "workflow.definitions.fields.employee_group",
      "displayKey": "employee_group_name",
      "hint": "Dikosongkan = berlaku untuk semua golongan pegawai.",
      "tab": "scope",
      "order": 140
    }),

  field.text("scope_label", "Applies To", {
      "labelKey": "workflow.definitions.fields.scope_label",
      "readonly": true,
      "hint": "Ringkasan cakupan alur ini.",
      "tab": "scope",
      "order": 150
    }),

  field.number("specificity", "Priority Score", {
      "labelKey": "workflow.definitions.fields.specificity",
      "readonly": true,
      "hint": "Makin tinggi makin menang saat beberapa alur sama-sama cocok. Dihitung dari cakupan, bukan diketik.",
      "tab": "scope",
      "order": 160
    }),
], {
  columns: 3,
})