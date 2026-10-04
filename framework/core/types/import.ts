/*
|--------------------------------------------------------------------------
| Primitive
|--------------------------------------------------------------------------
*/

export type ImportStatus =
  | "idle"
  | "uploading"
  | "parsing"
  | "validating"
  | "previewing"
  | "ready"
  | "queued"
  | "pending"
  | "processing"
  | "importing"
  | "completed"
  | "partial"
  | "failed"
  | "cancelled"

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

export type ImportProfile = {
  id: number
  value: number

  name?: string
  label: string
  code?: string

  company?: number | null
  company_label?: string | null

  branch?: number | null
  branch_label?: string | null

  site?: number | null
  site_label?: string | null

  delimiter?: string
  encoding?: string
  datetime_formats?: string[]

  [key: string]: unknown
}

/*
|--------------------------------------------------------------------------
| Preview columns
|--------------------------------------------------------------------------
*/

export type ImportPreviewColumn = {
  key: string
  label: string

  width?: number | string
  align?: "left" | "center" | "right"

  formatter?: (
    value: unknown,
    row: ImportPreviewRow,
  ) => string
}

/*
|--------------------------------------------------------------------------
| Errors
|--------------------------------------------------------------------------
*/

export type ImportFieldErrors =
  Record<string, string[]>

export type ImportRowError = {
  rowNumber?: number | null
  field?: string
  code?: string
  message: string
}

/*
|--------------------------------------------------------------------------
| Preview
|--------------------------------------------------------------------------
*/

export type ImportPreviewRow = {
  rowNumber?: number | null
  row_number?: number | null

  valid: boolean

  errors?: ImportFieldErrors

  [key: string]: any
}

export type ImportPreviewResult = {
  totalRows: number
  validRows: number
  invalidRows: number
  unmatchedRows?: number

  page?: number
  pageSize?: number
  totalPages?: number

  rows: ImportPreviewRow[]
}

/*
|--------------------------------------------------------------------------
| Confirmation result
|--------------------------------------------------------------------------
*/

export type ImportConfirmRow = {
  rowNumber?: number | null
  row_number?: number | null

  created?: boolean
  duplicate?: boolean

  recordId?: string | number | null
  attendanceId?: string | number | null
  employeeId?: string | number | null

  errors?: ImportFieldErrors

  [key: string]: any
}

export type ImportConfirmResult = {
  totalRows: number

  validRows: number
  invalidRows: number

  createdRows: number
  updatedRows: number
  duplicateRows: number
  skippedRows: number
  failedRows: number

  jobPublicId?: string
  jobStatus?: ImportStatus
  errorCount?: number

  duration?: number
  message?: string

  rows?: ImportConfirmRow[]
}

/*
|--------------------------------------------------------------------------
| Queue result
|--------------------------------------------------------------------------
*/

export type ImportQueuedResult = {
  jobPublicId: string
  jobStatus: ImportStatus
  taskId?: string
}

/*
|--------------------------------------------------------------------------
| Progress and job
|--------------------------------------------------------------------------
*/

export type ImportProgress = {
  current: number
  total: number
  percent: number
  message?: string
}

export type ImportJob = {
  id: string | number
  publicId: string

  module: string
  action?: string

  profileCode?: string
  profileName?: string

  filename?: string
  sourceType?: string

  status: ImportStatus

  totalRows: number
  validRows: number
  invalidRows: number

  createdRows: number
  updatedRows: number
  duplicateRows: number
  skippedRows: number
  failedRows: number

  durationMs?: number
  durationSeconds?: number

  errorCount?: number
  errorMessage?: string | null

  importedBy?: string | number | null
  importedByName?: string | null

  createdAt?: string
  updatedAt?: string
  startedAt?: string | null
  finishedAt?: string | null

  metadata?: Record<string, any>
}

/*
|--------------------------------------------------------------------------
| Job API response
|--------------------------------------------------------------------------
*/

