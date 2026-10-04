<script setup lang="ts">
/**
 * **Ruang Kerja Saya** (`/me`) — dashboard personal.
 *
 * Pembedaannya dijaga sengaja:
 *
 *   `/me`         menjawab "bagaimana hari kerja saya"
 *   `/me/profile` menjawab "apa isi kartu kepegawaian saya"
 *
 * Karena itu halaman ini **tidak** memakai `SelfHeader.vue` milik
 * profil, tidak menyalin seksinya, dan tidak lagi memuat kartu
 * "Informasi Pekerjaan"/"Organisasi" — keduanya adalah profil yang
 * ditulis dua kali.
 *
 * **Satu permintaan, tujuh sumber.** Seluruh isi halaman datang dari
 * `/api/me/workspace/`, yang merangkum Roster, Attendance, Leave,
 * Attendance Permission, Overtime, Workflow, dan Payroll untuk pegawai
 * yang sedang login. Halaman ini tidak memanggil satu pun endpoint
 * domain secara langsung — yang semuanya administratif dan menerima
 * `?employee=`.
 *
 * **Nol data karangan, nol placeholder.** Angka yang tidak ada tidak
 * dikarang, dan kemampuan yang belum dibangun tidak digambar kartunya.
 */
import { useI18n } from 'vue-i18n'

import { useApi } from '@/composables/useApi'

import { fetchPunchAvailability } from '../api/client'
import AttendanceCard from '../components/AttendanceCard.vue'
import LeaveCard from '../components/LeaveCard.vue'
import OvertimeCard from '../components/OvertimeCard.vue'
import PayslipStrip from '../components/PayslipStrip.vue'
import PermissionCard from '../components/PermissionCard.vue'
import QuickActions from '../components/QuickActions.vue'
import RequestsCard from '../components/RequestsCard.vue'
import ScheduleCard from '../components/ScheduleCard.vue'
import SelfStateView from '../components/SelfStateView.vue'
import WorkspaceGreeting from '../components/WorkspaceGreeting.vue'
import WorkspaceHero from '../components/WorkspaceHero.vue'
import { useSelfAvatar } from '../composables/useSelfAvatar'
import { useSelfWorkspace } from '../composables/useSelfWorkspace'
import { withCheckIn } from './quickActions'

const { t } = useI18n()

const { workspace, pending, error, load } = useSelfWorkspace()
const { url: avatarUrl, load: loadAvatar } = useSelfAvatar()

const { request } = useApi()

// Tap tersedia untuk akun ini? Jawaban backend yang sama dengan yang
// menentukan kartu tap di `/me/attendance`. Gagal = tidak tersedia.
const punchAvailable = ref(false)

async function loadPunchAvailability() {
  try {
    punchAvailable.value = (await fetchPunchAvailability(request)).available === true
  }
  catch {
    punchAvailable.value = false
  }
}

// Absen Masuk diturunkan dari aksi kartu Kehadiran yang sudah
// diresolusi backend, dan hanya kalau tap tersedia — lihat `quickActions.ts`.
const quickActions = computed(() =>
  workspace.value
    ? withCheckIn(
        workspace.value.quick_actions,
        workspace.value.attendance.action,
        punchAvailable.value,
      )
    : [],
)

async function refresh() {
  await load()

  if (workspace.value?.identity.avatar.url)
    await loadAvatar()
}

onMounted(() => {
  refresh()
  loadPunchAvailability()
})
</script>

<template>
  <!--
    `max-w-7xl`: shell aplikasi menyediakan area kerja yang jauh lebih
    lebar, dan dashboard yang meringkuk di tengah layar 1600px terbaca
    seperti halaman yang gagal memuat separuh isinya.
  -->
  <div class="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6">
    <SelfStateView
      v-if="pending || error"
      :pending="pending"
      :code="error?.code ?? null"
      @retry="refresh"
    />

    <template v-else-if="workspace">
      <WorkspaceGreeting :full-name="workspace.identity.full_name" />

      <WorkspaceHero
        :full-name="workspace.identity.full_name"
        :employee-number="workspace.identity.employee_number"
        :is-active="workspace.identity.is_active"
        :photo="workspace.identity.avatar"
        :hero="workspace.hero"
        :avatar-url="avatarUrl"
      />

      <!--
        HARI INI — apa yang sedang berlangsung. Tiga kartu setinggi sama
        (`items-stretch` + `h-full` di dalam rangkanya), satu kolom di
        ponsel.
      -->
      <section class="space-y-2.5">
        <h2 class="text-sm font-semibold tracking-tight">
          {{ t('me.sections.today') }}
        </h2>

        <!--
          Tablet dapat dua kolom, bukan langsung tiga: tiga kartu pada
          768px menyisakan lebar ~230px masing-masing, dan "Jakarta Head
          Office" mulai pecah jadi tiga baris. Yang ketiga turun ke baris
          bawah dan memakai lebar penuh — itu bacaan yang benar, karena
          kartu ketiga tiap baris memang yang paling ringan isinya.
        -->
        <div class="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ScheduleCard :schedule="workspace.schedule" />
          <AttendanceCard :attendance="workspace.attendance" />
          <RequestsCard :requests="workspace.requests" />
        </div>
      </section>

      <!--
        LAYANAN SAYA — apa yang bisa saya ajukan, beserta posisi saya
        hari ini pada masing-masingnya.
      -->
      <section class="space-y-2.5">
        <h2 class="text-sm font-semibold tracking-tight">
          {{ t('me.sections.myServices') }}
        </h2>

        <div class="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
          <LeaveCard :leave="workspace.leave" />
          <PermissionCard :permission="workspace.permission" />
          <OvertimeCard :overtime="workspace.overtime" />
        </div>
      </section>

      <PayslipStrip :payslip="workspace.payslip" />

      <!--
        Seksinya ikut hilang kalau tidak ada satu pun aksi yang sah —
        judul di atas deretan kosong lebih buruk daripada tidak ada
        judul sama sekali.
      -->
      <section v-if="quickActions.length" class="space-y-2.5">
        <h2 class="text-sm font-semibold tracking-tight">
          {{ t('me.sections.quickActions') }}
        </h2>

        <QuickActions :actions="quickActions" />
      </section>

      <p class="text-xs text-muted-foreground">
        {{ t('me.workspace.detailHint') }}
      </p>
    </template>
  </div>
</template>
