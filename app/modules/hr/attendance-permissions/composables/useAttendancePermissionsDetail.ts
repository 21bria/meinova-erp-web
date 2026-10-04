import {
  computed,
  ref,
} from "vue"

import {
  normalizeApiErrors,
} from "@framework"

import {
  attendancePermissionsConfig,
} from "../table"

import type {
  AttendancePermissionsPayload,
  AttendancePermissionsRow,
} from "../types"

interface ApiDetailResponse<T> {
  success?: boolean
  message?: string
  data?: T
  result?: T
  item?: T
}

export function useAttendancePermissionsDetail() {
  const {
    request,
  } = useApi()

  const record = ref<AttendancePermissionsRow | null>(null)
  const pending = ref(false)
  const saving = ref(false)

  const errors = ref<
    Record<string, any> | null
  >(null)

  const validationVersion = ref(0)

  const endpoint = computed(() => {
    return String(
      attendancePermissionsConfig.endpoint
      ?? "/api/hr/attendance-permissions/",
    ).replace(/\/+$/, "")
  })

  function extractRecord(
    response:
      | ApiDetailResponse<AttendancePermissionsRow>
      | AttendancePermissionsRow
      | null
      | undefined,
  ): AttendancePermissionsRow | null {
    if (!response)
      return null

    if (
      typeof response === "object"
      && "data" in response
      && response.data
    ) {
      return response.data
    }

    if (
      typeof response === "object"
      && "result" in response
      && response.result
    ) {
      return response.result
    }

    if (
      typeof response === "object"
      && "item" in response
      && response.item
    ) {
      return response.item
    }

    return response as AttendancePermissionsRow
  }

  async function fetchRecord(
    id: string | number,
  ) {
    pending.value = true
    errors.value = null

    try {
      const response = await request<
        ApiDetailResponse<AttendancePermissionsRow>
        | AttendancePermissionsRow
      >(
        `${endpoint.value}/${id}/`,
        {
          method: "GET",
        },
      )

      const currentRecord =
        extractRecord(response)

      record.value = currentRecord

      return currentRecord
    }
    catch (error) {
      errors.value =
        normalizeApiErrors(error)

      record.value = null

      throw error
    }
    finally {
      pending.value = false
    }
  }

  async function createRecord(
    payload: AttendancePermissionsPayload,
  ) {
    saving.value = true
    errors.value = null

    try {
      const response = await request<
        ApiDetailResponse<AttendancePermissionsRow>
        | AttendancePermissionsRow
      >(
        `${endpoint.value}/`,
        {
          method: "POST",
          body: payload,
        },
      )

      const currentRecord =
        extractRecord(response)

      record.value = currentRecord

      return currentRecord
    }
    catch (error) {
      errors.value =
        normalizeApiErrors(error)

      validationVersion.value += 1

      throw error
    }
    finally {
      saving.value = false
    }
  }

  async function updateRecord(
    id: string | number,
    payload: AttendancePermissionsPayload,
  ) {
    saving.value = true
    errors.value = null

    try {
      const response = await request<
        ApiDetailResponse<AttendancePermissionsRow>
        | AttendancePermissionsRow
      >(
        `${endpoint.value}/${id}/`,
        {
          method: "PATCH",
          body: payload,
        },
      )

      const currentRecord =
        extractRecord(response)

      record.value = currentRecord

      return currentRecord
    }
    catch (error) {
      errors.value =
        normalizeApiErrors(error)

      validationVersion.value += 1

      throw error
    }
    finally {
      saving.value = false
    }
  }

  function setRecord(
    value: AttendancePermissionsRow | null,
  ) {
    record.value = value
  }

  function clearRecord() {
    record.value = null
  }

  function clearErrors() {
    errors.value = null
  }

  function reset() {
    record.value = null
    pending.value = false
    saving.value = false
    errors.value = null
    validationVersion.value = 0
  }

  return {
    record,
    pending,
    saving,
    errors,
    validationVersion,

    endpoint,

    fetchRecord,
    createRecord,
    updateRecord,

    setRecord,
    clearRecord,
    clearErrors,
    reset,
  }
}