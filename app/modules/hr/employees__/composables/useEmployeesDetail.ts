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

    return `${endpoint}/${id}/`
  }

  async function fetchDetail(
    id: RecordId,
  ) {
    pending.value = true
    error.value = null

    try {
      record.value = await api<EmployeesRow>(
        buildDetailEndpoint(id),
      )

      return record.value
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

  function setRecord(
    value: EmployeesRow | null,
  ) {
    record.value = value
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
    setRecord,
    clearRecord,
  }
}