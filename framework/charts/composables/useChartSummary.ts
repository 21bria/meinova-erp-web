import { ref } from "vue"
import type { ChartPointPayload } from "../types"

export function useChartSummary() {
  const open = ref(false)
  const selected = ref<ChartPointPayload | null>(null)

  function show(payload: ChartPointPayload) {
    selected.value = payload
    open.value = true
  }

  function close() {
    open.value = false
  }

  return {
    open,
    selected,
    show,
    close,
  }
}