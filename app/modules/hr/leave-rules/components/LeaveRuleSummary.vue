<script setup lang="ts">
/**
 * Ringkasan peringatan aturan di meja approver.
 *
 * Sumbernya `WorkflowInstance.context` — cuplikan yang **dibekukan saat
 * pengajuan**, bukan penilaian ulang hari ini. Itu disengaja: yang
 * dibaca approver harus tetap kalimat yang dilihat pengajunya saat
 * menekan Submit, walau aturannya disunting sesudah itu.
 *
 * Tanpa komponen ini, peringatan yang sudah susah payah dibekukan
 * modul Cuti tidak pernah sampai ke meja yang harus membacanya —
 * approver memutuskan tanpa tahu dokumen itu ditandai perlu diperiksa,
 * dan tidak ada satu pun tanda di layarnya.
 *
 * Toleran terhadap dokumen yang konteksnya tidak memuat kunci ini
 * (mis. modul yang belum membekukan apa pun): tidak merender apa-apa,
 * bukan kotak kosong.
 */
import { AlertTriangle } from 'lucide-vue-next'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    context?: Record<string, any> | null
    /** Ringkas — dipakai di baris kotak masuk yang sudah padat. */
    compact?: boolean
  }>(),
  {
    context: null,
    compact: false,
  },
)

const messages = computed<string[]>(() => {
  const raw = props.context?.rule_messages

  return Array.isArray(raw)
    ? raw.filter(row => typeof row === 'string' && row.trim())
    : []
})

const needsReview = computed(() => {
  return props.context?.needs_review === true
})

const historyTotal = computed<number>(() => {
  const raw = Number(props.context?.history_total ?? 0)

  return Number.isFinite(raw) ? raw : 0
})

const policyCode = computed<string | null>(() => {
  return props.context?.policy_code ?? null
})

const visible = computed(() => {
  return needsReview.value || messages.value.length > 0
})
</script>

<template>
  <div
    v-if="visible"
    data-testid="leave-rule-summary"
  >
    <Alert :class="compact ? 'py-2' : ''">
      <AlertTriangle class="size-4" />

      <AlertTitle class="flex items-center gap-2 text-xs font-semibold tracking-wide">
        {{ needsReview ? 'REVIEW REQUIRED' : 'WARNING' }}

        <Badge
          v-if="policyCode"
          variant="outline"
          class="font-mono text-[10px]"
        >
          {{ policyCode }}
        </Badge>

        <Badge
          v-if="historyTotal > 0"
          variant="secondary"
          class="text-[10px]"
        >
          {{ historyTotal }}x sebelumnya
        </Badge>
      </AlertTitle>

      <AlertDescription>
        <ul class="space-y-1 text-sm">
          <li
            v-for="(message, index) in messages"
            :key="index"
          >
            {{ message }}
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  </div>
</template>
