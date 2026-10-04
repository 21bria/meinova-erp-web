<script setup lang="ts">
import type { ShiftCalendarDay } from './types'

import {
  MConfirmDialog,
  MEmpty,
  MLoading,
  MLookupField,
  reportApiError,
} from '@framework'

import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import ShiftCalendarAgenda from './components/ShiftCalendarAgenda.vue'
import ShiftCalendarDayDialog from './components/ShiftCalendarDayDialog.vue'
import ShiftCalendarGrid from './components/ShiftCalendarGrid.vue'

import ShiftOverrideDialog from './components/ShiftOverrideDialog.vue'

import {
  monthLabel,
  shiftMonth,
  useShiftCalendar,
} from './composables/useShiftCalendar'
import { isMyModeQuery, withMyMode } from './selfMode'

/*
 * HR → Attendance → Shift Calendar.
 *
 * Layar **perencanaan operasional**, bukan laporan: tidak menumpang
 * runtime dashboard, tidak punya periode, dan tidak meringkas apa pun.
 * Satu pertanyaan yang harus terjawab tanpa bertanya — *"orang ini
 * tanggal ini bekerja shift apa, jam berapa, dan apakah itu berbeda
 * dari rencananya?"*
 *
 * Seluruh jawabannya dibacakan dari `GET /api/hr/shift-calendar/`.
 * Tidak ada satu shift pun yang diturunkan di sini.
 */

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

/*
 * Dua konteks, satu layar. `?mode=my` (dari My Workspace) membuka
 * "Jadwal Saya": kalender diambil dari `/api/me/schedule/`, subjeknya
 * diresolusi backend dari akun — query ini tidak membawa identitas.
 * Tanpa `mode`, perilaku HR/tim tetap seperti sebelumnya.
 */
const calendar = useShiftCalendar({
  selfMode: isMyModeQuery(route.query),
})

/*
 * Checkbox "Tampilkan Jadwal Saya" — hanya untuk kursi yang memang
 * boleh melihat lebih dari satu kalender. Keadaannya ditulis ke URL
 * supaya refresh dan tombol Kembali membuka konteks yang sama.
 */
function setSelfMode(on: boolean) {
  calendar.requestedSelf.value = on

  router.replace({ query: withMyMode(route.query, on) })
}

const { canWrite } = useAccess()
const { success } = useNotify()
const { request } = useApi()

/*
 * Tombolnya disembunyikan untuk yang tidak punya izin, dan itu **bukan**
 * penjagaannya. Backend tetap yang menolak; 400/403-nya ditampilkan apa
 * adanya lewat `normalizeApiErrors` di dialog. Yang dilakukan di sini
 * cuma tidak menyodorkan tombol yang pasti ditolak.
 *
 * **Melihat dan mengubah adalah dua pertanyaan berbeda**, dan layar ini
 * memang melayani orang yang cuma boleh menjawab yang pertama: pegawai
 * membuka kalendernya sendiri, atasan langsung memantau timnya, dan
 * tidak satu pun dari keduanya menyesuaikan shift. Yang menentukan
 * `hr.add_employeeshiftassignment` — izin operasional yang dicentang di
 * layar Roles, bukan kursi yang kebetulan bisa membuka layarnya.
 *
 * Jawabannya dibacakan dari `access/` selagi belum dimuat pun aman:
 * `can_adjust` yang belum ada berarti tombolnya belum muncul, bukan
 * muncul lalu ditolak.
 */
const canAdjust = computed(
  // "Jadwal Saya" adalah tampilan pribadi. Penyesuaian shift — termasuk
  // untuk diri sendiri — tetap pekerjaan administratif di mode HR.
  () => !calendar.selfMode.value
    && calendar.access.value?.can_adjust === true
    /*
     * Penyesuaian hanya ditawarkan kalau pegawainya memang **punya**
     * kewajiban presensi. Direksi yang Attendance-nya dimatikan
     * Employee Group tidak punya satu hari terjadwal pun; menawarkan
     * "Adjust Shift" di sana menjanjikan sesuatu yang backend memang
     * tidak akan wujudkan — override-nya tersimpan lalu tidak mengubah
     * apa pun.
     */
    && calendar.data.value?.attendance_applicable !== false,
)

