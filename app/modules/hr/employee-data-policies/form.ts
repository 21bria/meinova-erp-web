import { createForm, field } from "@framework"

export const employeeDataPoliciesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "hr.employee-data-policies.fields.code",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "hr.employee-data-policies.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.select("subject", "Protected Data", {
      "labelKey": "hr.employee-data-policies.fields.subject",
      "required": true,
      "displayKey": "subject_label",
      "hint": "Kelompok yang tidak punya baris di sini tetap terlihat oleh siapa pun yang datanya masuk cakupannya.",
      "multiple": false,
      "tab": "general",
      "order": 30,
      "options": [
        {
          "value": "history_salary",
          "label": "Salary History"
        },
        {
          "value": "history_separation",
          "label": "Resignation & Termination History"
        },
        {
          "value": "history_movement",
          "label": "Transfer & Promotion History"
        },
        {
          "value": "history_contract",
          "label": "Contract & Status History"
        },
        {
          "value": "field_identity",
          "label": "Identity Numbers (NIK, NPWP, Passport)"
        },
        {
          "value": "field_payroll",
          "label": "Payroll & Salary"
        },
        {
          "value": "field_bank",
          "label": "Bank Accounts"
        },
        {
          "value": "field_family",
          "label": "Family"
        },
        {
          "value": "field_medical",
          "label": "Medical"
        },
        {
          "value": "field_document",
          "label": "Documents"
        }
      ]
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "hr.employee-data-policies.fields.company",
      "displayKey": "company_name",
      "hint": "Dikosongkan = berlaku untuk semua company. Aturan yang menyebut company mengalahkan yang global.",
      "tab": "general",
      "order": 40
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "hr.employee-data-policies.fields.location",
      "dependsOn": [
        "company"
      ],
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "location_name",
      "hint": "Dikosongkan = berlaku untuk semua lokasi. Diisi kalau site tertentu punya aturan kerahasiaannya sendiri.",
      "tab": "general",
      "order": 50
    }),

  field.lookup("employee_group", "Employee Group", "/api/administration/references/hr/lookup/employee-groups/", {
      "labelKey": "hr.employee-data-policies.fields.employee_group",
      "displayKey": "employee_group_name",
      "hint": "Dikosongkan = berlaku untuk semua golongan.",
      "tab": "general",
      "order": 60
    }),

  field.textarea("description", "Description", {
      "labelKey": "hr.employee-data-policies.fields.description",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 70
    }),

  field.switch("allow_self", "The Employee", {
      "labelKey": "hr.employee-data-policies.fields.allow_self",
      "hint": "Gajinya sendiri bukan rahasia darinya, jadi hampir tidak pernah ada alasan mematikannya.",
      "default": true,
      "tab": "audience",
      "order": 110
    }),

  field.switch("allow_manager", "Direct Manager", {
      "labelKey": "hr.employee-data-policies.fields.allow_manager",
      "hint": "Atasan pegawai menurut garis pelaporan.",
      "default": true,
      "tab": "audience",
      "order": 120
    }),

  field.number("manager_levels", "Manager Levels", {
      "labelKey": "hr.employee-data-policies.fields.manager_levels",
      "visibleWhen": {
        "field": "allow_manager",
        "op": "is_true"
      },
      "hint": "1 = atasan langsung saja, 2 = sampai atasannya atasan.",
      "default": 1,
      "tab": "audience",
      "order": 130
    }),

  field.switch("allow_department_head", "Department Head", {
      "labelKey": "hr.employee-data-policies.fields.allow_department_head",
      "hint": "Pemegang jabatan bertanda Manager di department pegawai itu. Perlu diketahui: kepala departemen tidak punya cakupan lokasi — di tenant yang satu departemennya tersebar di beberapa site, ini membuka data lintas site.",
      "default": false,
      "tab": "audience",
      "order": 140
    }),

  field.lookup("role", "Role", "/api/accounts/lookup/roles/", {
      "labelKey": "hr.employee-data-policies.fields.role",
      "displayKey": "role_name",
      "hint": "Role yang boleh melihat, mis. HR-MANAGER. Dikosongkan = tidak ada role tambahan di luar tiga pilihan di atas.",
      "tab": "audience",
      "order": 150
    }),

  field.switch("is_active", "Active", {
      "labelKey": "hr.employee-data-policies.fields.is_active",
      "hint": "Dimatikan = aturannya diabaikan, dan kelompok ini kembali terlihat oleh siapa pun yang datanya masuk cakupannya.",
      "default": true,
      "tab": "audience",
      "order": 160
    }),

  field.number("sort_order", "Sort Order", {
      "labelKey": "hr.employee-data-policies.fields.sort_order",
      "default": 0,
      "tab": "audience",
      "order": 170
    }),
], {
  columns: 2,
})