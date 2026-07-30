import { computed } from "vue"

export function useApexTheme() {
  const colorMode = useColorMode()

  const isDark = computed(() => colorMode.value === "dark")

  const textColor = computed(() =>
    isDark.value ? "#e5e7eb" : "#1e293b"
  )

  const borderColor = computed(() =>
    isDark.value ? "#334155" : "#e5e7eb"
  )

  const defaultColors = computed(() =>
    isDark.value
      ? [
          "#60a5fa",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
        ]
      : [
          "#2563eb",
          "#16a34a",
          "#d97706",
          "#dc2626",
          "#7c3aed",
        ]
  )

  return {
    isDark,
    textColor,
    borderColor,
    defaultColors,
  }
}