// Menghapus adjustment adalah kata kerja yang berbeda dari
// menerbitkannya, jadi izinnya pun dibaca terpisah.
const canRemove = computed(
  () => !calendar.selfMode.value
    && canWrite('hr.employeeshiftassignment').remove,
)

// Penyaring pegawai hanya di mode HR, dan hanya untuk yang membutuhkannya.
const showSelector = computed(
  () => !calendar.selfMode.value && calendar.selectorRequired.value,
)

const selfEmployeeText = computed(() => {
  const self = calendar.data.value?.employee
    ?? calendar.access.value?.self_employee

  return self ? `${self.employee_number} - ${self.name}` : ''
})

const selectedDay = ref<ShiftCalendarDay | null>(null)
const dayDialogOpen = ref(false)

const overrideDialogOpen = ref(false)
const overrideStart = ref('')
const overrideEnd = ref('')

const confirmRemoveOpen = ref(false)
const removingId = ref<number | null>(null)

const employee = computed(() => calendar.data.value?.employee ?? null)

const monthText = computed(() => monthLabel(calendar.month.value))

const summary = computed(() => {
  const data = calendar.data.value

  if (!data)
    return null

  return {
    scheduled: data.scheduled_days,
    total: data.range.days,
    overrides: calendar.overrideDays.value.length,
    missing: calendar.missingShiftDays.value.length,
    /*
     * Angka dari backend, bukan hitungan ulang atas `days`: baris
     * pemulihan boleh membentang melewati blok off, dan pada tanggal
     * itu ia tidak berarti apa-apa.
     */
    recovery: data.recovery_days,
  }
})

function openDay(day: ShiftCalendarDay) {
  selectedDay.value = day
  dayDialogOpen.value = true
}

function startAdjust(day: ShiftCalendarDay) {
  overrideStart.value = day.date
  overrideEnd.value = day.date

  dayDialogOpen.value = false
  overrideDialogOpen.value = true
}

/*
 * Tombol di kepala kalender: menyesuaikan sebuah **rentang** tanpa
 * harus membuka salah satu selnya dulu. Diisi hari pertama bulan yang
 * sedang dibuka — tanggalnya tetap bisa diketik, dan endpoint-nya
 * memang menerima rentang.
 */
function startRangeAdjust() {
  const first = calendar.days.value[0]

  overrideStart.value = first?.date ?? ''
  overrideEnd.value = first?.date ?? ''

  overrideDialogOpen.value = true
}

function askRemove(day: ShiftCalendarDay) {
  removingId.value = day.assignment_id
  dayDialogOpen.value = false
  confirmRemoveOpen.value = true
}

async function removeOverride() {
  if (removingId.value == null)
    return

  try {
    await request(
      `/api/hr/shift-assignments/${removingId.value}/`,
      { method: 'DELETE' },
    )

    success('Adjustment dihapus.')

    /*
     * Muat ulang, jangan tambal state lokal. Satu baris override bisa
     * membentang beberapa hari, dan menebak sel mana yang kembali ke
     * baseline berarti menghitung ulang resolusi backend di sini.
     */
    await calendar.load()
  }
  catch (caught: any) {
    reportApiError(caught, 'Adjustment gagal dihapus.')
  }
  finally {
    confirmRemoveOpen.value = false
    removingId.value = null
  }
}

async function onOverrideSaved() {
  success('Adjustment disimpan.')

  await calendar.load()
}

function stepMonth(delta: number) {
  calendar.month.value = shiftMonth(calendar.month.value, delta)
}
</script>

