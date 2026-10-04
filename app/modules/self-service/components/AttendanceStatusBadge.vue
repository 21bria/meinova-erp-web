<script setup lang="ts">
import { codeLabel } from '@framework'

/**
 * Status kehadiran sebagai chip.
 *
 * Kata-katanya dari `common.status.*` lewat `codeLabel()` — katalog yang
 * sama yang dipakai seluruh tabel HR, jadi "Terlambat" di dashboard dan
 * "Terlambat" di layar Attendance selalu berbunyi sama. Warnanya dari
 * `ui.ts`, satu peta untuk kehadiran.
 *
 * Yang dicocokkan `status` (kode stabil), bukan `label`: labelnya kalimat
 * Inggris dari backend dan boleh berubah kapan saja. Mencocokkan lewat
 * label berarti warnanya putus diam-diam begitu ada yang memperbaiki satu
 * kata di Django.
 */
import { ATTENDANCE_TINTS, ATTENDANCE_VARIANTS } from '../ui'

const props = defineProps<{
  status: string | null
  label?: string
}>()

const key = computed(() => String(props.status ?? '').toLowerCase())

const variant = computed(() => ATTENDANCE_VARIANTS[key.value] ?? 'outline')

const tint = computed(() => ATTENDANCE_TINTS[key.value] ?? '')

const text = computed(() => codeLabel('status', key.value, props.label ?? ''))
</script>

<template>
  <Badge v-if="key" :variant="variant" :class="tint">
    {{ text }}
  </Badge>
</template>
