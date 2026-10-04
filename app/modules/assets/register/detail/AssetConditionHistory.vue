<script setup lang="ts">
import type { ConditionRow } from '../../shared/model'

import { codeLabel } from '@framework'
import { useI18n } from 'vue-i18n'

import { formatDateTime } from '@/utils/formatDate'

import AssetBadge from '../../shared/AssetBadge.vue'
import { ASSET_ENDPOINT } from '../../shared/model'
import { useAssetRows } from '../../shared/useAssetRows'

/**
 * Tab Condition History — `AssetConditionLog` append-only, terbaru dulu,
 * dari `GET /api/assets/assets/{id}/condition-history/`. Baca saja: riwayat
 * kondisi tidak bisa disunting atau dihapus; kondisi baru dicatat lewat
 * aksi Record Condition di kepala halaman.
 */
const props = defineProps<{
  recordId?: number | string | null
  record?: Record<string, any> | null
}>()

const { t } = useI18n()

const { rows, loading, error, forbidden } = useAssetRows<ConditionRow>(
  () => (props.recordId ? `${ASSET_ENDPOINT}${props.recordId}/condition-history/` : null),
  {},
  () => `${props.record?.condition}|${props.record?.updated_at}`,
)
</script>

<template>
  <div class="space-y-3" data-testid="asset-condition-history">
    <p v-if="loading" class="text-sm text-muted-foreground">
      {{ t('common.state.loading') }}
    </p>
    <p v-else-if="error" class="text-sm text-destructive">
      {{ t('assets.ui.history.loadFailed') }} {{ error }}
    </p>
    <p v-else-if="forbidden || !rows.length" class="text-sm text-muted-foreground">
      {{ t('assets.ui.history.conditionEmpty') }}
    </p>

    <ol v-else class="space-y-3">
      <li
        v-for="row in rows"
        :key="row.id"
        class="rounded-lg border p-3"
      >
        <div class="flex flex-wrap items-center gap-2 text-sm">
          <span class="whitespace-nowrap text-muted-foreground">{{ formatDateTime(row.effective_at) }}</span>
          <Badge variant="secondary">
            {{ codeLabel('condition_source', row.source, row.source_label ?? row.source) }}
          </Badge>
          <template v-if="row.previous_condition">
            <AssetBadge kind="condition" :value="row.previous_condition" />
            <span class="text-muted-foreground">→</span>
          </template>
          <AssetBadge kind="condition" :value="row.new_condition" />
        </div>
        <p v-if="row.note" class="mt-2 text-sm">
          {{ row.note }}
        </p>
        <p v-if="row.recorded_by_name" class="mt-1 text-xs text-muted-foreground">
          {{ t('assets.ui.history.recordedBy') }}: {{ row.recorded_by_name }}
        </p>
      </li>
    </ol>
  </div>
</template>
