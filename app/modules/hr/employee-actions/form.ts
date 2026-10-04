import { createForm, field } from "@framework"

export const employeeActionsForm = createForm([
  field.text("document_number", "Document No.", {
      "labelKey": "hr.employee-actions.fields.document_number",
      "readonly": true,
      "modes": [
        "edit"
      ],
      "default": "",
      "tab": "general",
      "order": 10
    }),

  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "hr.employee-actions.fields.employee",
      "required": true,
      "displayKey": "employee_name",
      "tab": "general",
      "order": 20
    }),

  field.lookup("requested_by", "Requested By", "/api/hr/employees/lookup/", {
      "labelKey": "hr.employee-actions.fields.requested_by",
      "displayKey": "requested_by_name",
      "hint": "Yang mengusulkan perubahan ini. Kosongkan kalau Anda sendiri yang mengusulkannya — akan terisi otomatis.",
      "tab": "general",
      "order": 25
    }),

  field.select("action_type", "Action Type", {
      "labelKey": "hr.employee-actions.fields.action_type",
      "required": true,
      "displayKey": "action_type_label",
      "hint": "Menentukan kolom mana yang berlaku dan — lewat `WorkflowStep.condition` — meja mana saja yang harus menandatangani.",
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

  field.date("effective_date", "Effective Date", {
      "labelKey": "hr.employee-actions.fields.effective_date",
      "required": true,
      "hint": "Sejak kapan perubahannya berlaku — bukan tanggal pengajuan dan bukan tanggal persetujuan.",
      "tab": "general",
      "order": 40
    }),

  field.text("status", "Status", {
      "labelKey": "hr.employee-actions.fields.status",
      "readonly": true,
      "displayKey": "status_label",
      "modes": [
        "edit"
      ],
      "default": "draft",
      "tab": "general",
      "order": 50
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.employee-actions.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.text("current_employment_type_name", "Current Employment Type", {
      "labelKey": "hr.employee-actions.fields.current_employment_type_name",
      "readonly": true,
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "employment_type_change"
        ]
      },
      "tab": "change",
      "order": 100
    }),

  field.lookup("proposed_employment_type", "Proposed Employment Type", "/api/administration/references/hr/lookup/employment-types/", {
      "labelKey": "hr.employee-actions.fields.proposed_employment_type",
      "displayKey": "proposed_employment_type_name",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "employment_type_change"
        ]
      },
      "tab": "change",
      "order": 110
    }),

  field.lookup("proposed_employee_group", "Proposed Employee Group", "/api/administration/references/hr/lookup/employee-groups/", {
      "labelKey": "hr.employee-actions.fields.proposed_employee_group",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "employment_type_change"
        ]
      },
      "tab": "change",
      "order": 120
    }),

  field.date("confirmation_date", "Confirmation Date", {
      "labelKey": "hr.employee-actions.fields.confirmation_date",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "employment_type_change"
        ]
      },
      "hint": "Tanggal pengangkatan. Diisi ke data pegawai saat action diterapkan.",
      "tab": "change",
      "order": 130
    }),

  field.text("current_employment_status_name", "Current Status", {
      "labelKey": "hr.employee-actions.fields.current_employment_status_name",
      "readonly": true,
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "status_change",
          "resignation",
          "termination"
        ]
      },
      "tab": "change",
      "order": 140
    }),

  field.lookup("proposed_employment_status", "Proposed Status", "/api/administration/references/hr/lookup/employment-statuses/", {
      "labelKey": "hr.employee-actions.fields.proposed_employment_status",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "status_change",
          "resignation",
          "termination"
        ]
      },
      "tab": "change",
      "order": 150
    }),

  field.text("current_contract_type_name", "Current Contract Type", {
      "labelKey": "hr.employee-actions.fields.current_contract_type_name",
      "readonly": true,
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "contract_extension",
          "contract_change"
        ]
      },
      "tab": "change",
      "order": 200
    }),

  field.text("current_contract_start", "Current Contract Start", {
      "labelKey": "hr.employee-actions.fields.current_contract_start",
      "readonly": true,
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "contract_extension",
          "contract_change"
        ]
      },
      "tab": "change",
      "order": 210
    }),

  field.text("current_contract_end", "Current Contract End", {
      "labelKey": "hr.employee-actions.fields.current_contract_end",
      "readonly": true,
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "contract_extension",
          "contract_change"
        ]
      },
      "tab": "change",
      "order": 220
    }),

  field.lookup("proposed_contract_type", "Proposed Contract Type", "/api/administration/references/hr/lookup/contract-types/", {
      "labelKey": "hr.employee-actions.fields.proposed_contract_type",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "contract_extension",
          "contract_change"
        ]
      },
      "tab": "change",
      "order": 230
    }),

  field.date("proposed_contract_start", "Proposed Contract Start", {
      "labelKey": "hr.employee-actions.fields.proposed_contract_start",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "contract_extension",
          "contract_change"
        ]
      },
      "hint": "Kosongkan pada perpanjangan — tanggal mulai kontrak berjalan dipertahankan.",
      "tab": "change",
      "order": 240
    }),

  field.date("proposed_contract_end", "Proposed Contract End", {
      "labelKey": "hr.employee-actions.fields.proposed_contract_end",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "contract_extension",
          "contract_change"
        ]
      },
      "tab": "change",
      "order": 250
    }),

  field.text("current_probation_type_name", "Current Probation Type", {
      "labelKey": "hr.employee-actions.fields.current_probation_type_name",
      "readonly": true,
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "probation_change"
        ]
      },
      "tab": "change",
      "order": 300
    }),

  field.lookup("proposed_probation_type", "Proposed Probation Type", "/api/administration/references/hr/lookup/probation-types/", {
      "labelKey": "hr.employee-actions.fields.proposed_probation_type",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "probation_change"
        ]
      },
      "hint": "Kosongkan untuk mengakhiri masa percobaan — tanggalnya ikut dibersihkan saat diterapkan.",
      "tab": "change",
      "order": 310
    }),

  field.date("proposed_probation_start", "Proposed Probation Start", {
      "labelKey": "hr.employee-actions.fields.proposed_probation_start",
      "visibleWhen": {
        "all": [
          {
            "field": "action_type",
            "op": "in",
            "value": [
              "probation_change"
            ]
          },
          {
            "field": "proposed_probation_type",
            "op": "is_not_null"
          }
        ]
      },
      "tab": "change",
      "order": 320
    }),

  field.date("proposed_probation_end", "Proposed Probation End", {
      "labelKey": "hr.employee-actions.fields.proposed_probation_end",
      "visibleWhen": {
        "all": [
          {
            "field": "action_type",
            "op": "in",
            "value": [
              "probation_change"
            ]
          },
          {
            "field": "proposed_probation_type",
            "op": "is_not_null"
          }
        ]
      },
      "tab": "change",
      "order": 330
    }),

  field.text("current_position_name", "Current Position", {
      "labelKey": "hr.employee-actions.fields.current_position_name",
      "readonly": true,
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "promotion",
          "demotion",
          "position_change",
          "transfer"
        ]
      },
      "tab": "change",
      "order": 400
    }),

  field.text("current_department_name", "Current Department", {
      "labelKey": "hr.employee-actions.fields.current_department_name",
      "readonly": true,
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "transfer",
          "promotion",
          "demotion",
          "position_change"
        ]
      },
      "tab": "change",
      "order": 410
    }),

  field.text("current_location_name", "Current Location", {
      "labelKey": "hr.employee-actions.fields.current_location_name",
      "readonly": true,
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "transfer"
        ]
      },
      "tab": "change",
      "order": 420
    }),

  field.lookup("proposed_company", "Proposed Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "hr.employee-actions.fields.proposed_company",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "transfer"
        ]
      },
      "tab": "change",
      "order": 430
    }),

  field.lookup("proposed_branch", "Proposed Branch", "/api/administration/organization/lookup/branches/", {
      "labelKey": "hr.employee-actions.fields.proposed_branch",
      "dependsOn": [
        "proposed_company"
      ],
      "lookupParams": {
        "company_id": "$proposed_company"
      },
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "transfer"
        ]
      },
      "tab": "change",
      "order": 440
    }),

  field.lookup("proposed_location", "Proposed Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "hr.employee-actions.fields.proposed_location",
      "dependsOn": [
        "proposed_company"
      ],
      "lookupParams": {
        "company_id": "$proposed_company",
        "branch_id": "$proposed_branch"
      },
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "transfer"
        ]
      },
      "tab": "change",
      "order": 450
    }),

  field.lookup("proposed_division", "Proposed Division", "/api/administration/organization/lookup/divisions/", {
      "labelKey": "hr.employee-actions.fields.proposed_division",
      "dependsOn": [
        "proposed_company"
      ],
      "lookupParams": {
        "company_id": "$proposed_company",
        "branch_id": "$proposed_branch",
        "location_id": "$proposed_location"
      },
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "transfer",
          "promotion",
          "demotion",
          "position_change"
        ]
      },
      "tab": "change",
      "order": 460
    }),

  field.lookup("proposed_department", "Proposed Department", "/api/administration/organization/lookup/departments/", {
      "labelKey": "hr.employee-actions.fields.proposed_department",
      "dependsOn": [
        "proposed_company"
      ],
      "lookupParams": {
        "company_id": "$proposed_company",
        "branch_id": "$proposed_branch",
        "location_id": "$proposed_location",
        "division_id": "$proposed_division"
      },
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "transfer",
          "promotion",
          "demotion",
          "position_change"
        ]
      },
      "tab": "change",
      "order": 470
    }),

  field.lookup("proposed_section", "Proposed Section", "/api/administration/organization/lookup/sections/", {
      "labelKey": "hr.employee-actions.fields.proposed_section",
      "dependsOn": [
        "proposed_company"
      ],
      "lookupParams": {
        "company_id": "$proposed_company",
        "branch_id": "$proposed_branch",
        "location_id": "$proposed_location",
        "division_id": "$proposed_division",
        "department_id": "$proposed_department"
      },
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "transfer",
          "promotion",
          "demotion",
          "position_change"
        ]
      },
      "tab": "change",
      "order": 480
    }),

  field.lookup("proposed_position", "Proposed Position", "/api/administration/organization/lookup/positions/", {
      "labelKey": "hr.employee-actions.fields.proposed_position",
      "dependsOn": [
        "proposed_company"
      ],
      "lookupParams": {
        "company_id": "$proposed_company",
        "branch_id": "$proposed_branch",
        "location_id": "$proposed_location",
        "division_id": "$proposed_division",
        "department_id": "$proposed_department"
      },
      "displayKey": "proposed_position_name",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "promotion",
          "demotion",
          "position_change",
          "transfer"
        ]
      },
      "tab": "change",
      "order": 490
    }),

  field.lookup("proposed_job_level", "Proposed Job Level", "/api/administration/references/hr/lookup/job-levels/", {
      "labelKey": "hr.employee-actions.fields.proposed_job_level",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "promotion",
          "demotion",
          "position_change",
          "transfer"
        ]
      },
      "tab": "change",
      "order": 500
    }),

  field.lookup("proposed_job_grade", "Proposed Job Grade", "/api/administration/references/hr/lookup/job-grades/", {
      "labelKey": "hr.employee-actions.fields.proposed_job_grade",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "promotion",
          "demotion",
          "position_change",
          "transfer"
        ]
      },
      "tab": "change",
      "order": 510
    }),

  field.lookup("proposed_cost_center", "Proposed Cost Center", "/api/administration/organization/lookup/cost-centers/", {
      "labelKey": "hr.employee-actions.fields.proposed_cost_center",
      "dependsOn": [
        "proposed_company"
      ],
      "lookupParams": {
        "company_id": "$proposed_company",
        "branch_id": "$proposed_branch",
        "location_id": "$proposed_location"
      },
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "transfer"
        ]
      },
      "tab": "change",
      "order": 520
    }),

  field.lookup("proposed_reports_to", "Proposed Reports To", "/api/hr/employees/lookup/", {
      "labelKey": "hr.employee-actions.fields.proposed_reports_to",
      "displayKey": "proposed_reports_to_name",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "transfer",
          "promotion",
          "demotion",
          "position_change"
        ]
      },
      "tab": "change",
      "order": 530
    }),

  field.text("current_basic_salary", "Current Basic Salary", {
      "labelKey": "hr.employee-actions.fields.current_basic_salary",
      "readonly": true,
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "salary_change"
        ]
      },
      "tab": "change",
      "order": 600
    }),

  field.number("proposed_basic_salary", "Proposed Basic Salary", {
      "labelKey": "hr.employee-actions.fields.proposed_basic_salary",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "salary_change"
        ]
      },
      "tab": "change",
      "order": 610
    }),

  field.lookup("proposed_salary_grade", "Proposed Salary Grade", "/api/payroll/salary-grades/lookup/", {
      "labelKey": "hr.employee-actions.fields.proposed_salary_grade",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "salary_change"
        ]
      },
      "tab": "change",
      "order": 620
    }),

  field.lookup("proposed_salary_level", "Proposed Salary Level", "/api/payroll/salary-levels/lookup/", {
      "labelKey": "hr.employee-actions.fields.proposed_salary_level",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "salary_change"
        ]
      },
      "tab": "change",
      "order": 630
    }),

  field.lookup("proposed_payroll_group", "Proposed Payroll Group", "/api/payroll/payroll-groups/lookup/", {
      "labelKey": "hr.employee-actions.fields.proposed_payroll_group",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "salary_change"
        ]
      },
      "tab": "change",
      "order": 640
    }),

  field.date("last_working_date", "Last Working Date", {
      "labelKey": "hr.employee-actions.fields.last_working_date",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "resignation",
          "termination"
        ]
      },
      "tab": "change",
      "order": 700
    }),

  field.lookup("termination_reason", "Termination Reason", "/api/administration/references/hr/lookup/termination-reasons/", {
      "labelKey": "hr.employee-actions.fields.termination_reason",
      "visibleWhen": {
        "field": "action_type",
        "op": "in",
        "value": [
          "resignation",
          "termination"
        ]
      },
      "tab": "change",
      "order": 710
    }),

  field.textarea("reason", "Reason", {
      "labelKey": "hr.employee-actions.fields.reason",
      "hint": "Alasan perubahan. Ini yang dibaca approver dan yang tersisa di riwayat bertahun-tahun kemudian.",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 800
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.employee-actions.fields.notes",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 810
    }),

  field.datetime("applied_at", "Applied At", {
      "labelKey": "hr.employee-actions.fields.applied_at",
      "readonly": true,
      "visibleWhen": {
        "field": "applied_at",
        "op": "is_not_null"
      },
      "tab": "general",
      "order": 820
    }),

  field.textarea("apply_error", "Apply Error", {
      "labelKey": "hr.employee-actions.fields.apply_error",
      "readonly": true,
      "visibleWhen": {
        "field": "apply_error",
        "op": "is_not_null"
      },
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 830
    }),
], {
  columns: 3,
})