<template>
  <div class="space-y-5 p-4 sm:space-y-6 sm:p-6">
    <div class="flex flex-col gap-1">
      <h1 class="text-xl font-semibold tracking-tight sm:text-2xl">
        {{
          calendar.selfMode.value
            ? t('hr.shiftCalendar.mySchedule')
            : 'Employee Shift Calendar'
        }}
      </h1>
      <!--
        Kalimatnya menyebut Roster lebih dulu, dan itu disengaja: layar
        ini **hasil**, bukan tempat kedua untuk menyusun jadwal. Selama
        kalimatnya berbunyi seperti "di sini shift ditentukan", orang
        akan mencari tombol menyusun rencana di layar yang memang tidak
        punya — lalu menyusunnya dua kali.
      -->
      <p class="text-muted-foreground text-sm">
        Roster menentukan hari kerja dan shift normal. Kalender ini
        menampilkan jadwal efektif pegawai setelah adjustment.
      </p>
    </div>

    <!--
      Penyaring.

      **Dua bentuk layar, satu rute.** Pegawai yang cuma boleh melihat
      kalendernya sendiri tidak disodori dropdown berisi satu nama —
      ia langsung mendapat kalendernya. Yang memutuskan backend
      (`selector_required` dari `access/`), bukan tebakan dari jumlah
      baris dropdown atau dari kode role: menyimpulkannya di sini
      berarti menyalin aturan cakupan ke tempat kedua.

      Location ikut disembunyikan — gunanya cuma mempersempit daftar
      pegawai, dan tanpa daftar itu ia tidak menyaring apa pun.
    -->
    <Card>
      <!--
        "Tampilkan Jadwal Saya": hanya untuk kursi yang boleh melihat
        kalender orang lain. Pegawai biasa tidak mendapatnya — mode
        pribadinya tetap, dan endpoint HR tetap menolak id orang lain.
      -->
      <div
        v-if="calendar.toggleVisible.value"
        class="flex items-center gap-2 border-b px-4 pt-4 pb-3 sm:px-5"
      >
        <Checkbox
          id="shift-calendar-my-schedule"
          :model-value="calendar.selfMode.value"
          @update:model-value="(value) => setSelfMode(value === true)"
        />
        <label
          for="shift-calendar-my-schedule"
          class="cursor-pointer text-sm font-medium"
        >
          {{ t('hr.shiftCalendar.showMySchedule') }}
        </label>
      </div>

      <CardContent
        class="grid gap-4 p-4 sm:p-5"
        :class="showSelector
          ? 'md:grid-cols-3'
          : calendar.selfMode.value
            ? 'md:grid-cols-2 md:max-w-2xl'
            : 'md:max-w-xs'"
      >
        <!-- Mode pribadi: subjeknya tetap, ditampilkan sebagai teks. -->
        <div
          v-if="calendar.selfMode.value"
          class="grid gap-2"
        >
          <span class="text-sm font-medium">
            {{ t('hr.shiftCalendar.employee') }}
          </span>
          <div
            class="
              bg-muted/40 flex h-9 items-center rounded-md border px-3
              text-sm
            "
          >
            <span class="truncate">{{ selfEmployeeText || '—' }}</span>
          </div>
        </div>

        <MLookupField
          v-if="showSelector"
          v-model="calendar.locationId.value"
          label="Location"
          endpoint="/api/administration/organization/lookup/locations/"
          placeholder="Semua lokasi"
          hint="Mempersempit daftar pegawai."
        />

        <!--
          `depends` jadi query param apa adanya, jadi dropdown pegawai
          menyaring lewat backend. Cakupan organisasi tetap ditegakkan
          di sana — tidak ada satu baris pun di layar ini yang
          menghitung siapa yang boleh terlihat.

          `reporting_line: 1` menambahkan bawahan pemanggilnya,
          berjenjang. Dibutuhkan justru oleh kursi yang cakupannya
          paling sempit: **atasan langsung** dicakup `own`, jadi tanpa
          param ini ia cuma menemukan dirinya sendiri di dropdown —
          padahal jadwal timnya yang harus ia pantau, dan meja "Atasan
          Langsung" pada Roster Setup memang ia yang tanda tangani.

          Param ini **tidak** memperluas apa pun dengan sendirinya:
          isinya diturunkan dari akun yang meminta, jadi yang paling
          jauh bisa didapat seseorang adalah bawahannya sendiri.
          Endpoint kalendernya tetap memeriksa ulang — dropdown bukan
          penjagaan.
        -->
        <MLookupField
          v-if="showSelector"
          v-model="calendar.employeeId.value"
          label="Employee"
          endpoint="/api/hr/employees/lookup/"
          placeholder="Pilih pegawai"
          required
          :depends="{
            location: calendar.locationId.value,
            reporting_line: 1,
          }"
        />

        <div class="grid gap-2">
          <label class="text-sm font-medium">Month</label>

          <div class="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              aria-label="Bulan sebelumnya"
              @click="stepMonth(-1)"
            >
              <Icon name="i-lucide-chevron-left" class="size-4" />
            </Button>

            <div
              class="
                bg-background flex h-9 min-w-0 flex-1 items-center
                justify-center rounded-md border px-2 text-sm
                font-medium
              "
            >
              <span class="truncate">{{ monthText }}</span>
            </div>

            <Button
              variant="outline"
              size="icon"
              aria-label="Bulan berikutnya"
              @click="stepMonth(1)"
            >
              <Icon name="i-lucide-chevron-right" class="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Kalender -->
    <Card>
      <CardHeader
        v-if="employee"
        class="gap-3 border-b p-4 sm:p-5"
      >
        <div
          class="
            flex flex-col gap-3
            lg:flex-row lg:items-start lg:justify-between
          "
        >
          <div class="min-w-0">
            <p class="text-base font-semibold">
              {{ employee.employee_number }} — {{ employee.name }}
            </p>

            <p class="text-muted-foreground mt-0.5 text-sm">
              <span>{{ employee.location || '—' }}</span>
              <template v-if="employee.roster_policy">
                · {{ employee.roster_policy }}
              </template>
              <template v-else-if="employee.roster_crew">
                · {{ employee.roster_crew }}
              </template>
            </p>

            <div class="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary">
                {{ summary?.scheduled ?? 0 }} /
                {{ summary?.total ?? 0 }} hari terjadwal
              </Badge>

              <Badge
                v-if="summary?.overrides"
                class="bg-primary/15 text-primary border-transparent"
              >
                {{ summary.overrides }} hari adjustment
              </Badge>

              <!--
                Hari kerja yang sengaja dikosongkan aturan Minimum Rest.
                Disebutkan di kepala kalender karena "kenapa bulan ini
                hari terjadwalnya kurang" adalah pertanyaan pertama yang
                muncul begitu angka di badge sebelah kiri turun.
              -->
              <Badge
                v-if="summary?.recovery"
                class="
                  border-transparent bg-lime-500/15
                  text-lime-700
                  dark:text-lime-300
                "
              >
                {{ summary.recovery }} hari recovery
              </Badge>

              <Badge
                v-if="!calendar.data.value?.attendance_applicable"
                variant="outline"
              >
                Attendance tidak berlaku
              </Badge>
            </div>
          </div>

          <Button
            v-if="canAdjust"
            size="sm"
            variant="outline"
            class="shrink-0 self-start"
            @click="startRangeAdjust"
          >
            <Icon name="i-lucide-clock-arrow-up" class="mr-1.5 size-4" />
            Adjust Shift
          </Button>
        </div>

        <!--
          Peringatan hari kerja tanpa shift. Satu sel oranye di antara
          tiga puluh sel gampang terlewat, dan yang dilaporkannya
          justru lubang master yang harus diperbaiki.
        -->
        <p
          v-if="summary?.missing"
          class="
            rounded-md border border-dashed border-orange-500/50
            bg-orange-500/5 px-3 py-2 text-xs
            text-orange-700
            dark:text-orange-300
          "
        >
          {{ summary.missing }} hari kerja belum punya shift — jam
          kerjanya belum ada di master, jadi keterlambatannya tidak
          dihitung.
        </p>
      </CardHeader>

      <CardContent class="p-4 sm:p-5">
        <MLoading v-if="calendar.loading.value" />

        <MEmpty
          v-else-if="calendar.error.value"
          title="Kalender tidak bisa ditampilkan"
          :description="calendar.error.value"
        />

        <!--
          Kalimatnya berbeda untuk dua keadaan yang berbeda. "Pilih
          pegawai" pada layar yang tidak punya penyaring adalah
          instruksi yang tidak bisa dijalankan siapa pun — dan yang
          sebenarnya terjadi di sana adalah akunnya belum ditautkan ke
          kartu pegawai.
        -->
        <MEmpty
          v-else-if="!calendar.selfMode.value && !calendar.employeeId.value && calendar.selectorRequired.value"
          title="Pilih pegawai"
          description="Kalender shift ditampilkan per pegawai. Pilih satu untuk mulai."
        />

        <MEmpty
          v-else-if="!calendar.selfMode.value && !calendar.employeeId.value"
          title="Kalender belum bisa ditampilkan"
          description="Akun ini belum ditautkan ke data pegawai mana pun. Hubungi HR untuk menghubungkan akun Anda ke kartu pegawai."
        />

        <MEmpty
          v-else-if="!calendar.days.value.length"
          title="Belum ada tanggal"
          description="Tidak ada data untuk bulan ini."
        />

        <template v-else>
          <!-- Desktop: grid bulanan -->
          <div class="hidden md:block">
            <ShiftCalendarGrid
              :days="calendar.days.value"
              :tone-for="calendar.toneFor"
              @select="openDay"
            />
          </div>

          <!-- Layar sempit: daftar bertanggal, tanpa gulir mendatar -->
          <div class="md:hidden">
            <ShiftCalendarAgenda
              :days="calendar.days.value"
              :tone-for="calendar.toneFor"
              @select="openDay"
            />
          </div>

          <!-- Keterangan warna, dirakit dari bulan yang sedang dibuka -->
          <div
            class="
              text-muted-foreground mt-4 flex flex-wrap items-center
              gap-x-4 gap-y-2 border-t pt-4 text-xs
            "
          >
            <span
              v-for="entry in Array.from(
                new Map(
                  calendar.days.value.map((day) => [
                    day.rotation_state === 'work'
                      ? (day.shift_code || 'no-shift')
                      : day.rotation_state,
                    day,
                  ]),
                ).entries(),
              )"
              :key="entry[0]"
              class="inline-flex items-center gap-1.5"
            >
              <span
                class="size-2.5 rounded-full"
                :class="calendar.toneFor(entry[1]).dot"
              />
              <span>
                {{
                  entry[1].rotation_state === 'work'
                    ? (entry[1].shift_code || 'Belum ada shift')
                    : entry[1].rotation_state_label
                }}
              </span>
            </span>

            <span class="inline-flex items-center gap-1.5">
              <span class="bg-primary size-1.5 rounded-full" />
              <span>Adjustment</span>
            </span>
          </div>
        </template>
      </CardContent>
    </Card>

    <ShiftCalendarDayDialog
      v-model:open="dayDialogOpen"
      :day="selectedDay"
      :employee-name="
        employee ? `${employee.employee_number} — ${employee.name}` : ''
      "
      :can-adjust="canAdjust || canRemove"
      @adjust="startAdjust"
      @remove-override="askRemove"
    />

    <ShiftOverrideDialog
      v-model:open="overrideDialogOpen"
      :employee="employee"
      :start-date="overrideStart"
      :end-date="overrideEnd"
      @saved="onOverrideSaved"
    />

    <MConfirmDialog
      v-model:open="confirmRemoveOpen"
      title="Hapus adjustment?"
      description="Tanggal yang tercakup kembali ke rencana shift semula."
      @confirm="removeOverride"
    />
  </div>
</template>
