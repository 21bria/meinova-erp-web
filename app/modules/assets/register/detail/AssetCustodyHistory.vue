<script setup lang="ts">
import type { CustodyRow } from '../../shared/model'

import { useI18n } from 'vue-i18n'

import { formatDate } from '@/utils/formatDate'

import AssetBadge from '../../shared/AssetBadge.vue'
import { ASSET_ENDPOINT } from '../../shared/model'
import { useAssetRows } from '../../shared/useAssetRows'

/**
 * Tab Custody History — baris `AssetCustody` kanonik, terbaru dulu, dari
 * `GET /api/assets/assets/{id}/custody-history/`. Tidak ada tabel riwayat
 * kedua dan tidak ada jalur ubah. Endpoint-nya tunduk pada visibilitas
 * aset yang sama.
 */
const props = defineProps<{
  recordId?: number | string | null
  record?: Record<string, any> | null
}>()

const { t } = useI18n()

const { rows, loading, error, forbidden } = useAssetRows<CustodyRow>(
  () => (props.recordId ? `${ASSET_ENDPOINT}${props.recordId}/custody-history/` : null),
  {},
  () => props.record?.current_custody,
)
</script>

<template>
  <div class="space-y-3" data-testid="asset-custody-history">
    <p v-if="loading" class="text-sm text-muted-foreground">
      {{ t('common.state.loading') }}
    </p>
    <p v-else-if="error" class="text-sm text-destructive">
      {{ t('assets.ui.history.loadFailed') }} {{ error }}
    </p>
    <p v-else-if="forbidden || !rows.length" class="text-sm text-muted-foreground">
      {{ t('assets.ui.history.custodyEmpty') }}
    </p>

    <div v-else class="overflow-x-auto rounded-lg border">
      <table class="w-full min-w-[720px] text-sm">
        <thead class="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th class="px-3 py-2">
              {{ t('assets.register.fields.custody_type') }}
            </th>
            <th class="px-3 py-2">
              {{ t('assets.ui.custody.holder') }}
            </th>
            <th class="px-3 py-2">
              {{ t('assets.ui.custody.location') }}
            </th>
            <th class="px-3 py-2">
              {{ t('assets.ui.custody.since') }}
            </th>
            <th class="px-3 py-2">
              {{ t('assets.ui.custody.until') }}
            </th>
            <th class="px-3 py-2">
              {{ t('assets.ui.custody.condition') }}
            </th>
            <th class="px-3 py-2">
              {{ t('assets.ui.custody.openedBy') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.id"
            class="border-t align-top"
            :class="row.is_current ? 'bg-primary/5' : ''"
          >
            <td class="px-3 py-2">
              <div class="flex flex-wrap items-center gap-1">
                <AssetBadge kind="custody" :value="row.custody_type" :label="row.custody_type_label" />
                <Badge v-if="row.is_current" variant="secondary">
                  {{ t('assets.ui.custody.current') }}
                </Badge>
              </div>
            </td>
            <td class="px-3 py-2">
              <div>{{ row.employee_name || row.department_name || '-' }}</div>
              <div v-if="row.custody_type === 'ORGANIZATION'" class="text-xs text-muted-foreground">
                {{ t('assets.ui.custody.pic') }}: {{ row.pic_employee_name || t('assets.ui.custody.noPic') }}
              </div>
            </td>
            <td class="px-3 py-2">
              <div>{{ row.location_name || '-' }}</div>
              <div v-if="row.facility_name" class="text-xs text-muted-foreground">
                {{ row.facility_name }}
              </div>
            </td>
            <td class="px-3 py-2 whitespace-nowrap">
              {{ formatDate(row.started_on) }}
            </td>
            <td class="px-3 py-2 whitespace-nowrap">
              {{ row.ended_on ? formatDate(row.ended_on) : '-' }}
            </td>
            <td class="px-3 py-2">
              <div class="flex flex-wrap items-center gap-1">
                <AssetBadge v-if="row.start_condition" kind="condition" :value="row.start_condition" />
                <template v-if="row.end_condition">
                  <span class="text-muted-foreground">→</span>
                  <AssetBadge kind="condition" :value="row.end_condition" />
                </template>
              </div>
            </td>
            <td class="px-3 py-2">
              <NuxtLink
                v-if="row.opened_by?.route"
                :to="row.opened_by.route"
                class="text-primary hover:underline"
              >
                {{ row.opened_by.document_number }}
              </NuxtLink>
              <span v-else>{{ row.opened_by?.type_label ?? '-' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
