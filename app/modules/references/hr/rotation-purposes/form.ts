import { createForm, field } from "@framework"

export const rotationPurposesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "references.hr.rotation-purposes.fields.code",
      "required": true,
      "placeholder": "e.g. CODE",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "references.hr.rotation-purposes.fields.name",
      "required": true,
      "placeholder": "Name",
      "tab": "general",
      "order": 20
    }),

  field.textarea("description", "Description", {
      "labelKey": "references.hr.rotation-purposes.fields.description",
      "default": "",
      "rows": 4,
      "layout": "full",
      "tab": "general",
      "order": 30
    }),

  field.switch("deducts_leave", "Deducts Leave", {
      "labelKey": "references.hr.rotation-purposes.fields.deducts_leave",
      "hint": "Blok off dengan alasan ini memotong saldo cuti. Field Break tidak; Cuti Tahunan ya.",
      "default": false,
      "tab": "general",
      "order": 40
    }),

  field.lookup("leave_type", "Leave Type", "/api/administration/references/hr/lookup/leave-types/", {
      "labelKey": "references.hr.rotation-purposes.fields.leave_type",
      "displayKey": "leave_type_name",
      "hint": "Saldo yang dipotong. Wajib diisi kalau Deducts Leave menyala — memotong saldo tanpa menyebut saldo yang mana tidak bisa dieksekusi.",
      "tab": "general",
      "order": 50
    }),

  field.number("sort_order", "Sort order", {
      "labelKey": "references.hr.rotation-purposes.fields.sort_order",
      "default": 0,
      "tab": "general"
    }),

  field.switch("is_active", "Active", {
      "labelKey": "references.hr.rotation-purposes.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})