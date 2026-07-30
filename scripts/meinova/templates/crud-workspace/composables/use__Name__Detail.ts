import {
  computed,
  ref,
} from "vue"

import type {
  __Name__Row,
} from "../types"

import {
  __name__Config,
} from "../table"

type RecordId =
  | string
  | number

export function use__Name__Detail() {
  const api = useApi()

  const record = ref<__Name__Row | null>(null)
  const pending = ref(false)
  const error = ref<unknown>(null)

  const exists = computed(
    () => record.value !== null,
  )

  function buildDetailEndpoint(
    id: RecordId,
  ) {
    const endpoint =
      __name__Config.endpoint.replace(/\/+$/g, "")

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
      const response = await api<__Name__Row>(
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
    value: __Name__Row | null,
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