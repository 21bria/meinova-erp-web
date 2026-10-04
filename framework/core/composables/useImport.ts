import {
  computed,
  ref,
} from "vue"

import {
  useApi,
} from "@/composables/useApi"

import {
  normalizeApiError,
  unwrapResponse,
} from "../utils/api"

import type {
  ApiResponse,
} from "../utils/api"

import {
  importJobToResult,
  mapImportJob,
} from "../types/import"

import type {
  ImportConfirmResult,
  ImportJob,
  ImportJobApiResponse,
  ImportPreviewResult,
  ImportProfile,
  ImportQueuedResult,
  ImportSchema,
  ImportStatus,
} from "../types/import"

export function useImport(
  schema: ImportSchema,
) {
  const {
    request,
  } = useApi()

  /*
  |--------------------------------------------------------------------------
  | Input state
  |--------------------------------------------------------------------------
  */

  const profileId = ref<
    number | null
  >(null)

  const selectedProfile = ref<
    ImportProfile | null
  >(null)

  const file = ref<File | null>(
    null,
  )

  /*
  |--------------------------------------------------------------------------
  | Preview state
  |--------------------------------------------------------------------------
  */

  const preview = ref<
    ImportPreviewResult | null
  >(null)

  const previewPage = ref(
    1,
  )

  const previewPageSize = ref(
    50,
  )

  /*
  |--------------------------------------------------------------------------
  | Job state
  |--------------------------------------------------------------------------
  */

  const job = ref<
    ImportJob | null
  >(null)

  const jobPublicId = ref<
    string | null
  >(null)

  const jobStatus = ref<
    ImportStatus
  >("idle")

  /*
  |--------------------------------------------------------------------------
  | Result state
  |--------------------------------------------------------------------------
  */

  const result = ref<
    ImportConfirmResult | null
  >(null)

  const errors = ref<
    Record<string, any>
  >({})

  /*
  |--------------------------------------------------------------------------
  | Loading state
  |--------------------------------------------------------------------------
  */

  const previewing = ref(
    false,
  )

  const loadingPage = ref(
    false,
  )

  const importing = ref(
    false,
  )

  const polling = ref(
    false,
  )

  /*
  |--------------------------------------------------------------------------
  | Derived state
  |--------------------------------------------------------------------------
  */

  const hasProfile = computed(() => {
    return (
      profileId.value !== null
    )
  })

  const hasFile = computed(() => {
    return (
      file.value !== null
    )
  })

  const hasPreview = computed(() => {
    return (
      preview.value !== null
    )
  })

  const hasResult = computed(() => {
    return (
      result.value !== null
    )
  })

  const isProcessing = computed(() => {
    return [
      "queued",
      "pending",
      "processing",
      "importing",
    ].includes(
      jobStatus.value,
    )
  })

  const canPreview = computed(() => {
    return (
      hasProfile.value
      && hasFile.value
      && !previewing.value
      && !loadingPage.value
      && !importing.value
      && !polling.value
    )
  })

  const canImport = computed(() => {
    return (
      preview.value !== null
      && preview.value.validRows > 0
      && !previewing.value
      && !loadingPage.value
      && !importing.value
      && !polling.value
    )
  })

  /*
  |--------------------------------------------------------------------------
  | Input actions
  |--------------------------------------------------------------------------
  */

  function setProfile(
    profile: ImportProfile | null,
  ) {
    selectedProfile.value = profile

    profileId.value = (
      profile?.value
      ?? profile?.id
      ?? null
    )

    resetResult()
  }

  function setFile(
    value: File | null,
  ) {
    file.value = value

    resetResult()
  }

  /*
  |--------------------------------------------------------------------------
  | Reset actions
  |--------------------------------------------------------------------------
  */

  function resetErrors() {
    errors.value = {}
  }

  function resetPreview() {
    preview.value = null
    previewPage.value = 1
  }

  function resetJob() {
    job.value = null
    jobPublicId.value = null
    jobStatus.value = "idle"
    polling.value = false
  }

  function resetImportResult() {
    result.value = null
  }

  function resetResult() {
    resetPreview()
    resetJob()
    resetImportResult()
    resetErrors()
  }

  function reset() {
    profileId.value = null
    selectedProfile.value = null
    file.value = null

    previewing.value = false
    loadingPage.value = false
    importing.value = false
    polling.value = false

    resetResult()
  }

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  function getAllowedExtensions() {
    return String(
      schema.fileAccept
      ?? "",
    )
      .split(",")
      .map(item => item.trim())
      .filter(item => {
        return item.startsWith(".")
      })
      .map(item => {
        return item.toLowerCase()
      })
  }

  function validateBeforePreview() {
    const nextErrors:
      Record<string, string[]> = {}

    if (!hasProfile.value) {
      nextErrors.profile = [
        "Please select an import profile.",
      ]
    }

    if (!hasFile.value) {
      nextErrors.file = [
        "Please select an import file.",
      ]
    }

    if (file.value) {
      const filename = (
        file.value.name
          .trim()
          .toLowerCase()
      )

      const allowedExtensions = (
        getAllowedExtensions()
      )

      if (
        allowedExtensions.length > 0
        && !allowedExtensions.some(
          extension => {
            return filename.endsWith(
              extension,
            )
          },
        )
      ) {
        nextErrors.file = [
          `Supported file types: ${allowedExtensions.join(", ")}.`,
        ]
      }
    }

    if (
      file.value
      && schema.maxFileSizeMb
    ) {
      const maxSizeBytes = (
        schema.maxFileSizeMb
        * 1024
        * 1024
      )

      if (
        file.value.size
        > maxSizeBytes
      ) {
        nextErrors.file = [
          `File size must not exceed ${schema.maxFileSizeMb} MB.`,
        ]
      }
    }

    errors.value = nextErrors

    return (
      Object.keys(
        nextErrors,
      ).length === 0
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Form data
  |--------------------------------------------------------------------------
  */

  function buildFormData() {
    const body = new FormData()

    if (
      profileId.value !== null
    ) {
      body.append(
        "profile",
        String(
          profileId.value,
        ),
      )
    }

    if (file.value) {
      body.append(
        "file",
        file.value,
        file.value.name,
      )
    }

    body.append(
      "skip_invalid",
      String(
        schema.options?.skipInvalid
        ?? true,
      ),
    )

    if (schema.options) {
      body.append(
        "options",
        JSON.stringify(
          schema.options,
        ),
      )
    }

    return body
  }

  /*
  |--------------------------------------------------------------------------
  | Preview
  |--------------------------------------------------------------------------
  */

  function buildPreviewEndpoint(
    page: number,
  ) {
    const separator = (
      schema.previewEndpoint
        .includes("?")
        ? "&"
        : "?"
    )

    return (
      `${schema.previewEndpoint}`
      + `${separator}page=${page}`
      + `&page_size=${previewPageSize.value}`
    )
  }

  async function previewFile(
    page = 1,
  ): Promise<
    ImportPreviewResult | null
  > {
    if (
      previewing.value
      || loadingPage.value
      || importing.value
      || polling.value
    ) {
      return null
    }

    if (!validateBeforePreview()) {
      return null
    }

    const changingPage = (
      preview.value !== null
      && page !== previewPage.value
    )

    if (changingPage) {
      loadingPage.value = true
      resetErrors()
    }
    else {
      previewing.value = true

      resetErrors()
      resetImportResult()
      resetJob()
    }

    try {
      const response = await request<
        ApiResponse<ImportPreviewResult>
        | ImportPreviewResult
      >(
        buildPreviewEndpoint(
          page,
        ),
        {
          method: "POST",
          body: buildFormData(),
        },
      )

      const nextPreview = (
        unwrapResponse<
          ImportPreviewResult
        >(response)
      )

      preview.value = nextPreview

      previewPage.value = (
        nextPreview.page
        ?? page
      )

      return nextPreview
    }
    catch (error: unknown) {
      errors.value = (
        normalizeApiError(
          error,
          "Import preview failed.",
        )
      )

      return null
    }
    finally {
      previewing.value = false
      loadingPage.value = false
    }
  }

  function setPreviewPageSize(
    value: number,
  ) {
    previewPageSize.value = Math.min(
      Math.max(
        value,
        1,
      ),
      200,
    )

    previewPage.value = 1
  }

  /*
  |--------------------------------------------------------------------------
  | Polling helpers
  |--------------------------------------------------------------------------
  */

  function sleep(
    milliseconds: number,
  ) {
    return new Promise<void>(
      resolve => {
        window.setTimeout(
          resolve,
          milliseconds,
        )
      },
    )
  }

  function buildJobEndpoint(
    publicId: string,
  ) {
    const template = (
      schema.jobEndpoint
      ?? "/api/imports/jobs/{jobPublicId}/"
    )

    return template.replace(
      "{jobPublicId}",
      encodeURIComponent(
        publicId,
      ),
    )
  }

  async function loadImportJob(
    publicId: string,
  ): Promise<ImportJob> {
    const response = await request<
      ApiResponse<ImportJobApiResponse>
      | ImportJobApiResponse
    >(
      buildJobEndpoint(
        publicId,
      ),
      {
        method: "GET",
      },
    )

    const rawJob = (
      unwrapResponse<
        ImportJobApiResponse
      >(response)
    )

    const nextJob = (
      mapImportJob(
        rawJob,
      )
    )

    job.value = nextJob
    jobStatus.value = nextJob.status

    return nextJob
  }

  async function waitForImportJob(
    publicId: string,
  ): Promise<
    ImportConfirmResult
  > {
    const interval = Math.max(
      schema.pollIntervalMs
      ?? 1500,
      500,
    )

    const timeout = Math.max(
      schema.pollTimeoutMs
      ?? (
        10
        * 60
        * 1000
      ),
      interval,
    )

    const startedAt = Date.now()

    polling.value = true

    try {
      while (true) {
        const currentJob = (
          await loadImportJob(
            publicId,
          )
        )

        if (
          currentJob.status
          === "completed"
          || currentJob.status
          === "partial"
        ) {
          return importJobToResult(
            currentJob,
          )
        }

        if (
          currentJob.status
          === "failed"
        ) {
          throw new Error(
            currentJob.errorMessage
            || "Import processing failed.",
          )
        }

        if (
          currentJob.status
          === "cancelled"
        ) {
          throw new Error(
            "Import processing was cancelled.",
          )
        }

        if (
          Date.now() - startedAt
          >= timeout
        ) {
          throw new Error(
            "Import processing timed out.",
          )
        }

        await sleep(
          interval,
        )
      }
    }
    finally {
      polling.value = false
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Confirm import
  |--------------------------------------------------------------------------
  */

  async function confirmImport():
    Promise<
      ImportConfirmResult | null
    > {
    if (
      previewing.value
      || loadingPage.value
      || importing.value
      || polling.value
    ) {
      return null
    }

    if (!preview.value) {
      errors.value = {
        detail: [
          "Please preview the file before importing.",
        ],
      }

      return null
    }

    if (
      preview.value.validRows <= 0
    ) {
      errors.value = {
        detail: [
          "No valid rows are available for import.",
        ],
      }

      return null
    }

    importing.value = true

    resetErrors()
    resetImportResult()
    resetJob()

    try {
      const response = await request<
        ApiResponse<ImportQueuedResult>
        | ImportQueuedResult
      >(
        schema.confirmEndpoint,
        {
          method: "POST",
          body: buildFormData(),
        },
      )

      const queued = (
        unwrapResponse<
          ImportQueuedResult
        >(response)
      )

      if (!queued.jobPublicId) {
        throw new Error(
          "Import job ID was not returned by the server.",
        )
      }

      jobPublicId.value = (
        queued.jobPublicId
      )

      jobStatus.value = (
        queued.jobStatus
        ?? "queued"
      )

      const finalResult = (
        await waitForImportJob(
          queued.jobPublicId,
        )
      )

      result.value = finalResult

      return finalResult
    }
    catch (error: unknown) {
      const message = (
        error instanceof Error
          ? error.message
          : "Import failed."
      )

      errors.value = (
        normalizeApiError(
          error,
          message,
        )
      )

      jobStatus.value = "failed"

      return null
    }
    finally {
      importing.value = false
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Public API
  |--------------------------------------------------------------------------
  */

  return {
    profileId,
    selectedProfile,
    file,

    preview,
    result,
    errors,

    job,
    jobPublicId,
    jobStatus,

    previewing,
    loadingPage,
    importing,
    polling,

    previewPage,
    previewPageSize,

    hasProfile,
    hasFile,
    hasPreview,
    hasResult,
    isProcessing,

    canPreview,
    canImport,

    setProfile,
    setFile,
    setPreviewPageSize,

    reset,
    resetErrors,
    resetPreview,
    resetJob,
    resetImportResult,
    resetResult,

    buildFormData,
    previewFile,
    loadImportJob,
    waitForImportJob,
    confirmImport,
  }
}