import { createForm, field } from "@framework"

export const bpjsRulesForm = createForm([
  field.lookup("program", "Program", "/api/payroll/bpjs-programs/lookup/", {
      "labelKey": "payroll.bpjs-rules.fields.program",
      "required": true,
      "displayKey": "program_name",
      "tab": "general",
      "order": 10
    }),

  field.lookup("risk_class", "Risk Class", "/api/payroll/bpjs-risk-classes/lookup/", {
      "labelKey": "payroll.bpjs-rules.fields.risk_class",
      "displayKey": "risk_class_name",
      "hint": "Wajib untuk program yang memakai kelas risiko, dan harus kosong untuk program yang tidak. Aturan kelas tidak pernah dipinjam kelas lain.",
      "tab": "general",
      "order": 15
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "payroll.bpjs-rules.fields.company",
      "displayKey": "company_name",
      "hint": "Kosongkan untuk aturan bawaan seluruh tenant. Diisi = aturan perusahaan itu, yang menggantikan bawaan secara utuh.",
      "tab": "general",
      "order": 20
    }),

  field.date("effective_from", "Effective From", {
      "labelKey": "payroll.bpjs-rules.fields.effective_from",
      "required": true,
      "tab": "general",
      "order": 30
    }),

  field.date("effective_to", "Effective To", {
      "labelKey": "payroll.bpjs-rules.fields.effective_to",
      "hint": "Kosong = masih berlaku.",
      "tab": "general",
      "order": 40
    }),

  field.lookup("base_definition", "Contribution Base", "/api/payroll/bpjs-base-definitions/lookup/", {
      "labelKey": "payroll.bpjs-rules.fields.base_definition",
      "required": true,
      "displayKey": "base_definition_label",
      "tab": "general",
      "order": 50
    }),

  field.number("employee_rate", "Employee Rate (%)", {
      "labelKey": "payroll.bpjs-rules.fields.employee_rate",
      "hint": "Kosongkan kalau program ini tidak dipotong dari pegawai.",
      "tab": "general",
      "order": 60
    }),

  field.number("employer_rate", "Employer Rate (%)", {
      "labelKey": "payroll.bpjs-rules.fields.employer_rate",
      "hint": "Kosongkan kalau program ini tidak ditanggung perusahaan.",
      "tab": "general",
      "order": 70
    }),

  field.number("base_minimum", "Base Minimum", {
      "labelKey": "payroll.bpjs-rules.fields.base_minimum",
      "tab": "general",
      "order": 80
    }),

  field.number("base_maximum", "Base Maximum", {
      "labelKey": "payroll.bpjs-rules.fields.base_maximum",
      "hint": "Plafon BPJS: batas dasar perhitungan, bukan batas iurannya.",
      "tab": "general",
      "order": 90
    }),

  field.number("employee_minimum_amount", "Employee Min Amount", {
      "labelKey": "payroll.bpjs-rules.fields.employee_minimum_amount",
      "tab": "general",
      "order": 100
    }),

  field.number("employee_maximum_amount", "Employee Max Amount", {
      "labelKey": "payroll.bpjs-rules.fields.employee_maximum_amount",
      "tab": "general",
      "order": 110
    }),

  field.number("employer_minimum_amount", "Employer Min Amount", {
      "labelKey": "payroll.bpjs-rules.fields.employer_minimum_amount",
      "tab": "general",
      "order": 120
    }),

  field.number("employer_maximum_amount", "Employer Max Amount", {
      "labelKey": "payroll.bpjs-rules.fields.employer_maximum_amount",
      "tab": "general",
      "order": 130
    }),

  field.switch("reduces_taxable", "Reduces Taxable Income", {
      "labelKey": "payroll.bpjs-rules.fields.reduces_taxable",
      "hint": "Iuran pegawai ini mengurangi dasar perhitungan PPh21.",
      "default": false,
      "tab": "general",
      "order": 140
    }),

  field.textarea("description", "Description", {
      "labelKey": "payroll.bpjs-rules.fields.description",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 150
    }),

  field.switch("is_active", "Active", {
      "labelKey": "payroll.bpjs-rules.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})