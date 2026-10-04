<script setup lang="ts">
import type { SelfLeave } from '../types'

/**
 * Saldo cuti tahun berjalan — **pola acuan** hierarki kartu:
 *
 *     CUTI
 *     Cuti Tahunan   <- meta (nama jenisnya)
 *     Sisa 9 hari    <- primary (angka yang dicari)
 *     Ajukan Cuti →
 *
 * `remaining` adalah **properti model** `LeaveBalance` di backend —
 * jatah, bawaan tahun lalu, saldo awal migrasi, dan yang sudah hangus
 * punya kantongnya masing-masing, dan tidak satu pun dijumlah ulang di
 * sini. Angka yang dihitung dua kali adalah angka yang suatu saat akan
 * berbeda antara dashboard dan kartu cuti, dan yang bertanya "sebenarnya
 * sisa saya berapa" tidak punya tempat bertanya.
 *
 * Dua jenis teratas saja supaya kartunya tetap sepadan dengan
 * tetangganya; rinciannya di layar Leave Balance.
 */
import { CalendarOff } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { CARD_TEXT } from '../ui'
import WorkspaceCard from './WorkspaceCard.vue'

const props = defineProps<{ leave: SelfLeave }>()

const { t } = useI18n()

const shown = computed(() => props.leave.balances.slice(0, 2))
</script>

<template>
  <WorkspaceCard
    :title="t('me.cards.leave.title')"
    :icon="CalendarOff"
    :action="leave.action"
    :empty="leave.state !== 'ready'"
    :empty-text="t('me.cards.leave.empty')"
  >
    <div
      v-for="balance in shown"
      :key="balance.leave_type?.id ?? balance.year"
      class="space-y-0.5"
    >
      <p :class="CARD_TEXT.meta">
        {{ balance.leave_type?.name }}
      </p>

      <p :class="CARD_TEXT.primary">
        {{ t('me.cards.leave.days', { days: balance.remaining }) }}
      </p>
    </div>
  </WorkspaceCard>
</template>
