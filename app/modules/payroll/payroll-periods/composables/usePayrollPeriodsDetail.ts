import {
  computed,
  ref,
} from "vue"

import {
  normalizeApiErrors,
} from "@framework"

import {
  payrollPeriodsConfig,
} from "../table"

import type {
  PayrollPeriodsPayload,
  PayrollPeriodsRow,
} from "../types"

interface ApiDetailResponse<T> {
  success?: boolean
  message?: string
  data?: T
  result?: T
  item?: T
}

export function usePayrollPeriodsDetail() {
  const {
    request,
  } = useApi()

  const record = ref<PayrollPeriodsRow | null>(null)
  const pending = ref(false)
  const saving = ref(false)

  const errors = ref<
    Record<string, any> | null
  >(null)

  const validationVersion = ref(0)

  const endpoint = computed(() => {
    return String(
      payrollPeriodsConfig.endpoint
      ?? "/api/payroll/payroll-periods/",
    ).replace(/\/+$/, "")
  })

  function extractRecord(
    response:
      | ApiDetailResponse<PayrollPeriodsRow>
      | PayrollPeriodsRow
      | null
      | undefined,
  ): PayrollPeriodsRow | null {
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

    return response as PayrollPeriodsRow
  }

  async function fetchRecord(
    id: string | number,
  ) {
    pending.value = true
    errors.value = null

    try {
      const response = await request<
        ApiDetailResponse<PayrollPeriodsRow>
        | PayrollPeriodsRow
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
    payload: PayrollPeriodsPayload,
  ) {
    saving.value = true
    errors.value = null

    try {
      const response = await request<
        ApiDetailResponse<PayrollPeriodsRow>
        | PayrollPeriodsRow
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
    payload: PayrollPeriodsPayload,
  ) {
    saving.value = true
    errors.value = null

    try {
      const response = await request<
        ApiDetailResponse<PayrollPeriodsRow>
        | PayrollPeriodsRow
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
    value: PayrollPeriodsRow | null,
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