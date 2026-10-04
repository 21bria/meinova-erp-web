<script setup lang="ts">
import type { MovementKind } from '../../shared/model'

import { useI18n } from 'vue-i18n'

import { formatDate } from '@/utils/formatDate'

import AssetBadge from '../../shared/AssetBadge.vue'
import { MOVEMENT_ENDPOINTS, movementRoute } from '../../shared/model'
import { useAssetRows } from '../../shared/useAssetRows'

/**
 * Tab Documents — Assignment / Transfer / Return untuk aset ini, lewat
 * filter `?asset=` pada endpoint dokumen yang sudah ada (bukan read
 * model kedua). Tiap daftar tunduk pada izin dan cakupan dokumennya
 * sendiri: dokumen yang tidak boleh dibaca pemakai memang tidak muncul.
 */
const props = defineProps<{
  recordId?: number | string | null
  record?: Record<string, any> | null
}>()

const { t } = useI18n()

const query = computed(() => ({
  asset: props.recordId,
  page_size: 50,
  ordering: '-created_at',
}))

const reload = () => props.record?.current_custody

function section(kind: MovementKind) {
  return {
    kind,
    ...useAssetRows<Record<string, any>>(
      () => (props.recordId ? MOVEMENT_ENDPOINTS[kind] : null),
      query,
      reload,
    ),
  }
}

const sections = [section('assignments'), section('transfers'), section('returns')]

function documentDate(kind: MovementKind, row: Record<string, any>): string | null {
  if (kind === 'assignments')
    return row.handover_date ?? row.submitted_at ?? row.created_at
  if (kind === 'returns')
    return row.return_date ?? row.submitted_at ?? row.created_at

  return row.transfer_date ?? row.submitted_at ?? row.created_at
}
</script>

<template>
  <div class="space-y-6" data-testid="asset-documents">
    <section
      v-for="item in sections"
      :key="item.kind"
      class="space-y-2"
    >
      <h3 class="text-sm font-semibold">
        {{ t(`assets.ui.documents.${item.kind}`) }}
      </h3>

      <p v-if="item.loading.value" class="text-sm text-muted-foreground">
        {{ t('common.state.loading') }}
      </p>
      <p
        v-else-if="item.forbidden.value || !item.rows.value.length"
        class="text-sm text-muted-foreground"
      >
        {{ t('assets.ui.documents.empty') }}
      </p>

      <div v-else class="overflow-x-auto rounded-lg border">
        <table class="w-full min-w-[560px] text-sm">
          <tbody>
            <tr
              v-for="row in item.rows.value"
              :key="row.id"
              class="border-t first:border-t-0"
            >
              <td class="px-3 py-2 font-medium">
                <NuxtLink
                  :to="movementRoute(item.kind, row.id)"
                  class="text-primary hover:underline"
                >
                  {{ row.document_number || `#${row.id}` }}
                </NuxtLink>
              </td>
              <td class="px-3 py-2">
                <AssetBadge kind="status" :value="row.status" />
              </td>
              <td class="px-3 py-2">
                {{ row.employee_name || row.target_employee_name || row.source_employee_name
                  || row.department_name || row.target_department_name || row.source_department_name
                  || row.destination_location_name || row.target_location_name || '-' }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-muted-foreground">
                {{ formatDate(documentDate(item.kind, row)) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
