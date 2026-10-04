import { createForm, field } from "@framework"

export const leaveRulesForm = createForm([
  field.lookup("leave_type", "Leave Type", "/api/administration/references/hr/lookup/leave-types/", {
      "labelKey": "payroll.leave-rules.fields.leave_type",
      "required": true,
      "displayKey": "leave_type_name",
      "tab": "general",
      "order": 10
    }),

  field.switch("is_unpaid", "Unpaid Leave", {
      "labelKey": "payroll.leave-rules.fields.is_unpaid",
      "hint": "Hari cuti jenis ini dihitung sebagai hari tidak dibayar dan memotong gaji.",
      "default": false,
      "tab": "general",
      "order": 20
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "payroll.leave-rules.fields.notes",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 30
    }),

  field.switch("is_active", "Active", {
      "labelKey": "payroll.leave-rules.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})