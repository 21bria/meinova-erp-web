<script setup lang="ts">
import type { MovementKind, MovementSide } from './model'

import { codeLabel } from '@framework'
import { ArrowRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import WorkflowApprovalTrail from '@/modules/workflow/components/WorkflowApprovalTrail.vue'
import { formatDate } from '@/utils/formatDate'

import AssetBadge from './AssetBadge.vue'
import { LIFECYCLE_STATUSES, movementSides, trailRows } from './model'

/**
 * Tab Summary dokumen Assignment / Return / Transfer.
 *
 * Semua dibaca dari record backend: status, asal → tujuan, hasil, dan
 * blok `approval`. **APPROVED ditampilkan sebagai "menunggu serah terima
 * fisik"** — custody belum berpindah sampai Complete sukses, dan layar
 * tidak pernah menampilkan custody tujuan sebelum itu.
 */
const props = defineProps<{
  kind: MovementKind
  record?: Record<string, any> | null
}>()

const { t, te } = useI18n()

const status = computed(() => String(props.record?.status ?? 'DRAFT').toLowerCase())

const statusText = computed(() =>
  status.value === 'approved'
    ? t('assets.ui.lifecycle.approvedBadge')
    : undefined,
)

const hint = computed(() => {
  const key = `assets.ui.lifecycle.hint.${status.value}`

  return (LIFECYCLE_STATUSES as readonly string[]).includes(status.value) && te(key) ? t(key) : ''
})

const sides = computed(() => movementSides(props.kind, props.record))

const approval = computed(() => props.record?.approval ?? null)
const trail = computed(() => trailRows(approval.value))

const assetLink = computed(() =>
  props.record?.asset ? `/assets/register/${props.record.asset}` : null,
)

/** Hasil per jenis dokumen — tanggal + kondisi yang dicatat saat Complete. */
const result = computed(() => {
  const record = props.record ?? {}

  if (props.kind === 'assignments')
    return { date: record.handover_date, condition: record.handover_condition, field: 'handover_condition' }

  if (props.kind === 'returns')
    return { date: record.return_date, condition: record.return_condition, field: 'return_condition' }

  return { date: record.transfer_date, condition: record.transfer_condition, field: 'transfer_condition' }
})

function custodyText(side: MovementSide): string {
  return side.custodyType ? codeLabel('custody_type', side.custodyType, side.custodyType) : '-'
}
</script>

<template>
  <div class="space-y-6" data-testid="asset-movement-summary">
    <section class="space-y-2">
      <div class="flex flex-wrap items-center gap-2">
        <h3 class="text-sm font-semibold">
          {{ t('assets.ui.lifecycle.title') }}
        </h3>
        <AssetBadge
          kind="status"
          :value="props.record?.status"
          :label="statusText"
          data-testid="asset-movement-status"
        />
        <span
          v-if="props.record?.is_cross_company"
          class="text-xs text-amber-700 dark:text-amber-300"
        >
          {{ t(`assets.${props.kind}.fields.is_cross_company`) }}
        </span>
      </div>
      <p
        v-if="hint"
        class="text-sm text-muted-foreground"
        data-testid="asset-movement-hint"
      >
        {{ hint }}
      </p>
    </section>

    <section
      v-if="sides"
      class="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-stretch"
    >
      <div
        v-for="(item, index) in [sides.source, sides.target]"
        :key="index"
        class="rounded-lg border p-4"
        :class="index === 1 ? 'md:order-3' : ''"
      >
        <p class="text-xs font-medium uppercase text-muted-foreground">
          {{ index === 0 ? t('assets.ui.lifecycle.from') : t('assets.ui.lifecycle.to') }}
        </p>
        <div class="mt-2 flex flex-wrap items-center gap-2">
          <AssetBadge kind="custody" :value="item.custodyType" :label="custodyText(item)" />
          <span v-if="item.holder" class="font-medium">{{ item.holder }}</span>
        </div>
        <dl class="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
          <template v-if="item.custodyType === 'ORGANIZATION'">
            <dt class="text-muted-foreground">
              {{ t('assets.ui.custody.pic') }}
            </dt>
            <dd>{{ item.pic || t('assets.ui.custody.noPic') }}</dd>
          </template>
          <dt class="text-muted-foreground">
            {{ t('assets.ui.custody.location') }}
          </dt>
          <dd>{{ item.location || '-' }}</dd>
          <template v-if="item.facility">
            <dt class="text-muted-foreground">
              {{ t('assets.ui.custody.facility') }}
            </dt>
            <dd>{{ item.facility }}</dd>
          </template>
        </dl>
      </div>
      <div class="hidden items-center justify-center text-muted-foreground md:order-2 md:flex">
        <ArrowRight class="size-5" />
      </div>
    </section>

    <section class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
      <NuxtLink
        v-if="assetLink"
        :to="assetLink"
        class="font-medium text-primary hover:underline"
      >
        {{ props.record?.asset_code }} — {{ props.record?.asset_name }}
      </NuxtLink>
      <span v-if="result.date">
        <span class="text-muted-foreground">{{ t('assets.ui.documents.date') }}:</span>
        {{ formatDate(result.date) }}
      </span>
      <AssetBadge
        v-if="result.condition"
        kind="condition"
        :field="result.field"
        :value="result.condition"
      />
    </section>

    <section class="space-y-2">
      <h3
        v-if="trail.length || status !== 'draft'"
        class="text-sm font-semibold"
      >
        {{ t('assets.ui.lifecycle.approval') }}
      </h3>
      <WorkflowApprovalTrail
        v-if="trail.length"
        :rows="trail"
        :current-step="approval?.current_step?.name ?? null"
      />
      <p
        v-else-if="status !== 'draft'"
        class="text-sm text-muted-foreground"
      >
        {{ t('assets.ui.lifecycle.noWorkflow') }}
      </p>
    </section>
  </div>
</template>
