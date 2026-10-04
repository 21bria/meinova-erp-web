import {
  computed,
  ref,
} from "vue"

import {
  normalizeApiErrors,
} from "@framework"

import {
  leaveConfig,
} from "../table"

import type {
  LeavePayload,
  LeaveRow,
} from "../types"

interface ApiDetailResponse<T> {
  success?: boolean
  message?: string
  data?: T
  result?: T
  item?: T
}

export function useLeaveDetail() {
  const {
    request,
  } = useApi()

  const record = ref<LeaveRow | null>(null)
  const pending = ref(false)
  const saving = ref(false)

  const errors = ref<
    Record<string, any> | null
  >(null)

  const validationVersion = ref(0)

  const endpoint = computed(() => {
    return String(
      leaveConfig.endpoint
      ?? "/api/hr/leaves/",
    ).replace(/\/+$/, "")
  })

  function extractRecord(
    response:
      | ApiDetailResponse<LeaveRow>
      | LeaveRow
      | null
      | undefined,
  ): LeaveRow | null {
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

    return response as LeaveRow
  }

  async function fetchRecord(
    id: string | number,
  ) {
    pending.value = true
    errors.value = null

    try {
      const response = await request<
        ApiDetailResponse<LeaveRow>
        | LeaveRow
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
    payload: LeavePayload,
  ) {
    saving.value = true
    errors.value = null

    try {
      const response = await request<
        ApiDetailResponse<LeaveRow>
        | LeaveRow
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

  /*
   * Pencatatan administratif — pintu yang **berbeda** dari create
   * biasa, karena wewenangnya juga berbeda.
   *
   * `POST /api/hr/leaves/` selalu melahirkan DRAFT yang harus lewat
   * alur persetujuan. `record/` menerbitkan cuti yang sudah terjadi
   * langsung sebagai RECORDED, dan backend menuntut
   * `hr.record_employeeleave` untuk itu. Payload-nya sama persis;
   * `status` tidak pernah ikut dikirim dari sini.
   */
  async function recordLeave(
    payload: LeavePayload,
  ) {
    saving.value = true
    errors.value = null

    try {
      const response = await request<any>(
        `${endpoint.value}/record/`,
        {
          method: "POST",
          body: payload,
        },
      )

      // `record/` membungkus dokumennya sekali lagi (`{ leave }`),
      // sebentuk dengan `submit/` dan kawan-kawannya.
      const wrapped = extractRecord(response)

      const currentRecord =
        (wrapped as any)?.leave ?? wrapped

      record.value = currentRecord

      return currentRecord as LeaveRow | null
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
    payload: LeavePayload,
  ) {
    saving.value = true
    errors.value = null

    try {
      const response = await request<
        ApiDetailResponse<LeaveRow>
        | LeaveRow
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
    value: LeaveRow | null,
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
    recordLeave,
    updateRecord,

    setRecord,
    clearRecord,
    clearErrors,
    reset,
  }
}