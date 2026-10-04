import { createForm, field } from "@framework"

export const rosterShiftRotationsForm = createForm([
  field.number("sequence", "Step", {
      "labelKey": "hr.roster-shift-rotations.fields.sequence",
      "required": true,
      "hint": "Urutan langkah. Sesudah langkah terakhir, perputaran kembali ke langkah pertama.",
      "tab": "general",
      "order": 10
    }),

  field.lookup("shift", "Shift", "/api/administration/references/hr/lookup/shifts/", {
      "labelKey": "hr.roster-shift-rotations.fields.shift",
      "required": true,
      "displayKey": "shift_name",
      "hint": "Jamnya milik master Shift; mengubahnya di sana mengubah jadwal semua yang memakai pola ini.",
      "tab": "general",
      "order": 20
    }),

  field.number("block_days", "Days", {
      "labelKey": "hr.roster-shift-rotations.fields.block_days",
      "required": true,
      "hint": "Berapa hari shift ini dipakai sebelum berganti. 7 = mingguan.",
      "default": 7,
      "tab": "general",
      "order": 30
    }),

  field.text("notes", "Notes", {
      "labelKey": "hr.roster-shift-rotations.fields.notes",
      "default": "",
      "tab": "general",
      "order": 40
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.roster-shift-rotations.fields.is_active",
      "default": true,
      "tab": "general"
    }),
], {
  columns: 2,
})