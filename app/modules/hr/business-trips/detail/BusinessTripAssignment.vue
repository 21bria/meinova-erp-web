<script setup lang="ts">
import type { BusinessTripRecord } from './model'

import { useI18n } from 'vue-i18n'

import { snapshotItems } from './model'

/**
 * Tab Assignment — salinan organisasi pegawai di dokumen ini.
 *
 * **Read-only, selalu.** Kolomnya diisi service dari penempatan pegawai
 * dan dibekukan saat diajukan; serializer menandainya read-only. Layar
 * ini cuma membacanya — tidak ada satu pun isian yang bisa menimpanya.
 */
const props = defineProps<{ record?: Record<string, any> | null }>()

// Baris hasil generate (`BusinessTripsRow`) dibaca sebagai record dokumen.
const trip = computed(() => (props.record ?? null) as BusinessTripRecord | null)

const { t } = useI18n()

const items = computed(() => snapshotItems(trip.value))

const employee = computed(() => {
  const name = props.record?.employee_name
  const number = props.record?.employee_number

  if (!name && !number)
    return null

  return [number, name].filter(Boolean).join(' — ')
})
</script>

<template>
  <div class="space-y-4" data-testid="business-trip-assignment">
    <p class="text-sm text-muted-foreground">
      {{ t('hr.business-trips.assignment.hint') }}
    </p>

    <dl class="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
      <div class="space-y-1">
        <dt class="text-xs font-medium text-muted-foreground uppercase">
          {{ t('hr.business-trips.fields.employee') }}
        </dt>
        <dd class="text-sm font-medium">
          {{ employee ?? '—' }}
        </dd>
      </div>

      <div class="space-y-1">
        <dt class="text-xs font-medium text-muted-foreground uppercase">
          {{ t('hr.business-trips.fields.requester') }}
        </dt>
        <dd class="text-sm">
          {{ record?.requester_name || '—' }}
        </dd>
      </div>

      <div
        v-for="item in items"
        :key="item.key"
        class="space-y-1"
      >
        <dt class="text-xs font-medium text-muted-foreground uppercase">
          {{ t(`hr.business-trips.fields.${item.key}`) }}
        </dt>
        <dd class="text-sm">
          {{ item.value ?? '—' }}
        </dd>
      </div>
    </dl>
  </div>
</template>
