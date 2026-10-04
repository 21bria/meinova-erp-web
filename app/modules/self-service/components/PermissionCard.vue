<script setup lang="ts">
import type { SelfPermission } from '../types'

/**
 * Izin kehadiran — pengajuan terakhir dan berapa yang masih menunggu.
 *
 *     IZIN
 *     [Disetujui]            <- status
 *     Datang Terlambat       <- strong
 *     1 menunggu keputusan   <- meta
 *
 * Statusnya memakai `WorkflowStatusBadge`, **bukan peta warna sendiri**.
 * Izin adalah dokumen beralur, dan "Disetujui" harus berwarna sama di
 * kotak masuk Workflow dan di dashboard ini — dua peta warna untuk satu
 * status adalah keluhan pertama orang yang membandingkan dua layar.
 *
 * Alasan izinnya **tidak** ikut, dan itu bukan kelalaian: "Antar istri
 * ke rumah sakit" adalah kalimat yang ditulis untuk atasannya, bukan
 * untuk dipajang di halaman depan yang kebetulan terbuka di ruang rapat.
 */
import { ClipboardCheck } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import WorkflowStatusBadge from '~/modules/workflow/components/WorkflowStatusBadge.vue'
import { useCodeLabel } from '../composables/useCodeLabel'
import { CARD_TEXT } from '../ui'
import WorkspaceCard from './WorkspaceCard.vue'

const props = defineProps<{ permission: SelfPermission }>()

const { t } = useI18n()
const codeLabel = useCodeLabel()

const kind = computed(() =>
  codeLabel(
    'permissionType',
    props.permission.latest?.permission_type,
    props.permission.latest?.permission_type_label ?? '',
  ),
)
</script>

<template>
  <WorkspaceCard
    :title="t('me.cards.permission.title')"
    :icon="ClipboardCheck"
    :action="permission.action"
    :empty="permission.state !== 'ready'"
    :empty-text="t('me.cards.permission.empty')"
  >
    <p :class="CARD_TEXT.meta">
      {{ t('me.cards.permission.latest') }}
    </p>

    <WorkflowStatusBadge
      :status="permission.latest?.status"
      :label="permission.latest?.status_label"
    />

    <p v-if="kind" :class="CARD_TEXT.strong">
      {{ kind }}
    </p>

    <p v-if="permission.pending_count > 0" :class="CARD_TEXT.meta">
      {{ t('me.cards.permission.pending', { count: permission.pending_count }) }}
    </p>
  </WorkspaceCard>
</template>
