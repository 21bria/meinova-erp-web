<script setup lang="ts">
import type { GeoFailure, GeoReading, PunchAvailability, PunchResult } from '../attendance/punch'

/**
 * Tap kehadiran dari Self Service (ATT-GPS-1), dipakai halaman
 * **Absen Masuk** (`/me/attendance/punch`, ATT-UX-1).
 *
 *     1. Lokasi  → `getCurrentPosition` (akurasi tinggi, tanpa cache)
 *     2. Selfie  → `<input type=file capture=user>`, unggah `attendance_selfie`
 *     3. Kirim   → `POST /api/me/attendance/punch/` → hasil di bawah formulir
 *
 * Kalau backend menjawab tap **tidak tersedia** untuk akun ini (bawaan
 * produksi, selama wajah/liveness belum ada), formulirnya tidak dirender
 * — yang tampil hanya keterangan singkat, supaya alamat yang dibuka
 * langsung tidak berakhir di halaman kosong.
 *
 * Browser tidak menilai apa pun. Di dalam/di luar area kerja, akurasi
 * cukup atau tidak, dan apakah tap menjadi kehadiran dijawab backend;
 * peringatan akurasi di sini hanya petunjuk sebelum mengirim.
 *
 * `client_punch_id` dibuat sekali per percobaan dan dipakai ulang kalau
 * pengiriman gagal di jaringan, bersama selfie yang sama — backend
 * menjawab ulang hasil yang sudah tersimpan, bukan mencatat tap kedua.
 */
import { Camera, Info, Loader2, MapPin, ShieldAlert } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { Button } from '@/components/ui/button'
import { useApi } from '@/composables/useApi'

import {
  fetchPunchAvailability,
  submitPunch,
  uploadSelfie,
} from '../api/client'
import { acquirePosition, GeoError, isLowAccuracy, resultTone } from '../attendance/punch'

const { t } = useI18n()
const { request } = useApi()

const availability = ref<PunchAvailability | null>(null)
// Ketersediaan sudah dijawab (berhasil atau gagal) — sebelum itu tidak
// ada yang dirender, supaya keterangan "tidak diaktifkan" tidak berkedip.
const loaded = ref(false)

const reading = ref<GeoReading | null>(null)
const geoError = ref<GeoFailure | null>(null)
const locating = ref(false)

const selfie = ref<File | null>(null)
const selfieId = ref<number | null>(null)
const selfieInput = ref<HTMLInputElement | null>(null)

const punchId = ref<string | null>(null)
const sending = ref(false)
const sendError = ref<'upload' | 'submit' | null>(null)
const result = ref<PunchResult | null>(null)

const trial = computed(() => availability.value?.trial === true)
const limit = computed(() => availability.value?.max_gps_accuracy_m ?? null)
const lowAccuracy = computed(() => isLowAccuracy(reading.value, limit.value))
const canSend = computed(() => !!reading.value && !!selfie.value && !sending.value)
const tone = computed(() => (result.value ? resultTone(result.value) : null))

const TONE_CLASS = {
  success: 'border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-50',
  warning: 'border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-50',
  error: 'border-red-300 bg-red-50 text-red-950 dark:border-red-800 dark:bg-red-950 dark:text-red-50',
} as const

function newAttempt() {
  punchId.value = null
  result.value = null
  sendError.value = null
}

async function locate() {
  newAttempt()
  locating.value = true
  geoError.value = null

  try {
    reading.value = await acquirePosition({
      isSecureContext: window.isSecureContext,
      geolocation: navigator.geolocation,
    })
  }
  catch (error) {
    reading.value = null
    geoError.value = error instanceof GeoError ? error.code : 'position_unavailable'
  }
  finally {
    locating.value = false
  }
}

function pickSelfie(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null

  newAttempt()
  selfie.value = file
  selfieId.value = null

  // Pilihan berkas yang sama dua kali tetap memicu `change`.
  input.value = ''
}

async function send(punchType: 'in' | 'out') {
  if (!reading.value || !selfie.value)
    return

  sending.value = true
  sendError.value = null

  // `useApi().request` menerima method + body; tipenya lebih longgar dari
  // `Sender`, jadi cukup diteruskan.
  const sender = request as unknown as Parameters<typeof submitPunch>[0]

  try {
    if (selfieId.value === null) {
      try {
        selfieId.value = await uploadSelfie(sender, selfie.value)
      }
      catch {
        sendError.value = 'upload'
        return
      }
    }

    punchId.value ??= crypto.randomUUID()

    result.value = await submitPunch(sender, {
      clientPunchId: punchId.value,
      punchType,
      reading: reading.value,
      selfieId: selfieId.value,
    })
  }
  catch {
    sendError.value = 'submit'
  }
  finally {
    sending.value = false
  }
}

function valueLabel(code: string | null | undefined): string {
  if (!code)
    return '—'

  const key = `me.punch.values.${code}`
  const text = t(key)

  return text === key ? code : text
}

onMounted(async () => {
  try {
    availability.value = await fetchPunchAvailability(request)
  }
  catch {
    availability.value = null
  }
  finally {
    loaded.value = true
  }
})
</script>

