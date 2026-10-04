<script setup lang="ts">
import type { LeaveRuleFinding, LeaveRulePayload } from '../composables/useLeaveRules'
/**
 * Panel aturan cuti — saldo, temuan, dan riwayat.
 *
 * **Tidak ada satu aturan pun di berkas ini.** Yang dirender adalah
 * `policy_rules` apa adanya: kalimatnya milik backend, tingkatnya
 * (`block`/`review`/`warning`) milik backend, dan angka salinya milik
 * backend. Menambahkan satu saja pemeriksaan di sini berarti ada dua
 * penilai untuk satu aturan — dan yang kedua akan diam-diam berbeda,
 * paling sering ke arah yang merugikan: layar bilang boleh, server
 * menolak saat Simpan.
 *
 * Tinggal di luar folder modul hasil generate, jadi
 * `pnpm meinova generate hr/leave` tidak menimpanya.
 */
import { AlertTriangle, CircleAlert, History, Info, Wallet } from 'lucide-vue-next'

import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    rules?: LeaveRulePayload | null
    /** Hari kerja hasil hitungan backend, bukan selisih tanggal. */
    totalDays?: string | null
    loading?: boolean
  }>(),
  {
    rules: null,
    totalDays: null,
    loading: false,
  },
)

const balance = computed(() => {
  if (!props.rules?.balance_evaluated)
    return null

  return props.rules?.balance ?? null
})

const findings = computed<LeaveRuleFinding[]>(() => {
  return props.rules?.findings ?? []
})

const blocking = computed(() => {
  return findings.value.filter(row => row.level === 'block')
})

const advisory = computed(() => {
  return findings.value.filter(row => row.level !== 'block')
})

const history = computed(() => {
  if (!props.rules?.history_evaluated)
    return []

  return props.rules?.history ?? []
})

/*
 * Panel hanya muncul kalau memang ada yang perlu disampaikan. Kotak
 * kosong berjudul "Leave Policy" di bawah setiap form cuti cuma
 * mengajari orang berhenti melihat ke sana — dan pada hari yang
 * benar-benar ada isinya, mereka sudah tidak melihat.
 */
const hasContent = computed(() => {
  return Boolean(
    balance.value
    || findings.value.length
    || history.value.length,
  )
})

/** Label tingkat temuan = tingkat dari backend, bukan tafsir ulang. */
function levelLabel(level: string) {
  if (level === 'block')
    return 'ERROR'

  if (level === 'review')
    return 'REVIEW REQUIRED'

  return 'WARNING'
}

function formatDate(value: string | null) {
  if (!value)
    return '—'

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime()))
    return value

  return parsed.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
</script>

