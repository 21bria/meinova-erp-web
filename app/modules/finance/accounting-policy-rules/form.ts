import { createForm, field } from "@framework"

export const accountingPolicyRulesForm = createForm([
  field.lookup("policy", "Policy", "/api/finance/lookup/accounting-policies/", {
      "labelKey": "finance.accounting-policy-rules.fields.policy",
      "required": true,
      "displayKey": "policy_name",
      "tab": "general",
      "order": 5
    }),

  field.number("sequence", "No.", {
      "labelKey": "finance.accounting-policy-rules.fields.sequence",
      "default": 1,
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Rule", {
      "labelKey": "finance.accounting-policy-rules.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.text("conditions", "Conditions", {
      "labelKey": "finance.accounting-policy-rules.fields.conditions",
      "hint": "Bentuknya sama dengan syarat step approval: {\"field\": ..., \"op\": ..., \"value\": ...} digabung all/any/not. Kosong = selalu cocok.",
      "tab": "general",
      "order": 30
    }),

  field.text("iterate_over", "Iterate Over", {
      "labelKey": "finance.accounting-policy-rules.fields.iterate_over",
      "hint": "Kunci daftar di dalam data kejadian yang dijalankan per baris, mis. `components`. Kosong = data dinilai utuh.",
      "default": "",
      "tab": "general",
      "order": 40
    }),

  field.switch("stop_on_match", "Stop On Match", {
      "labelKey": "finance.accounting-policy-rules.fields.stop_on_match",
      "hint": "Aktif = aturan sesudahnya tidak dicoba lagi untuk baris yang cocok di sini.",
      "default": false,
      "tab": "general",
      "order": 50
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "finance.accounting-policy-rules.fields.is_active",
      "default": true,
      "tab": "general"
    }),
], {
  columns: 3,
})