<template>
  <p
    v-if="loaded && !availability?.available"
    class="flex gap-2 rounded-xl border bg-card p-4 text-sm text-muted-foreground"
    data-testid="punch-unavailable"
  >
    <Info class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
    <span>{{ t('me.punch.notEnabled') }}</span>
  </p>

  <section
    v-else-if="availability?.available"
    class="space-y-4 rounded-xl border bg-card p-4 shadow-sm sm:p-5"
    data-testid="punch-form"
  >
    <p
      v-if="trial"
      class="flex gap-2 rounded-md border border-amber-300 bg-amber-50 px-2 py-1.5 text-xs text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100"
      data-testid="punch-trial-notice"
    >
      <ShieldAlert class="mt-px size-3.5 shrink-0" aria-hidden="true" />
      <span>{{ t('me.punch.trialNotice') }}</span>
    </p>

    <!-- 1. Lokasi -->
    <div class="space-y-2">
      <p class="text-sm font-medium">
        {{ t('me.punch.step.location') }}
      </p>

      <Button variant="outline" :disabled="locating || sending" @click="locate">
        <Loader2 v-if="locating" class="size-4 animate-spin" />
        <MapPin v-else class="size-4" />
        {{ locating ? t('me.punch.locating') : reading ? t('me.punch.refreshLocation') : t('me.punch.getLocation') }}
      </Button>

      <p v-if="reading" class="text-sm">
        <span class="font-medium text-emerald-700 dark:text-emerald-400">{{ t('me.punch.acquired') }}</span>
        · {{ t('me.punch.accuracy', { value: Math.round(reading.accuracy) }) }}
      </p>

      <p v-else-if="!geoError" class="text-sm text-muted-foreground">
        {{ t('me.punch.notAcquired') }}
      </p>

      <p v-if="geoError" class="text-sm text-destructive" role="alert">
        {{ t(`me.punch.errors.${geoError}`) }}
      </p>

      <p v-if="lowAccuracy" class="text-sm text-amber-700 dark:text-amber-400" role="alert">
        {{ t('me.punch.lowAccuracy', { limit }) }}
      </p>
    </div>

    <!-- 2. Selfie -->
    <div class="space-y-2">
      <p class="text-sm font-medium">
        {{ t('me.punch.step.selfie') }}
      </p>

      <p class="text-sm text-muted-foreground">
        {{ t('me.punch.selfieHint') }}
      </p>

      <input
        ref="selfieInput"
        type="file"
        accept="image/*"
        capture="user"
        class="hidden"
        @change="pickSelfie"
      >

      <Button variant="outline" :disabled="sending" @click="selfieInput?.click()">
        <Camera class="size-4" />
        {{ selfie ? t('me.punch.selfieRetake') : t('me.punch.selfieTake') }}
      </Button>

      <p v-if="selfie" class="text-sm text-emerald-700 dark:text-emerald-400">
        {{ t('me.punch.selfieReady') }}
      </p>
    </div>

    <!-- 3. Kirim -->
    <div class="space-y-2">
      <p class="text-sm font-medium">
        {{ t('me.punch.step.submit') }}
      </p>

      <div class="flex flex-wrap gap-2">
        <Button :disabled="!canSend" @click="send('in')">
          <Loader2 v-if="sending" class="size-4 animate-spin" />
          {{ sending ? t('me.punch.sending') : t('me.punch.checkIn') }}
        </Button>

        <!--
          Uji coba tidak pernah mencatat check in, jadi check out selalu
          ditolak mesin status sebelum GPS dinilai — tombolnya hanya
          membingungkan di mode itu.
        -->
        <Button v-if="!trial" variant="secondary" :disabled="!canSend" @click="send('out')">
          {{ t('me.punch.checkOut') }}
        </Button>
      </div>

      <p v-if="sendError" class="text-sm text-destructive" role="alert">
        {{ t(`me.punch.errors.${sendError}`) }}
      </p>
    </div>

    <!--
      Hasil dari server, tepat di bawah formulir. Nadanya dari hasil
      server (`resultTone`): uji coba tidak pernah tampil sebagai sukses.
    -->
    <div
      v-if="result && tone"
      class="space-y-2 rounded-md border p-3 text-sm"
      :class="TONE_CLASS[tone]"
      role="status"
      aria-live="polite"
      data-testid="punch-result"
    >
      <p class="font-semibold">
        {{ t(`me.punch.result.heading.${result.trial ? 'trial' : tone}`) }}
      </p>

      <p>{{ result.message }}</p>

      <dl v-if="result.trial" class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <dt class="opacity-75">
          {{ t('me.punch.result.location') }}
        </dt>
        <dd>
          {{ valueLabel(result.trial.location_result) }}
          <template v-if="result.trial.accuracy_m">
            · ±{{ result.trial.accuracy_m }} m
          </template>
        </dd>

        <dt class="opacity-75">
          {{ t('me.punch.result.geofence') }}
        </dt>
        <dd>
          {{ valueLabel(result.trial.geofence_result) }}
          <span v-if="result.trial.distance_m && result.trial.radius_m" class="block opacity-75">
            {{ t('me.punch.result.distance', { distance: result.trial.distance_m, radius: result.trial.radius_m }) }}
          </span>
        </dd>

        <dt class="opacity-75">
          {{ t('me.punch.result.selfie') }}
        </dt>
        <dd>{{ result.trial.selfie_stored ? t('me.punch.result.selfieStored') : t('me.punch.result.selfieMissing') }}</dd>

        <dt class="opacity-75">
          {{ t('me.punch.result.biometric') }}
        </dt>
        <dd>{{ t('me.punch.result.biometricUnavailable') }}</dd>

        <dt class="opacity-75">
          {{ t('me.punch.result.attendance') }}
        </dt>
        <dd class="font-medium">
          {{ t('me.punch.result.attendanceNotRecorded') }}
        </dd>
      </dl>

      <p v-else-if="result.attendance" class="font-medium">
        {{ t('me.punch.result.attendance') }}: {{ t('me.punch.result.attendanceRecorded') }}
      </p>
    </div>
  </section>
</template>
