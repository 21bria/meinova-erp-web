<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'

import type { FormField } from '@framework'

import type { BusinessTripRecord } from './model'

import {
  column,
  createColumns,
  MWorkspaceResource,
  resourceLabel,
  useResourceAccess,
  useWorkspaceResource,
} from '@framework'

import { useI18n } from 'vue-i18n'

import { businessTripLegsForm } from '@/modules/hr/business-trip-legs/form'

import {
  BUSINESS_TRIP_LEG_ENDPOINT,
  legAccess,
} from './model'

/**
 * Tab Travel & Accommodation — itinerary Business Trip.
 *
 * Isiannya dari schema backend `hr/business-trip-legs` (modul
 * `business-trip-legs` hasil generate; tidak punya rute sendiri). Baris
 * dimuat dan disimpan lewat `/api/hr/business-trip-legs/?trip=<id>`,
 * diurutkan backend (sequence, lalu id).
 *
 * **Kapan ruas bisa diubah tidak diputuskan di sini.** Tombolnya mengikuti
 * `is_editable` dokumen dari backend plus izin model ruas; yang menolak
 * tetap `BusinessTripLegService` — termasuk untuk siapa pun yang menembak
 * API langsung.
 */
const props = defineProps<{
  // Baris hasil generate (`BusinessTripsRow`) — dibaca sebagai
  // `BusinessTripRecord`.
  record?: Record<string, any> | null
  recordId?: string | number | null
}>()

const { t } = useI18n()

const resource = useWorkspaceResource<
  { id: string | number } & Record<string, any>,
  Record<string, any>
>({
  endpoint: () => BUSINESS_TRIP_LEG_ENDPOINT,
  parentKey: 'trip',
  parentId: () => props.recordId ?? null,
  immediate: true,
})

const { load: loadAccess, accessFor } = useResourceAccess()

onMounted(() => {
  loadAccess()
})

const access = computed(() =>
  legAccess(props.record as BusinessTripRecord | null, accessFor(BUSINESS_TRIP_LEG_ENDPOINT)),
)

/*
| Induknya (`trip`) diisi tab ini, bukan dipilih; `is_active` bukan
| konsep ruas perjalanan.
*/
const HIDDEN_FIELDS = new Set(['trip', 'is_active'])

const schema = computed<FormField[]>(() =>
  (businessTripLegsForm as FormField[]).filter(
    field => !HIDDEN_FIELDS.has(String(field.key)),
  ),
)

function label(key: string, fallback: string) {
  return resourceLabel(`hr.business-trip-legs.fields.${key}`, fallback)
}

// Dirakit di dalam computed supaya judul kolom ikut bahasa aktif.
const columns = computed<ColumnDef<any, any>[]>(() =>
  createColumns<Record<string, any>>({
    selectable: false,
    canMutate: false,
    actions: {},
    items: [
      column.text('sequence', label('sequence', 'Sequence')),
      column.text('direction_label', label('direction', 'Direction')),
      column.date('travel_start_date', label('travel_start_date', 'Travel Date')),
      column.date('travel_end_date', label('travel_end_date', 'Arrival Date')),
      column.text('origin', label('origin', 'From')),
      column.text('destination', label('destination', 'To')),
      column.text('transport_mode_name', label('transport_mode', 'Transport')),
      column.text('ticket_number', label('ticket_number', 'Ticket No.')),
      column.text('accommodation_name', label('accommodation_name', 'Accommodation')),
    ],
  }),
)

watch(
  () => props.record?.legs?.length,
  (next, previous) => {
    // Dokumen dimuat ulang (mis. sesudah tombol aksi) → baris ikut.
    if (previous !== undefined && next !== previous)
      resource.fetchRows?.()
  },
)
</script>

<template>
  <div class="space-y-3" data-testid="business-trip-legs">
    <p
      v-if="record && !access.canCreate && !access.canEdit"
      class="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground"
      data-testid="business-trip-legs-locked"
    >
      {{ t('hr.business-trips.legs.locked') }}
    </p>

    <MWorkspaceResource
      :title="t('hr.business-trips.tabs.travel')"
      :description="t('hr.business-trips.legs.description')"
      :rows="resource.rows.value"
      :columns="columns"
      :schema="schema"
      :total="resource.total.value"
      :page="resource.page.value"
      :page-size="resource.pageSize.value"
      :search="resource.search.value"
      :loading="resource.pending.value"
      :saving="resource.saving.value"
      :deleting="resource.deleting.value"
      :can-create="resource.canCreate.value && access.canCreate"
      :can-edit="access.canEdit"
      :can-delete="access.canDelete"
      :dialog-open="resource.dialogOpen.value"
      :delete-open="resource.deleteOpen.value"
      :mode="resource.mode.value"
      :selected="resource.selected.value"
      :errors="resource.errors.value"
      :empty-text="t('hr.business-trips.legs.empty')"
      @add="resource.openCreate"
      @edit="resource.openEdit"
      @delete="resource.askDelete"
      @submit="resource.submit"
      @confirm-delete="resource.confirmDelete"
      @update:dialog-open="(value: boolean) => value ? (resource.dialogOpen.value = true) : resource.closeDialog()"
      @update:delete-open="(value: boolean) => (resource.deleteOpen.value = value)"
      @update:search="resource.onSearch"
      @change-page="resource.onChangePage"
      @change-page-size="resource.onChangePageSize"
      @change-sorting="resource.onChangeSorting"
    />
  </div>
</template>
