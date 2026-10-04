<script setup lang="ts">
import type { BusinessTripRecord } from './model'

import { statusLabel } from '@framework'
import { Ban, Check, Circle, CircleDot, Link2, XCircle } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { formatDateTime } from '@/utils/formatDate'
import WorkflowApprovalTrail from '@/modules/workflow/components/WorkflowApprovalTrail.vue'

import {
  lifecycleSteps,
  relationships,
  statusTone,
  terminalState,
  timeline,
  trailRows,
} from './model'

/**
 * Tab Approval / History — posisi dokumen di siklus hidupnya.
 *
 * Semua yang tampil dibaca dari record yang dikirim backend: status,
 * jejak waktu, waktu berangkat/kembali aktual, alasan pembatalan,
 * hubungan pengganti/perpanjangan, dan blok `approval`. Tidak ada
 * transisi yang dihitung di sini; tombolnya ada di header (schema
 * actions) dan service yang memutuskan.
 */
const props = defineProps<{ record?: Record<string, any> | null }>()

// Baris hasil generate (`BusinessTripsRow`) dibaca sebagai record dokumen.
const trip = computed(() => (props.record ?? null) as BusinessTripRecord | null)

const { t } = useI18n()

const status = computed(() => String(props.record?.status ?? 'draft'))

const steps = computed(() => lifecycleSteps(trip.value))
const terminal = computed(() => terminalState(trip.value))
const events = computed(() => timeline(trip.value))
const links = computed(() => relationships(trip.value))

const approval = computed(() => props.record?.approval ?? null)
const rows = computed(() => trailRows(approval.value))

const statusText = computed(() =>
  statusLabel(status.value, props.record?.status_label ?? status.value),
)

/*
| Pulang lebih lambat dari rencana bukan "Complete" yang diundur — itu
| perpanjangan, dokumennya sendiri (aturan service). Kalimat ini cuma
| memberi tahu sebelum tombolnya ditekan; penolakannya tetap dari
| backend.
*/
const showExtensionHint = computed(() =>
  status.value === 'approved' || status.value === 'on_trip',
)
</script>

