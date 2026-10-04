import type {
  ImportSchema,
} from "@framework"

/*
 * Dihasilkan oleh: pnpm meinova generate hr/employees
 *
 * Sumber kebenaran ada di backend, pada key "import" milik schema
 * module ini. Ubah di sana lalu generate ulang — perubahan manual
 * di file ini akan tertimpa.
 */

export const employeesImportSchema: ImportSchema = {
  title: "Import Employee",
  description: "Import employee master data from CSV, including organization assignment, bank account, and education.",
  completedTitle: "Employee Import Completed",
  completedDescription: "Employee records have been processed successfully.",
  backLabel: "Back to Employees",
  importAnotherLabel: "Import Another File",
  profileEndpoint: "/api/imports/profiles/lookup/?module=hr/employees",
  profileLabel: "Import Profile",
  fileLabel: "CSV File",
  fileAccept: ".csv,text/csv",
  previewEndpoint: "/api/imports/hr/employees/preview/",
  confirmEndpoint: "/api/imports/hr/employees/confirm/",
  templateEndpoint: "/api/imports/hr/employees/template/",
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
      key: "employee_number",
      label: "Employee Number",
    },
    {
      key: "display_name",
      label: "Name",
    },
    {
      key: "nik",
      label: "NIK",
    },
    {
      key: "company",
      label: "Company",
    },
    {
      key: "department",
      label: "Department",
    },
    {
      key: "position",
      label: "Position",
    },
    {
      key: "bank_account_number",
      label: "Bank Account",
    },
    {
      key: "education",
      label: "Education",
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
