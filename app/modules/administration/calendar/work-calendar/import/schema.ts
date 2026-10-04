import type {
  ImportSchema,
} from "@framework"

/*
 * Dihasilkan oleh: pnpm meinova generate administration/calendar/work-calendar
 *
 * Sumber kebenaran ada di backend, pada key "import" milik schema
 * module ini. Ubah di sana lalu generate ulang — perubahan manual
 * di file ini akan tertimpa.
 */

export const workCalendarImportSchema: ImportSchema = {
  title: "Import Work Calendars",
  description: "Import pola hari kerja. Kolom scope menentukan siapa yang terkena: GLOBAL (kosongkan company dan location — satu baris berlaku untuk seluruh perusahaan, termasuk yang dibuat kemudian), COMPANY, atau LOCATION. Jangan membuat satu baris per perusahaan untuk pola yang sama; itu justru yang digantikan cakupan GLOBAL. Baris yang cakupan + company + location + kodenya sudah ada ditandai UPDATE di preview, bukan ditimpa diam-diam.",
  completedTitle: "Work Calendar Import Completed",
  completedDescription: "Periksa kolom Applies To di daftar Work Calendar — baris GLOBAL harus berbunyi 'All Companies'. Kalender yang baru masuk langsung dipakai resolver untuk perhitungan cuti, absensi, dan prorata gaji.",
  backLabel: "Back to Work Calendar",
  importAnotherLabel: "Import Another File",
  profileEndpoint: "/api/imports/profiles/lookup/?module=administration/calendar/work-calendar",
  profileLabel: "Import Profile",
  fileLabel: "CSV File",
  fileAccept: ".csv,text/csv",
  previewEndpoint: "/api/imports/administration/calendar/work-calendar/preview/",
  confirmEndpoint: "/api/imports/administration/calendar/work-calendar/confirm/",
  templateEndpoint: "/api/imports/administration/calendar/work-calendar/template/",
  templateLabel: "Download Template",
  jobEndpoint: "/api/imports/jobs/{jobPublicId}/",
  errorReportEndpoint: "/api/imports/jobs/{jobPublicId}/error-report/",
  pollIntervalMs: 1500,
  pollTimeoutMs: 600000,
  maxFileSizeMb: 20,
  previewColumns: [
    {
      key: "row_number",
      label: "Row",
    },
    {
      key: "code",
      label: "Code",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "scope",
      label: "Scope",
    },
    {
      key: "applies_to",
      label: "Applies To",
    },
    {
      key: "working_days",
      label: "Working Days",
    },
    {
      key: "is_default",
      label: "Default",
    },
    {
      key: "is_active",
      label: "Active",
    },
    {
      key: "action",
      label: "Action",
    },
  ],
  options: {
    skipInvalid: true,
    skipDuplicates: true,
    stopOnError: false,
    dryRun: false,
    overwrite: false,
  },
}