export type ImportJobApiResponse = {
  id: string | number
  public_id: string

  module: string
  action?: string

  profile_code?: string
  profile_name?: string

  filename?: string
  source_type?: string

  status: ImportStatus

  total_rows: number
  valid_rows: number
  invalid_rows: number

  created_rows: number
  updated_rows: number
  duplicate_rows: number
  skipped_rows: number
  failed_rows: number

  duration_ms?: number
  duration_seconds?: number

  error_count?: number
  error_message?: string | null

  imported_by?: string | number | null
  imported_by_name?: string | null

  created_at?: string
  updated_at?: string
  started_at?: string | null
  finished_at?: string | null

  metadata?: Record<string, any>
}

/*
|--------------------------------------------------------------------------
| Mappers
|--------------------------------------------------------------------------
*/

export function mapImportJob(
  value: ImportJobApiResponse,
): ImportJob {
  return {
    id: value.id,
    publicId: value.public_id,

    module: value.module,
    action: value.action,

    profileCode:
      value.profile_code,

    profileName:
      value.profile_name,

    filename:
      value.filename,

    sourceType:
      value.source_type,

    status:
      value.status,

    totalRows:
      value.total_rows ?? 0,

    validRows:
      value.valid_rows ?? 0,

    invalidRows:
      value.invalid_rows ?? 0,

    createdRows:
      value.created_rows ?? 0,

    updatedRows:
      value.updated_rows ?? 0,

    duplicateRows:
      value.duplicate_rows ?? 0,

    skippedRows:
      value.skipped_rows ?? 0,

    failedRows:
      value.failed_rows ?? 0,

    durationMs:
      value.duration_ms,

    durationSeconds:
      value.duration_seconds,

    errorCount:
      value.error_count,

    errorMessage:
      value.error_message,

    importedBy:
      value.imported_by,

    importedByName:
      value.imported_by_name,

    createdAt:
      value.created_at,

    updatedAt:
      value.updated_at,

    startedAt:
      value.started_at,

    finishedAt:
      value.finished_at,

    metadata:
      value.metadata,
  }
}

export function importJobToResult(
  job: ImportJob,
): ImportConfirmResult {
  return {
    totalRows:
      job.totalRows,

    validRows:
      job.validRows,

    invalidRows:
      job.invalidRows,

    createdRows:
      job.createdRows,

    updatedRows:
      job.updatedRows,

    duplicateRows:
      job.duplicateRows,

    skippedRows:
      job.skippedRows,

    failedRows:
      job.failedRows,

    jobPublicId:
      job.publicId,

    jobStatus:
      job.status,

    errorCount:
      job.errorCount ?? 0,

    duration:
      job.durationSeconds
      ?? (
        job.durationMs !== undefined
          ? job.durationMs / 1000
          : undefined
      ),

    message:
      job.errorMessage
      ?? undefined,
  }
}

/*
|--------------------------------------------------------------------------
| Mapping
|--------------------------------------------------------------------------
*/

export type ImportFieldMapping = {
  source: string
  target: string

  required?: boolean
  ignored?: boolean
}

/*
|--------------------------------------------------------------------------
| Options
|--------------------------------------------------------------------------
*/

export type ImportOptions = {
  overwrite?: boolean
  skipDuplicates?: boolean
  skipInvalid?: boolean
  stopOnError?: boolean
  validateOnly?: boolean
  dryRun?: boolean
}

/*
|--------------------------------------------------------------------------
| Schema
|--------------------------------------------------------------------------
*/

export type ImportSchema = {
  title: string
  description?: string

  completedTitle?: string
  completedDescription?: string

  backLabel?: string
  importAnotherLabel?: string

  profileEndpoint: string
  profileLabel?: string

  fileLabel?: string
  fileAccept?: string

  previewEndpoint: string
  confirmEndpoint: string

  templateEndpoint?: string
  templateLabel?: string

  jobEndpoint?: string
  errorReportEndpoint?: string

  pollIntervalMs?: number
  pollTimeoutMs?: number

  maxFileSizeMb?: number

  previewColumns?: ImportPreviewColumn[]

  options?: ImportOptions
}

/*
|--------------------------------------------------------------------------
| Request
|--------------------------------------------------------------------------
*/

export type ImportRequest = {
  profile: number
  file: File
  options?: ImportOptions
}