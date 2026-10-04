import type {
  ImportSchema,
} from "@framework"

/*
 * Dihasilkan oleh: pnpm meinova generate hr/attendance
 *
 * Sumber kebenaran ada di backend, pada key "import" milik schema
 * module ini. Ubah di sana lalu generate ulang — perubahan manual
 * di file ini akan tertimpa.
 */

export const attendanceImportSchema: ImportSchema = {
  title: "Import Attendance",
  description: "Import attendance taps from any machine format. The selected Import Profile describes the file; machine IDs are resolved through Attendance Device Employee Mapping, and work date, schedule, and shift come from HR — never from the file.",
  completedTitle: "Attendance Import Completed",
  completedDescription: "Attendance records have been processed successfully.",
  backLabel: "Back to Attendance",
  importAnotherLabel: "Import Another File",
  profileEndpoint: "/api/imports/profiles/lookup/?module=hr/attendance",
  profileLabel: "Import Profile",
  fileLabel: "CSV File",
  fileAccept: ".csv,text/csv",
  previewEndpoint: "/api/imports/hr/attendance/preview/",
  confirmEndpoint: "/api/imports/hr/attendance/confirm/",
  templateEndpoint: "/api/imports/hr/attendance/template/",
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
      width: 70,
    },
    {
      key: "raw_employee_id",
      label: "Raw Employee ID",
    },
    {
      key: "employee_code",
      label: "Employee Number",
    },
    {
      key: "employee_name",
      label: "Employee Name",
    },
    {
      key: "raw_timestamp",
      label: "Raw Timestamp",
    },
    {
      key: "log_time",
      label: "Normalized Timestamp",
    },
    {
      key: "work_date",
      label: "Work Date",
    },
    {
      key: "schedule_label",
      label: "Schedule / Shift",
    },
    {
      key: "log_type",
      label: "Event",
    },
    {
      key: "device_code",
      label: "Device",
    },
    {
      key: "status_label",
      label: "Status",
    },
    {
      key: "message",
      label: "Message",
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
