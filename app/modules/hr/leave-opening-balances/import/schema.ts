import type {
  ImportSchema,
} from "@framework"

/*
 * Dihasilkan oleh: pnpm meinova generate hr/leave-opening-balances
 *
 * Sumber kebenaran ada di backend, pada key "import" milik schema
 * module ini. Ubah di sana lalu generate ulang — perubahan manual
 * di file ini akan tertimpa.
 */

export const leaveOpeningBalancesImportSchema: ImportSchema = {
  title: "Import Leave Opening Balance",
  description: "Import saldo cuti awal dari sistem lama — saldo aktual pegawai pada tanggal go-live. Satu baris per pegawai per jenis cuti; pegawai yang sudah punya saldo awal ditolak sebagai duplikat, bukan ditimpa. Kolom tanggal boleh dikosongkan — ikut tanggal Leave Go-Live perusahaannya. Saldo nol sah dan tetap perlu diimport; saldo di atas nol untuk pegawai yang belum berhak ditandai REVIEW, tidak ditolak dan tidak diubah.",
  completedTitle: "Leave Opening Balance Import Completed",
  completedDescription: "Barisnya masuk sebagai DRAFT dan belum memengaruhi kartu cuti siapa pun. Periksa angkanya di daftar Leave Opening Balance — terutama baris berstatus REVIEW — lalu tekan Post agar jadi saldo pegawai.",
  backLabel: "Back to Leave Opening Balance",
  importAnotherLabel: "Import Another File",
  profileEndpoint: "/api/imports/profiles/lookup/?module=hr/leave-opening-balances",
  profileLabel: "Import Profile",
  fileLabel: "CSV File",
  fileAccept: ".csv,text/csv",
  previewEndpoint: "/api/imports/hr/leave-opening-balances/preview/",
  confirmEndpoint: "/api/imports/hr/leave-opening-balances/confirm/",
  templateEndpoint: "/api/imports/hr/leave-opening-balances/template/",
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
      key: "employee_code",
      label: "Employee Code",
    },
    {
      key: "employee_name",
      label: "Employee",
    },
    {
      key: "leave_type",
      label: "Leave Type",
    },
    {
      key: "join_date",
      label: "Join Date",
    },
    {
      key: "eligible_date",
      label: "Eligible Date",
    },
    {
      key: "opening_date",
      label: "Opening Date",
    },
    {
      key: "days",
      label: "Opening Balance",
      align: "right",
    },
    {
      key: "validation",
      label: "Validation",
    },
    {
      key: "remark",
      label: "Remark",
    },
    {
      key: "reason",
      label: "Reason",
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
