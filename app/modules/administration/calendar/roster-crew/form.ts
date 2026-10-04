import { createForm, field } from "@framework"

export const rosterCrewForm = createForm([
  field.text("code", "Code", {
      "labelKey": "administration.calendar.roster-crew.fields.code",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Crew Name", {
      "labelKey": "administration.calendar.roster-crew.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "administration.calendar.roster-crew.fields.company",
      "required": true,
      "displayKey": "company_name",
      "tab": "general",
      "order": 30
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "administration.calendar.roster-crew.fields.location",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "location_name",
      "hint": "Site tempat gelombang ini bekerja.",
      "tab": "general",
      "order": 40
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "administration.calendar.roster-crew.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.lookup("work_schedule", "Work Schedule", "/api/administration/references/hr/lookup/work-schedules/", {
      "labelKey": "administration.calendar.roster-crew.fields.work_schedule",
      "required": true,
      "lookupParams": {
        "schedule_type": "ROSTER"
      },
      "displayKey": "work_schedule_name",
      "hint": "Harus bertipe Roster dan sudah mengisi cycle work/off days — dari situ panjang siklusnya dibaca.",
      "tab": "cycle",
      "order": 110
    }),

  field.date("cycle_start_date", "Cycle Start Date", {
      "labelKey": "administration.calendar.roster-crew.fields.cycle_start_date",
      "required": true,
      "hint": "Hari pertama blok kerja pada siklus mana pun. Ini titik jangkarnya — tanpa ini pola 6 minggu on / 2 minggu off tidak bisa dipetakan ke tanggal.",
      "tab": "cycle",
      "order": 120
    }),

  field.textarea("description", "Description", {
      "labelKey": "administration.calendar.roster-crew.fields.description",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "cycle",
      "order": 130
    }),
], {
  columns: 2,
})