<template>
  <Card
    v-if="loading || hasContent"
    data-testid="leave-policy-rules"
  >
    <CardHeader class="pb-3">
      <CardTitle class="flex items-center gap-2 text-sm">
        <Info class="size-4" />
        Leave Policy

        <Badge
          v-if="rules?.policy_code"
          variant="outline"
          class="font-mono text-[10px]"
        >
          {{ rules.policy_code }}
        </Badge>

        <Badge
          v-if="rules?.needs_review"
          variant="secondary"
          class="ml-auto"
        >
          Review Required
        </Badge>
      </CardTitle>
    </CardHeader>

    <CardContent class="space-y-3 pt-0">
      <div
        v-if="loading"
        class="space-y-2"
      >
        <Skeleton class="h-5 w-2/3" />
        <Skeleton class="h-5 w-full" />
      </div>

      <template v-else>
        <!--
        | Saldo. Hanya untuk jenis cuti bersaldo — `balance_evaluated`
        | dari backend yang menentukan, bukan tebakan di sini. Cuti
        | menikah dan duka memang tidak punya kartu, dan menampilkan
        | "Available Balance 0" untuknya terbaca seperti jatah yang
        | sudah habis.
        -->
        <div
          v-if="balance"
          data-testid="leave-balance-box"
          class="rounded-md border p-3 text-sm"
          :class="balance.sufficient ? '' : 'border-destructive/50'"
        >
          <div class="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Wallet class="size-3.5" />
            {{ rules?.policy_name ?? 'Leave Balance' }}
            <span v-if="balance.year">· {{ balance.year }}</span>
          </div>

          <dl class="grid grid-cols-2 gap-1">
            <dt class="text-muted-foreground">
              Available Balance
            </dt>

            <dd
              data-testid="leave-balance-available"
              class="text-right font-medium tabular-nums"
            >
              {{ balance.available }}
            </dd>

            <dt class="text-muted-foreground">
              Requested
            </dt>

            <dd
              data-testid="leave-balance-requested"
              class="text-right font-medium tabular-nums"
              :class="balance.sufficient ? '' : 'text-destructive'"
            >
              {{ balance.requested }}
            </dd>
          </dl>

          <p
            v-if="!balance.exists && balance.eligible_date"
            class="mt-2 text-xs text-muted-foreground"
          >
            Mulai berhak {{ formatDate(balance.eligible_date) }}.
          </p>
        </div>

        <!--
        | Hari kerja hasil hitungan backend. Ditampilkan terpisah untuk
        | jenis cuti tanpa saldo, karena di sana tidak ada kotak saldo
        | yang memuatnya — dan "berapa hari yang dipotong" tetap
        | pertanyaan pertama orang yang mengisinya.
        -->
        <p
          v-else-if="totalDays"
          class="text-xs text-muted-foreground"
        >
          Working days: <span class="font-medium tabular-nums">{{ totalDays }}</span>
        </p>

        <!-- Yang menolak. -->
        <Alert
          v-for="(row, index) in blocking"
          :key="`block-${row.code}-${index}`"
          variant="destructive"
          data-testid="leave-rule-block"
        >
          <CircleAlert class="size-4" />

          <AlertTitle class="text-xs font-semibold tracking-wide">
            {{ levelLabel(row.level) }}
          </AlertTitle>

          <AlertDescription class="text-sm">
            {{ row.message }}
          </AlertDescription>
        </Alert>

        <!-- Yang menandai, tapi tidak menahan. -->
        <Alert
          v-for="(row, index) in advisory"
          :key="`warn-${row.code}-${index}`"
          data-testid="leave-rule-warning"
        >
          <AlertTriangle class="size-4" />

          <AlertTitle class="text-xs font-semibold tracking-wide">
            {{ levelLabel(row.level) }}
          </AlertTitle>

          <AlertDescription class="text-sm">
            {{ row.message }}
          </AlertDescription>
        </Alert>

        <!--
        | Riwayat pemakaian. Yang membaca peringatan butuh melihat
        | kejadian sebelumnya — "pernah dipakai" tanpa menyebut kapan
        | dan berapa hari tidak bisa ditindaklanjuti siapa pun.
        -->
        <div
          v-if="history.length"
          data-testid="leave-rule-history"
          class="rounded-md border p-3"
        >
          <p class="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <History class="size-3.5" />
            Previous ({{ rules?.history_total ?? history.length }})
          </p>

          <ul class="space-y-1.5">
            <li
              v-for="row in history"
              :key="row.id"
              class="flex items-center justify-between gap-3 text-xs"
            >
              <span class="min-w-0 flex-1 truncate">
                {{ formatDate(row.event_date) }}
                <span
                  v-if="row.document_number"
                  class="text-muted-foreground"
                >
                  · {{ row.document_number }}
                </span>
              </span>

              <span class="tabular-nums text-muted-foreground">
                {{ row.days ?? '—' }} hari
              </span>

              <Badge
                variant="outline"
                class="text-[10px]"
              >
                {{ row.status_label }}
              </Badge>
            </li>
          </ul>
        </div>
      </template>
    </CardContent>
  </Card>
</template>
