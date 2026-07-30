import {
  computed,
  ref,
} from "vue"

import type {
  EmployeesRow,
} from "../types"

import {
  employeesConfig,
} from "../table"

type RecordId =
  | string
  | number

export function useEmployeesDetail() {
  const api = useApi()

  const record = ref<EmployeesRow | null>(null)
  const pending = ref(false)
  const error = ref<unknown>(null)

  const exists = computed(
    () => record.value !== null,
  )

  function buildDetailEndpoint(
    id: RecordId,
  ) {
    const endpoint =
      employeesConfig.endpoint.replace(/\/+$/g, "")

    return `${endpoint}/${encodeURIComponent(String(id))}/`
  }

  async function fetchDetail(
    id: RecordId,
  ) {
    if (
      id === ""
      || id === null
      || id === undefined
    ) {
      throw new Error(
        "Record ID is required to fetch detail.",
      )
    }

    pending.value = true
    error.value = null

    try {
      const response = await api<EmployeesRow>(
        buildDetailEndpoint(id),
      )

      record.value = response

      return response
    }
    catch (caughtError) {
      record.value = null
      error.value = caughtError

      throw caughtError
    }
    finally {
      pending.value = false
    }
  }

  async function refresh(
    id: RecordId,
  ) {
    return await fetchDetail(id)
  }

  function setRecord(
    value: EmployeesRow | null,
  ) {
    record.value = value
    error.value = null
  }

  function clearRecord() {
    record.value = null
    error.value = null
  }

  return {
    record,
    pending,
    error,
    exists,

    fetchDetail,
    refresh,
    setRecord,
    clearRecord,
  }
}