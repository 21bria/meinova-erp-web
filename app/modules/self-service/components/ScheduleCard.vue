<script setup lang="ts">
import type { SelfSchedule } from '../types'

/**
 * Jadwal hari ini — **hasil** mesin roster, bukan perhitungannya.
 *
 * Hierarki: nama shift yang dicari mata pertama, jamnya sebagai angka
 * pendukung, lokasinya sebagai konteks.
 *
 *     JADWAL HARI INI
 *     Office                <- primary
 *     10:00–18:00           <- strong
 *     Jakarta Head Office   <- meta
 *
 * Keadaan rotasi hanya dijadikan badge kalau ia **bukan** hari kerja
 * biasa. "Masuk Kerja" di sebelah shift yang jelas-jelas punya jam cuma
 * mengulang yang sudah terbaca; "Perjalanan Pulang" tidak.
 *
 * Hari tanpa shift tetap dinamai — "Libur" adalah jadwal yang memang
 * begitu, "Belum Dijadwalkan" adalah pekerjaan yang belum dilakukan HR.
 * Kartu yang menyamakan keduanya membuat pegawai site menunggu kabar
 * yang tidak akan datang.
 */
import { CalendarClock } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { useCodeLabel } from '../composables/useCodeLabel'
import { CARD_TEXT } from '../ui'
import WorkspaceCard from './WorkspaceCard.vue'

const props = defineProps<{ schedule: SelfSchedule }>()

const { t } = useI18n()
const codeLabel = useCodeLabel()

const state = computed(() =>
  codeLabel(
    'rosterState',
    props.schedule.rotation_state,
    props.schedule.rotation_state_label,
  ),
)

const ready = computed(() => props.schedule.state === 'ready')

/** Hari kerja biasa tidak perlu diberi tahu bahwa ia hari kerja biasa. */
const showState = computed(() =>
  ready.value && props.schedule.rotation_state !== 'work',
)
</script>

<template>
  <WorkspaceCard
    :title="t('me.cards.schedule.title')"
    :icon="CalendarClock"
    :action="schedule.action"
    :empty="!ready && !state"
    :empty-text="t('me.cards.schedule.empty')"
  >
    <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
      <p :class="CARD_TEXT.primary">
        {{ ready ? (schedule.shift_name || state) : state }}
      </p>

      <Badge v-if="showState" variant="outline">
        {{ state }}
      </Badge>
    </div>

    <p v-if="ready && schedule.time_label" :class="CARD_TEXT.strong">
      {{ schedule.time_label }}
    </p>

    <p v-else-if="!ready" :class="CARD_TEXT.meta">
      {{ t('me.cards.schedule.noShift') }}
    </p>

    <p v-if="ready && schedule.location" :class="CARD_TEXT.meta">
      {{ schedule.location.name }}
    </p>
  </WorkspaceCard>
</template>
