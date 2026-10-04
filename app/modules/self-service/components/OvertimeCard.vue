<script setup lang="ts">
import type { SelfOvertime } from '../types'

/**
 * Lembur bulan berjalan.
 *
 *     LEMBUR
 *     Bulan ini      <- meta
 *     4 jam          <- primary
 *
 * Menitnya **dijumlah backend** dengan aturan yang sama dengan sumber
 * payroll — yang `is_paid` dan sudah tercatat/disetujui. Menjumlahkannya
 * di sini dari daftar mentah berarti dashboard bisa menampilkan angka
 * yang berbeda dari slip gajinya, dan yang pertama cuma melatih orang
 * menagih selisih yang tidak ada.
 *
 * Jam-menit dirakit `durationText()` karena itu murni cara menulis
 * angka, bukan aturan bisnis: 90 menit ditulis "1 jam 30 menit", bukan
 * "1,5 jam".
 */
import { Timer } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { durationText } from '../format'
import { CARD_TEXT } from '../ui'
import WorkspaceCard from './WorkspaceCard.vue'

const props = defineProps<{ overtime: SelfOvertime }>()

const { t } = useI18n()

const duration = computed(() => {
  const { key, params } = durationText(props.overtime.total_minutes)

  return t(key, params)
})
</script>

<template>
  <WorkspaceCard
    :title="t('me.cards.overtime.title')"
    :icon="Timer"
    :action="overtime.action"
    :empty="overtime.state !== 'ready'"
    :empty-text="t('me.cards.overtime.empty')"
  >
    <p :class="CARD_TEXT.meta">
      {{ t('me.cards.overtime.thisMonth') }}
    </p>

    <p :class="CARD_TEXT.primary">
      {{ duration }}
    </p>
  </WorkspaceCard>
</template>