<template>
  <div class="space-y-6" data-testid="business-trip-approval">
    <!-- Siklus hidup -->
    <section class="space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <h3 class="text-sm font-semibold">
          {{ t('hr.business-trips.lifecycle.title') }}
        </h3>
        <Badge
          variant="outline"
          :class="statusTone(status)"
          data-testid="business-trip-status"
        >
          {{ statusText }}
        </Badge>
      </div>

      <ol class="flex flex-wrap items-center gap-2" data-testid="business-trip-lifecycle">
        <li
          v-for="(step, index) in steps"
          :key="step.key"
          class="flex items-center gap-2 text-sm"
          :data-state="step.state"
        >
          <Check
            v-if="step.state === 'done'"
            class="size-4 text-emerald-600"
          />
          <CircleDot
            v-else-if="step.state === 'current'"
            class="size-4 text-primary"
          />
          <Circle
            v-else
            class="size-4 text-muted-foreground"
          />
          <span
            :class="step.state === 'upcoming' ? 'text-muted-foreground' : 'font-medium'"
          >
            {{ statusLabel(step.key) }}
          </span>
          <span
            v-if="index < steps.length - 1"
            class="text-muted-foreground"
            aria-hidden="true"
          >→</span>
        </li>

        <li
          v-if="terminal"
          class="flex items-center gap-2 text-sm font-medium"
          :class="terminal === 'rejected' ? 'text-destructive' : 'text-muted-foreground'"
          :data-terminal="terminal"
        >
          <XCircle v-if="terminal === 'rejected'" class="size-4" />
          <Ban v-else class="size-4" />
          {{ statusLabel(terminal) }}
        </li>
      </ol>

      <p
        v-if="showExtensionHint"
        class="text-xs text-muted-foreground"
      >
        {{ t('hr.business-trips.lifecycle.extensionHint') }}
      </p>
    </section>

    <!-- Rencana vs aktual -->
    <section class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-1">
        <p class="text-xs font-medium text-muted-foreground uppercase">
          {{ t('hr.business-trips.fields.departure_datetime') }}
        </p>
        <p class="text-sm">
          {{ formatDateTime(record?.departure_datetime) }}
        </p>
        <p
          v-if="record?.actual_departure_datetime"
          class="text-xs text-muted-foreground"
        >
          {{ t('hr.business-trips.fields.actual_departure_datetime') }}:
          {{ formatDateTime(record.actual_departure_datetime) }}
        </p>
      </div>

      <div class="space-y-1">
        <p class="text-xs font-medium text-muted-foreground uppercase">
          {{ t('hr.business-trips.fields.return_datetime') }}
        </p>
        <p class="text-sm">
          {{ formatDateTime(record?.return_datetime) }}
        </p>
        <p
          v-if="record?.actual_return_datetime"
          class="text-xs text-muted-foreground"
        >
          {{ t('hr.business-trips.fields.actual_return_datetime') }}:
          {{ formatDateTime(record.actual_return_datetime) }}
        </p>
      </div>
    </section>

    <!-- Pembatalan -->
    <Alert
      v-if="status === 'cancelled'"
      variant="destructive"
      data-testid="business-trip-cancellation"
    >
      <AlertTitle>{{ t('hr.business-trips.cancellation.title') }}</AlertTitle>
      <AlertDescription class="space-y-1">
        <p>{{ record?.cancellation_reason || '—' }}</p>
        <p class="text-xs">
          {{ formatDateTime(record?.cancelled_at) }}
        </p>
      </AlertDescription>
    </Alert>

    <!-- Pengganti / perpanjangan -->
    <section
      v-if="links.supersedes || links.supersededBy.length"
      class="space-y-2"
      data-testid="business-trip-links"
    >
      <h3 class="text-sm font-semibold">
        {{ t('hr.business-trips.links.title') }}
      </h3>

      <p v-if="links.supersedes" class="flex items-center gap-2 text-sm">
        <Link2 class="size-4 text-muted-foreground" />
        <span>{{ t(`hr.business-trips.links.supersedes.${links.supersedes.type ?? 'replacement'}`) }}</span>
        <NuxtLink
          :to="`/hr/business-trips/${links.supersedes.id}`"
          class="font-medium underline-offset-4 hover:underline"
        >
          {{ links.supersedes.number }}
        </NuxtLink>
      </p>

      <p
        v-for="link in links.supersededBy"
        :key="link.id"
        class="flex items-center gap-2 text-sm"
      >
        <Link2 class="size-4 text-muted-foreground" />
        <span>{{ t(`hr.business-trips.links.supersededBy.${link.type ?? 'replacement'}`) }}</span>
        <NuxtLink
          :to="`/hr/business-trips/${link.id}`"
          class="font-medium underline-offset-4 hover:underline"
        >
          {{ link.number }}
        </NuxtLink>
        <span v-if="link.status" class="text-muted-foreground">
          ({{ statusLabel(link.status) }})
        </span>
      </p>
    </section>

    <!-- Persetujuan -->
    <section class="space-y-3">
      <h3 class="text-sm font-semibold">
        {{ t('hr.business-trips.approval.title') }}
      </h3>

      <p
        v-if="!approval"
        class="text-sm text-muted-foreground"
        data-testid="business-trip-approval-empty"
      >
        {{ t('hr.business-trips.approval.notSubmitted') }}
      </p>

      <template v-else>
        <p class="text-sm text-muted-foreground">
          {{ approval.flow }}
          <template v-if="approval.current_step">
            · {{ t('hr.business-trips.approval.waitingFor', { step: approval.current_step.name, approver: approval.current_step.approver ?? '—' }) }}
          </template>
        </p>

        <WorkflowApprovalTrail
          :rows="rows"
          :current-step="approval.current_step?.name ?? null"
        />
      </template>
    </section>

    <!-- Jejak waktu -->
    <section v-if="events.length" class="space-y-2">
      <h3 class="text-sm font-semibold">
        {{ t('hr.business-trips.timeline.title') }}
      </h3>

      <ul class="space-y-1 text-sm" data-testid="business-trip-timeline">
        <li
          v-for="event in events"
          :key="event.key"
          class="flex flex-wrap gap-x-2"
        >
          <span class="text-muted-foreground">{{ t(`hr.business-trips.fields.${event.key}`) }}</span>
          <span>{{ formatDateTime(event.at) }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
