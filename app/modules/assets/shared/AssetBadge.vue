<script setup lang="ts">
import type { BadgeKind } from './model'

import { codeLabel, statusLabel } from '@framework'

import { badgeTone } from './model'

/**
 * Lencana status / kondisi / jenis penguasaan aset.
 *
 * Teksnya kode API yang dilokalkan (`codes.<field>` → `common.status`),
 * warnanya dari `badgeTone`. Kodenya sendiri tidak pernah diubah.
 */
const props = withDefaults(defineProps<{
  kind: BadgeKind
  value?: string | null
  label?: string | null
  /** Nama field untuk `codes.<field>` — mis. `return_condition`. */
  field?: string
}>(), {
  value: null,
  label: null,
  field: undefined,
})

const text = computed(() => {
  if (!props.value)
    return '-'

  if (props.kind === 'status')
    return statusLabel(props.value, props.label ?? props.value)

  const field = props.field ?? (props.kind === 'condition' ? 'condition' : 'custody_type')

  return codeLabel(field, props.value, props.label ?? props.value)
})
</script>

<template>
  <Badge
    variant="outline"
    :class="badgeTone(props.kind, props.value)"
  >
    {{ text }}
  </Badge>
</template>
