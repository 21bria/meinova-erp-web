<script setup lang="ts">
import type { CustodyRow } from '../../shared/model'

import { useI18n } from 'vue-i18n'

import { formatDate } from '@/utils/formatDate'

import AssetBadge from '../../shared/AssetBadge.vue'

/**
 * Kartu "Penguasaan Saat Ini" — dari `current_custody_detail` backend
 * (baris `AssetCustody` yang terbuka), **bukan** disimpulkan dari status
 * aset. Tidak ada tombol ubah: custody hanya berpindah lewat dokumen.
 */
const props = defineProps<{
  custody?: CustodyRow | null
}>()

const { t } = useI18n()
</script>

<template>
  <div class="rounded-lg border p-4" data-testid="asset-current-custody">
    <div class="flex flex-wrap items-center gap-2">
      <h3 class="text-sm font-semibold">
        {{ t('assets.ui.custody.title') }}
      </h3>
      <AssetBadge
        v-if="props.custody"
        kind="custody"
        :value="props.custody.custody_type"
        :label="props.custody.custody_type_label"
      />
    </div>

    <p v-if="!props.custody" class="mt-2 text-sm text-muted-foreground">
      {{ t('assets.ui.custody.none') }}
    </p>

    <dl
      v-else
      class="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2"
    >
      <template v-if="props.custody.custody_type === 'EMPLOYEE'">
        <div>
          <dt class="text-muted-foreground">
            {{ t('assets.ui.custody.employee') }}
          </dt>
          <dd class="font-medium">
            {{ props.custody.employee_name || '-' }}
          </dd>
        </div>
      </template>
      <template v-else-if="props.custody.custody_type === 'ORGANIZATION'">
        <div>
          <dt class="text-muted-foreground">
            {{ t('assets.ui.custody.department') }}
          </dt>
          <dd class="font-medium">
            {{ props.custody.department_name || '-' }}
          </dd>
        </div>
        <div>
          <dt class="text-muted-foreground">
            {{ t('assets.ui.custody.pic') }}
          </dt>
          <dd>{{ props.custody.pic_employee_name || t('assets.ui.custody.noPic') }}</dd>
        </div>
      </template>
      <div v-else class="sm:col-span-2 text-muted-foreground">
        {{ t('assets.ui.custody.storage') }}
      </div>

      <div>
        <dt class="text-muted-foreground">
          {{ t('assets.ui.custody.location') }}
        </dt>
        <dd>{{ props.custody.location_name || '-' }}</dd>
      </div>
      <div>
        <dt class="text-muted-foreground">
          {{ t('assets.ui.custody.facility') }}
        </dt>
        <dd>{{ props.custody.facility_name || '-' }}</dd>
      </div>
      <div>
        <dt class="text-muted-foreground">
          {{ t('assets.ui.custody.since') }}
        </dt>
        <dd>{{ formatDate(props.custody.started_on) }}</dd>
      </div>
      <div>
        <dt class="text-muted-foreground">
          {{ t('assets.ui.custody.openedBy') }}
        </dt>
        <dd>
          <NuxtLink
            v-if="props.custody.opened_by?.route"
            :to="props.custody.opened_by.route"
            class="text-primary hover:underline"
          >
            {{ props.custody.opened_by.document_number }}
          </NuxtLink>
          <span v-else>{{ props.custody.opened_by?.type_label ?? '-' }}</span>
        </dd>
      </div>
    </dl>
  </div>
</template>
