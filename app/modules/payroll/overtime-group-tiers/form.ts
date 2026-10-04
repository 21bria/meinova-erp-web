import { createForm, field } from "@framework"

export const overtimeGroupTiersForm = createForm([
  field.lookup("group", "Overtime Group", "/api/payroll/overtime-groups/lookup/", {
      "labelKey": "payroll.overtime-group-tiers.fields.group",
      "required": true,
      "displayKey": "group_name",
      "tab": "general",
      "order": 10
    }),

  field.number("sequence", "Order", {
      "labelKey": "payroll.overtime-group-tiers.fields.sequence",
      "required": true,
      "hint": "Urutan tingkat dibaca dari bawah ke atas. Tingkat pertama harus mulai dari jam 0.",
      "default": 1,
      "tab": "general",
      "order": 20
    }),

  field.number("hour_from", "From Hour", {
      "labelKey": "payroll.overtime-group-tiers.fields.hour_from",
      "required": true,
      "displayKey": "hour_range_label",
      "hint": "Batas bawah jam lembur kumulatif, ikut terhitung. 0 = mulai dari jam lembur pertama.",
      "default": 0,
      "tab": "general",
      "order": 30
    }),

  field.number("hour_to", "To Hour", {
      "labelKey": "payroll.overtime-group-tiers.fields.hour_to",
      "hint": "Dikosongkan berarti tingkat teratas — jam berapa pun di atas batas bawah memakai pengali ini.",
      "tab": "general",
      "order": 40
    }),

  field.number("multiplier", "Multiplier", {
      "labelKey": "payroll.overtime-group-tiers.fields.multiplier",
      "required": true,
      "displayKey": "multiplier_label",
      "hint": "Pengali upah per jam pada rentang ini, mis. 1,5. Angkanya kebijakan perusahaan — sistem tidak menentukannya.",
      "default": 1,
      "tab": "general",
      "order": 50
    }),

  field.textarea("description", "Description", {
      "labelKey": "payroll.overtime-group-tiers.fields.description",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 60
    }),

  field.switch("is_active", "Active", {
      "labelKey": "payroll.overtime-group-tiers.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})