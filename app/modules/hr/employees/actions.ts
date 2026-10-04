import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const employeesRecordActions: RecordAction[] = [
  {
    "key": "employee_action",
    "label": "Actions",
    "icon": "FilePlus2",
    "variant": "outline",
    "placement": "primary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/hr/employee-actions/",
    "method": "post",
    "form": {
      "fields": [
        {
          "key": "document_number",
          "type": "text",
          "widget": "text",
          "label": "Document No.",
          "read_only": true,
          "display": true,
          "modes": [
            "edit"
          ],
          "overview": true,
          "table": true,
          "filter": false,
          "search": true,
          "sortable": true,
          "order": 10,
          "tab": "general"
        },
        {
          "key": "employee",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/hr/employees/lookup/",
          "label": "Employee",
          "display_key": "employee_name",
          "required": true,
          "overview": true,
          "table": true,
          "filter": true,
          "search": false,
          "sortable": true,
          "order": 20,
          "tab": "general"
        },
        {
          "key": "requested_by",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/hr/employees/lookup/",
          "label": "Requested By",
          "display_key": "requested_by_name",
          "help_text": "Yang mengusulkan perubahan ini. Kosongkan kalau Anda sendiri yang mengusulkannya — akan terisi otomatis.",
          "table": true,
          "filter": true,
          "search": false,
          "sortable": true,
          "order": 25,
          "tab": "general"
        },
        {
          "key": "action_type",
          "type": "select",
          "widget": "select",
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
          ],
          "label": "Action Type",
          "required": true,
          "overview": true,
          "display_key": "action_type_label",
          "table": true,
          "filter": true,
          "search": false,
          "sortable": true,
          "help_text": "Menentukan kolom mana yang berlaku dan — lewat `WorkflowStep.condition` — meja mana saja yang harus menandatangani.",
          "order": 30,
          "tab": "general"
        },
        {
          "key": "effective_date",
          "type": "date",
          "widget": "date",
          "label": "Effective Date",
          "required": true,
          "overview": true,
          "table": true,
          "filter": true,
          "search": false,
          "sortable": true,
          "help_text": "Sejak kapan perubahannya berlaku — bukan tanggal pengajuan dan bukan tanggal persetujuan.",
          "order": 40,
          "tab": "general"
        },
        {
          "key": "status",
          "type": "text",
          "widget": "text",
          "label": "Status",
          "read_only": true,
          "display": true,
          "modes": [
            "edit"
          ],
          "overview": true,
          "display_key": "status_label",
          "table": true,
          "filter": true,
          "search": false,
          "sortable": true,
          "order": 50,
          "tab": "general"
        },
        {
          "key": "current_employment_type_name",
          "type": "text",
          "widget": "text",
          "label": "Current Employment Type",
          "read_only": true,
          "display": true,
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 100,
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "employment_type_change"
            ]
          },
          "tab": "change"
        },
        {
          "key": "proposed_employment_type",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/administration/references/hr/lookup/employment-types/",
          "label": "Proposed Employment Type",
          "display_key": "proposed_employment_type_name",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "employment_type_change"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 110,
          "tab": "change"
        },
        {
          "key": "proposed_employee_group",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/administration/references/hr/lookup/employee-groups/",
          "label": "Proposed Employee Group",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "employment_type_change"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 120,
          "tab": "change"
        },
        {
          "key": "confirmation_date",
          "type": "date",
          "widget": "date",
          "label": "Confirmation Date",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "employment_type_change"
            ]
          },
          "help_text": "Tanggal pengangkatan. Diisi ke data pegawai saat action diterapkan.",
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 130,
          "tab": "change"
        },
        {
          "key": "current_employment_status_name",
          "type": "text",
          "widget": "text",
          "label": "Current Status",
          "read_only": true,
          "display": true,
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 140,
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "status_change",
              "resignation",
              "termination"
            ]
          },
          "tab": "change"
        },
        {
          "key": "proposed_employment_status",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/administration/references/hr/lookup/employment-statuses/",
          "label": "Proposed Status",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "status_change",
              "resignation",
              "termination"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 150,
          "tab": "change"
        },
        {
          "key": "current_contract_type_name",
          "type": "text",
          "widget": "text",
          "label": "Current Contract Type",
          "read_only": true,
          "display": true,
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 200,
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "contract_extension",
              "contract_change"
            ]
          },
          "tab": "change"
        },
        {
          "key": "current_contract_start",
          "type": "text",
          "widget": "text",
          "label": "Current Contract Start",
          "read_only": true,
          "display": true,
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 210,
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "contract_extension",
              "contract_change"
            ]
          },
          "tab": "change"
        },
        {
          "key": "current_contract_end",
          "type": "text",
          "widget": "text",
          "label": "Current Contract End",
          "read_only": true,
          "display": true,
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 220,
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "contract_extension",
              "contract_change"
            ]
          },
          "tab": "change"
        },
        {
          "key": "proposed_contract_type",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/administration/references/hr/lookup/contract-types/",
          "label": "Proposed Contract Type",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "contract_extension",
              "contract_change"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 230,
          "tab": "change"
        },
        {
          "key": "proposed_contract_start",
          "type": "date",
          "widget": "date",
          "label": "Proposed Contract Start",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "contract_extension",
              "contract_change"
            ]
          },
          "help_text": "Kosongkan pada perpanjangan — tanggal mulai kontrak berjalan dipertahankan.",
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 240,
          "tab": "change"
        },
        {
          "key": "proposed_contract_end",
          "type": "date",
          "widget": "date",
          "label": "Proposed Contract End",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "contract_extension",
              "contract_change"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 250,
          "tab": "change"
        },
        {
          "key": "current_probation_type_name",
          "type": "text",
          "widget": "text",
          "label": "Current Probation Type",
          "read_only": true,
          "display": true,
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 300,
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "probation_change"
            ]
          },
          "tab": "change"
        },
        {
          "key": "proposed_probation_type",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/administration/references/hr/lookup/probation-types/",
          "label": "Proposed Probation Type",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "probation_change"
            ]
          },
          "help_text": "Kosongkan untuk mengakhiri masa percobaan — tanggalnya ikut dibersihkan saat diterapkan.",
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 310,
          "tab": "change"
        },
        {
          "key": "proposed_probation_start",
          "type": "date",
          "widget": "date",
          "label": "Proposed Probation Start",
          "visible_when": {
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
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 320,
          "tab": "change"
        },
        {
          "key": "proposed_probation_end",
          "type": "date",
          "widget": "date",
          "label": "Proposed Probation End",
          "visible_when": {
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
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 330,
          "tab": "change"
        },
        {
          "key": "current_position_name",
          "type": "text",
          "widget": "text",
          "label": "Current Position",
          "read_only": true,
          "display": true,
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 400,
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "promotion",
              "demotion",
              "position_change",
              "transfer"
            ]
          },
          "tab": "change"
        },
        {
          "key": "current_department_name",
          "type": "text",
          "widget": "text",
          "label": "Current Department",
          "read_only": true,
          "display": true,
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 410,
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "transfer",
              "promotion",
              "demotion",
              "position_change"
            ]
          },
          "tab": "change"
        },
        {
          "key": "current_location_name",
          "type": "text",
          "widget": "text",
          "label": "Current Location",
          "read_only": true,
          "display": true,
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 420,
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "transfer"
            ]
          },
          "tab": "change"
        },
        {
          "key": "proposed_company",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/administration/organization/lookup/companies/",
          "label": "Proposed Company",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "transfer"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 430,
          "tab": "change"
        },
        {
          "key": "proposed_branch",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/administration/organization/lookup/branches/",
          "label": "Proposed Branch",
          "depends_on": [
            "proposed_company"
          ],
          "lookup_params": {
            "company_id": "$proposed_company"
          },
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "transfer"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 440,
          "tab": "change"
        },
        {
          "key": "proposed_location",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/administration/organization/lookup/locations/",
          "label": "Proposed Location",
          "depends_on": [
            "proposed_company"
          ],
          "lookup_params": {
            "company_id": "$proposed_company",
            "branch_id": "$proposed_branch"
          },
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "transfer"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 450,
          "tab": "change"
        },
        {
          "key": "proposed_division",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/administration/organization/lookup/divisions/",
          "label": "Proposed Division",
          "depends_on": [
            "proposed_company"
          ],
          "lookup_params": {
            "company_id": "$proposed_company",
            "branch_id": "$proposed_branch",
            "location_id": "$proposed_location"
          },
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "transfer",
              "promotion",
              "demotion",
              "position_change"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 460,
          "tab": "change"
        },
        {
          "key": "proposed_department",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/administration/organization/lookup/departments/",
          "label": "Proposed Department",
          "depends_on": [
            "proposed_company"
          ],
          "lookup_params": {
            "company_id": "$proposed_company",
            "branch_id": "$proposed_branch",
            "location_id": "$proposed_location",
            "division_id": "$proposed_division"
          },
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "transfer",
              "promotion",
              "demotion",
              "position_change"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 470,
          "tab": "change"
        },
        {
          "key": "proposed_section",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/administration/organization/lookup/sections/",
          "label": "Proposed Section",
          "depends_on": [
            "proposed_company"
          ],
          "lookup_params": {
            "company_id": "$proposed_company",
            "branch_id": "$proposed_branch",
            "location_id": "$proposed_location",
            "division_id": "$proposed_division",
            "department_id": "$proposed_department"
          },
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "transfer",
              "promotion",
              "demotion",
              "position_change"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 480,
          "tab": "change"
        },
        {
          "key": "proposed_position",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/administration/organization/lookup/positions/",
          "label": "Proposed Position",
          "depends_on": [
            "proposed_company"
          ],
          "lookup_params": {
            "company_id": "$proposed_company",
            "branch_id": "$proposed_branch",
            "location_id": "$proposed_location",
            "division_id": "$proposed_division",
            "department_id": "$proposed_department"
          },
          "display_key": "proposed_position_name",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "promotion",
              "demotion",
              "position_change",
              "transfer"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 490,
          "tab": "change"
        },
        {
          "key": "proposed_job_level",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/administration/references/hr/lookup/job-levels/",
          "label": "Proposed Job Level",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "promotion",
              "demotion",
              "position_change",
              "transfer"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 500,
          "tab": "change"
        },
        {
          "key": "proposed_job_grade",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/administration/references/hr/lookup/job-grades/",
          "label": "Proposed Job Grade",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "promotion",
              "demotion",
              "position_change",
              "transfer"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 510,
          "tab": "change"
        },
        {
          "key": "proposed_cost_center",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/administration/organization/lookup/cost-centers/",
          "label": "Proposed Cost Center",
          "depends_on": [
            "proposed_company"
          ],
          "lookup_params": {
            "company_id": "$proposed_company",
            "branch_id": "$proposed_branch",
            "location_id": "$proposed_location"
          },
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "transfer"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 520,
          "tab": "change"
        },
        {
          "key": "proposed_reports_to",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/hr/employees/lookup/",
          "label": "Proposed Reports To",
          "display_key": "proposed_reports_to_name",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "transfer",
              "promotion",
              "demotion",
              "position_change"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 530,
          "tab": "change"
        },
        {
          "key": "current_basic_salary",
          "type": "text",
          "widget": "text",
          "label": "Current Basic Salary",
          "read_only": true,
          "display": true,
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 600,
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "salary_change"
            ]
          },
          "tab": "change"
        },
        {
          "key": "proposed_basic_salary",
          "type": "decimal",
          "widget": "decimal",
          "decimal_places": 2,
          "max_digits": 18,
          "label": "Proposed Basic Salary",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "salary_change"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 610,
          "tab": "change"
        },
        {
          "key": "proposed_salary_grade",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/payroll/salary-grades/lookup/",
          "label": "Proposed Salary Grade",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "salary_change"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 620,
          "tab": "change"
        },
        {
          "key": "proposed_salary_level",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/payroll/salary-levels/lookup/",
          "label": "Proposed Salary Level",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "salary_change"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 630,
          "tab": "change"
        },
        {
          "key": "proposed_payroll_group",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/payroll/payroll-groups/lookup/",
          "label": "Proposed Payroll Group",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "salary_change"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 640,
          "tab": "change"
        },
        {
          "key": "last_working_date",
          "type": "date",
          "widget": "date",
          "label": "Last Working Date",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "resignation",
              "termination"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": true,
          "order": 700,
          "tab": "change"
        },
        {
          "key": "termination_reason",
          "type": "lookup",
          "widget": "lookup",
          "lookup_endpoint": "/api/administration/references/hr/lookup/termination-reasons/",
          "label": "Termination Reason",
          "visible_when": {
            "field": "action_type",
            "op": "in",
            "value": [
              "resignation",
              "termination"
            ]
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 710,
          "tab": "change"
        },
        {
          "key": "reason",
          "type": "textarea",
          "widget": "textarea",
          "rows": 3,
          "label": "Reason",
          "layout": "full",
          "table": false,
          "filter": false,
          "search": true,
          "sortable": false,
          "help_text": "Alasan perubahan. Ini yang dibaca approver dan yang tersisa di riwayat bertahun-tahun kemudian.",
          "order": 800,
          "tab": "general"
        },
        {
          "key": "notes",
          "type": "textarea",
          "widget": "textarea",
          "rows": 3,
          "label": "Notes",
          "layout": "full",
          "table": false,
          "filter": false,
          "search": true,
          "sortable": false,
          "order": 810,
          "tab": "general"
        },
        {
          "key": "applied_at",
          "type": "datetime",
          "widget": "datetime",
          "label": "Applied At",
          "read_only": true,
          "display": true,
          "visible_when": {
            "field": "applied_at",
            "op": "is_not_null"
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": true,
          "order": 820,
          "tab": "general"
        },
        {
          "key": "apply_error",
          "type": "textarea",
          "widget": "textarea",
          "rows": 2,
          "label": "Apply Error",
          "layout": "full",
          "read_only": true,
          "display": true,
          "visible_when": {
            "field": "apply_error",
            "op": "is_not_null"
          },
          "table": false,
          "filter": false,
          "search": false,
          "sortable": false,
          "order": 830,
          "tab": "general"
        }
      ],
      "parentField": "employee",
      "title": "New Employee Action",
      "columns": 2,
      "width": "xl"
    },
    "refresh": true,
    "permission": "hr.add_employeeaction"
  },
]

/*
 * Tombol yang berlaku untuk BANYAK baris sekaligus — Post All dan
 * sejenisnya. Tempatnya toolbar tabel, bukan di dalam baris: hanya di
 * sana yang tahu penyaring yang sedang aktif dan baris mana yang
 * dicentang.
 *
 * Digenerate dari `schema.actions` yang ber-`scope: "collection"`.
 */
export const employeesCollectionActions: CollectionAction[] = []
