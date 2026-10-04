<script setup lang="ts">
import type { SelfAttendance } from '../types'

/**
 * Kehadiran hari ini.
 *
 *     KEHADIRAN
 *     [Terlambat]           <- status, chip supaya bisa dipindai
 *     08:52 – 17:05         <- strong
 *     Terlambat 7 menit     <- meta
 *
 * Jamnya datang **sudah jadi** dari backend (`"08:52"`), dalam jam
 * dinding kantor. Merakitnya di sini berarti merender timestamp UTC
 * dengan zona perangkat pembacanya — dan pegawai yang laptopnya diset
 * WITA akan melihat jam masuknya sendiri bergeser satu jam tanpa satu
 * pun tanda bahwa yang bergeser cuma tampilannya.
 *
 * Sudah masuk tapi belum pulang **bukan** keadaan kosong: orangnya
 * sedang bekerja. Itu chip tersendiri di sebelah jamnya, bukan em dash.
 */
import { Fingerprint } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { CARD_TEXT } from '../ui'
import AttendanceStatusBadge from './AttendanceStatusBadge.vue'
import WorkspaceCard from './WorkspaceCard.vue'

const props = defineProps<{ attendance: SelfAttendance }>()

const { t } = useI18n()

const ready = computed(() => props.attendance.state === 'ready')

const range = computed(() => {
  const inAt = props.attendance.check_in

  if (!inAt)
    return ''

  const outAt = props.attendance.check_out

  return outAt ? `${inAt} – ${outAt}` : inAt
})
</script>

<template>
  <WorkspaceCard
    :title="t('me.cards.attendance.title')"
    :icon="Fingerprint"
    :action="attendance.action"
    :empty="!ready"
    :empty-text="t('me.cards.attendance.empty')"
  >
    <div class="flex flex-wrap items-center gap-2">
      <AttendanceStatusBadge
        :status="attendance.status"
        :label="attendance.status_label"
      />

      <!--
        Chip kedua hanya saat memang masih berjalan. Menampilkannya
        sesudah orangnya pulang membuat "Belum checkout" jadi kalimat
        yang tidak pernah salah dan karena itu tidak pernah berguna.
      -->
      <Badge v-if="attendance.check_in && !attendance.check_out" variant="outline">
        {{ t('me.cards.attendance.noCheckOut') }}
      </Badge>
    </div>

    <p v-if="range" :class="CARD_TEXT.strong">
      {{ range }}
    </p>

    <p v-if="attendance.late_minutes > 0" :class="CARD_TEXT.meta">
      {{ t('me.cards.attendance.late', { minutes: attendance.late_minutes }) }}
    </p>
  </WorkspaceCard>
</template>
