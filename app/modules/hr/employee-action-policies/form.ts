import { createForm, field } from "@framework"

export const employeeActionPoliciesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "hr.employee-action-policies.fields.code",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "hr.employee-action-policies.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.select("action_type", "Action Type", {
      "labelKey": "hr.employee-action-policies.fields.action_type",
      "required": true,
      "displayKey": "action_type_label",
      "hint": "Satu baris satu jenis. Kenaikan gaji dan perpanjangan kontrak memang diusulkan orang yang berbeda.",
      "multiple": false,
      "tab": "general",
      "order": 30,
      "options": [
        {
          "value": "contract_extension",
          "label": "Contract Extension"
        },
        {
          "value": "contract_change",
          "label": "Contract Change"
        },
        {
          "value": "employment_type_change",
          "label": "Employment Type Change"
        },
        {
          "value": "probation_change",
          "label": "Probation Change"
        },
        {
          "value": "status_change",
          "label": "Employment Status Change"
        },
        {
          "value": "transfer",
          "label": "Transfer"
        },
        {
          "value": "promotion",
          "label": "Promotion"
        },
        {
          "value": "demotion",
          "label": "Demotion"
        },
        {
          "value": "position_change",
          "label": "Position Change"
        },
        {
          "value": "salary_change",
          "label": "Salary Change"
        },
        {
          "value": "resignation",
          "label": "Resignation"
        },
        {
          "value": "termination",
          "label": "Termination"
        }
      ]
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "hr.employee-action-policies.fields.company",
      "displayKey": "company_name",
      "hint": "Dikosongkan = berlaku untuk semua company. Aturan yang menyebut company mengalahkan yang global.",
      "tab": "general",
      "order": 40
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "hr.employee-action-policies.fields.location",
      "dependsOn": [
        "company"
      ],
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "location_name",
      "hint": "Dikosongkan = berlaku untuk semua lokasi. Diisi kalau site tertentu punya jalur usulan sendiri.",
      "tab": "general",
      "order": 50
    }),

  field.lookup("employee_group", "Employee Group", "/api/administration/references/hr/lookup/employee-groups/", {
      "labelKey": "hr.employee-action-policies.fields.employee_group",
      "displayKey": "employee_group_name",
      "hint": "Dikosongkan = berlaku untuk semua golongan.",
      "tab": "general",
      "order": 60
    }),

  field.textarea("description", "Description", {
      "labelKey": "hr.employee-action-policies.fields.description",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 70
    }),

  field.select("initiator_type", "Requested By", {
      "labelKey": "hr.employee-action-policies.fields.initiator_type",
      "required": true,
      "displayKey": "initiator_type_label",
      "hint": "Dinilai terhadap pegawai yang datanya diubah, bukan terhadap yang mengetik dokumennya. Kepala Departemen = pemegang jabatan bertanda Manager di department pegawai itu.",
      "default": "any",
      "multiple": false,
      "tab": "initiator",
      "order": 110,
      "options": [
        {
          "value": "any",
          "label": "Anyone With Permission"
        },
        {
          "value": "manager",
          "label": "Direct Manager"
        },
        {
          "value": "department_head",
          "label": "Department Head"
        },
        {
          "value": "role",
          "label": "Role Holder"
        },
        {
          "value": "employee",
          "label": "The Employee"
        }
      ]
    }),

  field.lookup("initiator_role", "Initiator Role", "/api/accounts/lookup/roles/", {
      "labelKey": "hr.employee-action-policies.fields.initiator_role",
      "displayKey": "initiator_role_name",
      "visibleWhen": {
        "field": "initiator_type",
        "op": "eq",
        "value": "role"
      },
      "hint": "Wajib diisi kalau pengusulnya ditentukan lewat Role.",
      "tab": "initiator",
      "order": 120
    }),

  field.switch("allow_on_behalf", "Allow On Behalf", {
      "labelKey": "hr.employee-action-policies.fields.allow_on_behalf",
      "visibleWhen": {
        "field": "initiator_type",
        "op": "ne",
        "value": "any"
      },
      "hint": "Menyala: HR boleh mengetikkan dokumennya untuk pengusul yang menyampaikan lisan, asalkan Requested By diisi. Mati: usulannya harus dibuat sendiri oleh yang bersangkutan.",
      "default": true,
      "tab": "initiator",
      "order": 130
    }),

  field.lookup("on_behalf_role", "On Behalf Role", "/api/accounts/lookup/roles/", {
      "labelKey": "hr.employee-action-policies.fields.on_behalf_role",
      "displayKey": "on_behalf_role_name",
      "visibleWhen": {
        "all": [
          {
            "field": "initiator_type",
            "op": "ne",
            "value": "any"
          },
          {
            "field": "allow_on_behalf",
            "op": "is_true"
          }
        ]
      },
      "hint": "Dikosongkan = siapa pun yang punya izin membuat Employee Action boleh mengetikkannya.",
      "tab": "initiator",
      "order": 140
    }),

  field.switch("is_active", "Active", {
      "labelKey": "hr.employee-action-policies.fields.is_active",
      "hint": "Dimatikan = aturannya diabaikan, dan jenis ini kembali boleh diajukan siapa pun yang punya izin.",
      "default": true,
      "tab": "initiator",
      "order": 150
    }),

  field.number("sort_order", "Sort Order", {
      "labelKey": "hr.employee-action-policies.fields.sort_order",
      "default": 0,
      "tab": "initiator",
      "order": 160
    }),
], {
  columns: 2,
})