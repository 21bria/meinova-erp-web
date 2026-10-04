import { createForm, field } from "@framework"

export const accountingPoliciesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "finance.accounting-policies.fields.code",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "finance.accounting-policies.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.text("event_type", "Event Type", {
      "labelKey": "finance.accounting-policies.fields.event_type",
      "required": true,
      "hint": "Nama kejadian yang dilayani, mis. PAYROLL_POSTED. Finance tidak punya daftar tertutup — modul sumber yang menamainya.",
      "tab": "general",
      "order": 30
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "finance.accounting-policies.fields.company",
      "displayKey": "company_name",
      "hint": "Kosong = berlaku untuk semua perusahaan.",
      "tab": "general",
      "order": 40
    }),

  field.text("journal_type", "Journal Type", {
      "labelKey": "finance.accounting-policies.fields.journal_type",
      "hint": "Jenis jurnal yang diterbitkan kebijakan ini.",
      "default": "automatic",
      "tab": "general",
      "order": 50
    }),

  field.date("effective_from", "Effective From", {
      "labelKey": "finance.accounting-policies.fields.effective_from",
      "tab": "general",
      "order": 60
    }),

  field.date("effective_to", "Effective To", {
      "labelKey": "finance.accounting-policies.fields.effective_to",
      "tab": "general",
      "order": 70
    }),

  field.switch("is_active", "Active", {
      "labelKey": "finance.accounting-policies.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 80
    }),

  field.textarea("description", "Notes", {
      "labelKey": "finance.accounting-policies.fields.description",
      "default": "",
      "layout": "full",
      "tab": "general",
      "order": 90
    }),
], {
  columns: 3,
})