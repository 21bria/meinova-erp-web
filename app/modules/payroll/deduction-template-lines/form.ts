import { createForm, field } from "@framework"

export const deductionTemplateLinesForm = createForm([
  field.lookup("template", "Deduction Template", "/api/payroll/deduction-templates/lookup/", {
      "labelKey": "payroll.deduction-template-lines.fields.template",
      "required": true,
      "displayKey": "template_name",
      "tab": "general",
      "order": 10
    }),

  field.text("code", "Component Code", {
      "labelKey": "payroll.deduction-template-lines.fields.code",
      "required": true,
      "placeholder": "e.g. BPJS-KES",
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Component Name", {
      "labelKey": "payroll.deduction-template-lines.fields.name",
      "required": true,
      "placeholder": "e.g. BPJS Kesehatan (Pegawai)",
      "tab": "general",
      "order": 30
    }),

  field.number("sequence", "Sequence", {
      "labelKey": "payroll.deduction-template-lines.fields.sequence",
      "default": 1,
      "tab": "general",
      "order": 40
    }),

  field.select("basis", "Calculation Basis", {
      "labelKey": "payroll.deduction-template-lines.fields.basis",
      "required": true,
      "default": "fixed",
      "multiple": false,
      "tab": "general",
      "order": 50,
      "options": [
        {
          "label": "Fixed Amount",
          "value": "fixed"
        },
        {
          "label": "% of Basic Salary",
          "value": "percent_of_basic"
        },
        {
          "label": "% of Gross Earning",
          "value": "percent_of_gross"
        },
        {
          "label": "% of Taxable Earning",
          "value": "percent_of_taxable"
        },
        {
          "label": "Amount x Working Day",
          "value": "per_working_day"
        },
        {
          "label": "Amount x Paid Day",
          "value": "per_paid_day"
        },
        {
          "label": "Amount x Absent Day",
          "value": "per_absent_day"
        },
        {
          "label": "Amount x Unpaid Leave Day",
          "value": "per_unpaid_leave_day"
        },
        {
          "label": "PPh21 Progressive",
          "value": "pph21_progressive"
        }
      ]
    }),

  field.number("amount", "Amount", {
      "labelKey": "payroll.deduction-template-lines.fields.amount",
      "visibleWhen": {
        "basis": [
          "fixed",
          "per_working_day",
          "per_paid_day",
          "per_absent_day",
          "per_unpaid_leave_day"
        ]
      },
      "default": 0,
      "tab": "general",
      "order": 60
    }),

  field.number("rate", "Rate (%)", {
      "labelKey": "payroll.deduction-template-lines.fields.rate",
      "visibleWhen": {
        "basis": [
          "percent_of_basic",
          "percent_of_gross",
          "percent_of_taxable"
        ]
      },
      "default": 0,
      "tab": "general",
      "order": 70
    }),

  field.number("minimum_base", "Minimum Base", {
      "labelKey": "payroll.deduction-template-lines.fields.minimum_base",
      "visibleWhen": {
        "basis": [
          "percent_of_basic",
          "percent_of_gross",
          "percent_of_taxable"
        ]
      },
      "hint": "Batas bawah dasar perhitungan persentase.",
      "tab": "general",
      "order": 80
    }),

  field.number("maximum_base", "Maximum Base", {
      "labelKey": "payroll.deduction-template-lines.fields.maximum_base",
      "visibleWhen": {
        "basis": [
          "percent_of_basic",
          "percent_of_gross",
          "percent_of_taxable"
        ]
      },
      "hint": "Plafon dasar perhitungan — bentuk batas atas BPJS.",
      "tab": "general",
      "order": 90
    }),

  field.number("minimum_amount", "Minimum Amount", {
      "labelKey": "payroll.deduction-template-lines.fields.minimum_amount",
      "tab": "general",
      "order": 100
    }),

  field.number("maximum_amount", "Maximum Amount", {
      "labelKey": "payroll.deduction-template-lines.fields.maximum_amount",
      "tab": "general",
      "order": 110
    }),

  field.switch("reduces_taxable", "Reduces Taxable Income", {
      "labelKey": "payroll.deduction-template-lines.fields.reduces_taxable",
      "hint": "Iuran yang mengurangi dasar perhitungan PPh21.",
      "default": false,
      "tab": "general",
      "order": 120
    }),

  field.switch("is_employer_cost", "Employer Cost", {
      "labelKey": "payroll.deduction-template-lines.fields.is_employer_cost",
      "hint": "Iuran yang dibayar perusahaan. Tidak dipotong dari pegawai dan tidak mengubah Take Home Pay; masuk biaya tenaga kerja.",
      "default": false,
      "tab": "general",
      "order": 125
    }),

  field.switch("is_prorated", "Prorated", {
      "labelKey": "payroll.deduction-template-lines.fields.is_prorated",
      "default": false,
      "tab": "general",
      "order": 130
    }),

  field.textarea("description", "Description", {
      "labelKey": "payroll.deduction-template-lines.fields.description",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 140
    }),

  field.switch("is_active", "Active", {
      "labelKey": "payroll.deduction-template-lines.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})