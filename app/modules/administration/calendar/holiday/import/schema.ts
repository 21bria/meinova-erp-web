import type {
  ImportSchema,
} from "@framework"

/*
 * Dihasilkan oleh: pnpm meinova generate administration/calendar/holiday
 *
 * Sumber kebenaran ada di backend, pada key "import" milik schema
 * module ini. Ubah di sana lalu generate ulang — perubahan manual
 * di file ini akan tertimpa.
 */

export const holidayImportSchema: ImportSchema = {
  title: "Import Holidays",
  description: "Import hari libur. Libur nasional cukup **satu baris** bercakupan GLOBAL (sinonim yang diterima: NATIONAL) dengan company dan location dikosongkan — jangan menulisnya ulang per perusahaan. Untuk sebagian perusahaan saja, pakai scope SELECTED_COMPANIES dan tulis kode perusahaannya dipisah koma di kolom company. Baris yang cakupan + tanggal + kodenya sudah ada ditandai UPDATE di preview.",
  completedTitle: "Holiday Import Completed",
  completedDescription: "Periksa kolom Applies To di daftar Holiday — libur nasional harus muncul sebagai satu baris 'All Companies', bukan satu baris per perusahaan. Baris hasil import langsung berlaku; yang menunggu review hanya hasil sinkronisasi sumber luar.",
  backLabel: "Back to Holiday",
  importAnotherLabel: "Import Another File",
  profileEndpoint: "/api/imports/profiles/lookup/?module=administration/calendar/holiday",
  profileLabel: "Import Profile",
  fileLabel: "CSV File",
  fileAccept: ".csv,text/csv",
  previewEndpoint: "/api/imports/administration/calendar/holiday/preview/",
  confirmEndpoint: "/api/imports/administration/calendar/holiday/confirm/",
  templateEndpoint: "/api/imports/administration/calendar/holiday/template/",
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
      key: "date",
      label: "Date",
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
      key: "is_national",
      label: "National",
    },
    {
      key: "is_recurring",
      label: "Recurring",
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
