import { createForm, field } from "@framework"

export const payrollInputsForm = createForm([
  field.lookup("period", "Payroll Period", "/api/payroll/payroll-periods/lookup/", {
      "labelKey": "payroll.payroll-inputs.fields.period",
      "required": true,
      "displayKey": "period_name",
      "tab": "general",
      "order": 10
    }),

  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "payroll.payroll-inputs.fields.employee",
      "required": true,
      "displayKey": "employee_name",
      "tab": "general",
      "order": 20
    }),

  field.select("input_type", "Input Type", {
      "labelKey": "payroll.payroll-inputs.fields.input_type",
      "required": true,
      "default": "allowance",
      "multiple": false,
      "tab": "general",
      "order": 30,
      "options": [
        {
          "label": "Overtime",
          "value": "overtime"
        },
        {
          "label": "Variable Allowance",
          "value": "allowance"
        },
        {
          "label": "Incentive / Bonus",
          "value": "incentive"
        },
        {
          "label": "Deduction",
          "value": "deduction"
        },
        {
          "label": "Reimbursement",
          "value": "reimbursement"
        },
        {
          "label": "Correction / Adjustment",
          "value": "adjustment"
        },
        {
          "label": "Unpaid Leave",
          "value": "unpaid_leave"
        },
        {
          "label": "Attendance Adjustment",
          "value": "attendance"
        }
      ]
    }),

  field.select("component_type", "Side", {
      "labelKey": "payroll.payroll-inputs.fields.component_type",
      "hint": "Kosong = mengikuti sisi bawaan jenis input. Diisi hanya untuk koreksi yang arahnya memang berbeda.",
      "default": "",
      "multiple": false,
      "tab": "general",
      "order": 40,
      "options": [
        {
          "label": "Earning",
          "value": "earning"
        },
        {
          "label": "Deduction",
          "value": "deduction"
        }
      ]
    }),

  field.lookup("allowance_line", "Allowance Component", "/api/payroll/allowance-template-lines/lookup/", {
      "labelKey": "payroll.payroll-inputs.fields.allowance_line",
      "autofill": {
        "code": "code",
        "name": "name",
        "is_taxable": "is_taxable"
      },
      "displayKey": "allowance_line_name",
      "visibleWhen": {
        "input_type": [
          "overtime",
          "allowance",
          "incentive",
          "reimbursement",
          "adjustment"
        ]
      },
      "hint": "Ambil definisinya dari Payroll Master. Kosongkan untuk komponen sekali jalan.",
      "tab": "general",
      "order": 50
    }),

  field.lookup("deduction_line", "Deduction Component", "/api/payroll/deduction-template-lines/lookup/", {
      "labelKey": "payroll.payroll-inputs.fields.deduction_line",
      "autofill": {
        "code": "code",
        "name": "name"
      },
      "displayKey": "deduction_line_name",
      "visibleWhen": {
        "input_type": [
          "deduction",
          "unpaid_leave",
          "attendance",
          "adjustment"
        ]
      },
      "tab": "general",
      "order": 60
    }),

  field.text("code", "Code", {
      "labelKey": "payroll.payroll-inputs.fields.code",
      "placeholder": "e.g. BONUS-Q3",
      "default": "",
      "tab": "general",
      "order": 70
    }),

  field.text("name", "Name", {
      "labelKey": "payroll.payroll-inputs.fields.name",
      "placeholder": "e.g. Bonus Kuartal 3",
      "default": "",
      "tab": "general",
      "order": 80
    }),

  field.number("quantity", "Quantity", {
      "labelKey": "payroll.payroll-inputs.fields.quantity",
      "default": 1,
      "tab": "general",
      "order": 90
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "payroll.payroll-inputs.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.number("rate", "Rate", {
      "labelKey": "payroll.payroll-inputs.fields.rate",
      "hint": "Diisi = Amount dihitung Rate x Quantity.",
      "tab": "general",
      "order": 100
    }),

  field.number("amount", "Amount", {
      "labelKey": "payroll.payroll-inputs.fields.amount",
      "default": 0,
      "tab": "general",
      "order": 110
    }),

  field.switch("is_taxable", "Taxable", {
      "labelKey": "payroll.payroll-inputs.fields.is_taxable",
      "visibleWhen": {
        "input_type": [
          "overtime",
          "allowance",
          "incentive",
          "reimbursement",
          "adjustment"
        ]
      },
      "default": true,
      "tab": "general",
      "order": 120
    }),

  field.select("status", "Status", {
      "labelKey": "payroll.payroll-inputs.fields.status",
      "hint": "Hanya Confirmed yang ikut dihitung payroll run.",
      "default": "draft",
      "multiple": false,
      "tab": "general",
      "order": 130,
      "options": [
        {
          "label": "Draft",
          "value": "draft"
        },
        {
          "label": "Confirmed",
          "value": "confirmed"
        },
        {
          "label": "Cancelled",
          "value": "cancelled"
        }
      ]
    }),

  field.text("reference", "Reference", {
      "labelKey": "payroll.payroll-inputs.fields.reference",
      "placeholder": "Nomor dokumen sumber",
      "default": "",
      "tab": "general",
      "order": 140
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "payroll.payroll-inputs.fields.notes",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 150
    }),
], {
  columns: 2,
})