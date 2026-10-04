<script setup lang="ts">
import type { CustodyRow } from '../../shared/model'

import { useI18n } from 'vue-i18n'

import { formatDate } from '@/utils/formatDate'

import AssetBadge from '../../shared/AssetBadge.vue'
import AssetCustodyCard from './AssetCustodyCard.vue'

/**
 * Tab Overview aset: identitas, perolehan non-moneter, dan penguasaan
 * saat ini. Tanpa nilai buku — itu milik Fixed Asset (tahap FA).
 */
const props = defineProps<{
  record?: Record<string, any> | null
}>()

const { t } = useI18n()

const custody = computed(() => (props.record?.current_custody_detail ?? null) as CustodyRow | null)

const identity = computed(() => {
  const record = props.record ?? {}

  return [
    ['assets.register.fields.asset_code', record.asset_code],
    ['assets.register.fields.name', record.name],
    ['assets.register.fields.category', record.category_name],
    ['assets.register.fields.company', record.company_name],
    ['assets.register.fields.manufacturer', record.manufacturer],
    ['assets.register.fields.model', record.model],
    ['assets.register.fields.serial_number', record.serial_number],
    ['assets.register.fields.tag_number', record.tag_number],
  ] as const
})

const acquisition = computed(() => {
  const record = props.record ?? {}

  return [
    ['assets.register.fields.acquisition_date', formatDate(record.acquisition_date)],
    ['assets.register.fields.acquisition_reference', record.acquisition_reference],
    ['assets.register.fields.supplier_name', record.supplier_name],
    ['assets.register.fields.warranty_until', formatDate(record.warranty_until)],
  ] as const
})
</script>

<template>
  <div class="space-y-4" data-testid="asset-overview">
    <div class="flex flex-wrap items-center gap-2">
      <AssetBadge kind="status" :value="props.record?.status" />
      <AssetBadge kind="condition" :value="props.record?.condition" />
    </div>

    <AssetCustodyCard :custody="custody" />

    <div class="grid gap-4 lg:grid-cols-2">
      <section class="rounded-lg border p-4">
        <h3 class="text-sm font-semibold">
          {{ t('assets.ui.overview.identity') }}
        </h3>
        <dl class="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div v-for="[key, value] in identity" :key="key">
            <dt class="text-muted-foreground">
              {{ t(key) }}
            </dt>
            <dd class="break-words">
              {{ value || '-' }}
            </dd>
          </div>
        </dl>
      </section>

      <section class="rounded-lg border p-4">
        <h3 class="text-sm font-semibold">
          {{ t('assets.ui.overview.acquisition') }}
        </h3>
        <dl class="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div v-for="[key, value] in acquisition" :key="key">
            <dt class="text-muted-foreground">
              {{ t(key) }}
            </dt>
            <dd class="break-words">
              {{ value || '-' }}
            </dd>
          </div>
        </dl>
        <p class="mt-3 text-xs text-muted-foreground">
          {{ t('assets.ui.overview.noValue') }}
        </p>
      </section>
    </div>
  </div>
</template>
