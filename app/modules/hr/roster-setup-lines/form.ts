import { createForm, field } from "@framework"

export const rosterSetupLinesForm = createForm([
  field.text("employee_number", "Employee No.", {
      "labelKey": "hr.roster-setup-lines.fields.employee_number",
      "readonly": true,
      "tab": "general",
      "order": 5
    }),

  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "hr.roster-setup-lines.fields.employee",
      "required": true,
      "autofill": {
        "roster_policy": "roster_policy",
        "current_cycle_start": "roster_cycle_start"
      },
      "displayKey": "employee_name",
      "tab": "general",
      "order": 10
    }),

  field.lookup("roster_policy", "Roster Policy", "/api/administration/references/hr/lookup/roster-policies/", {
      "labelKey": "hr.roster-setup-lines.fields.roster_policy",
      "required": true,
      "displayKey": "roster_policy_code",
      "hint": "Yang menentukan pola siklusnya. Policy tanpa pola siklus tidak muncul di sini — ia cuma memuat aturan site.",
      "tab": "general",
      "order": 20
    }),

  field.date("current_cycle_start", "Current Cycle Start", {
      "labelKey": "hr.roster-setup-lines.fields.current_cycle_start",
      "required": true,
      "hint": "Hari pertama blok yang **sedang** dijalani pegawai ini. Boleh tanggal lampau — justru itu yang biasa saat sistem baru dipasang.",
      "tab": "general",
      "order": 30
    }),

  field.number("opening_rotation_credit", "Opening Credit", {
      "labelKey": "hr.roster-setup-lines.fields.opening_rotation_credit",
      "hint": "Saldo rotation credit yang dibawa dari sistem lama. Dicatat sebagai transaksi Opening Balance, bukan diketik langsung ke saldo.",
      "default": 0,
      "tab": "general",
      "order": 40
    }),

  field.text("note", "Note", {
      "labelKey": "hr.roster-setup-lines.fields.note",
      "default": "",
      "tab": "general",
      "order": 50
    }),

  field.text("commit_error", "Error", {
      "labelKey": "hr.roster-setup-lines.fields.commit_error",
      "readonly": true,
      "default": "",
      "tab": "general",
      "order": 70
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.roster-setup-lines.fields.is_active",
      "default": true,
      "tab": "general"
    }),
], {
  columns: 2,
})