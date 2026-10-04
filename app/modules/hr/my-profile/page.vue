<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'

import ProfileFieldGrid from './components/ProfileFieldGrid.vue'
import ProfileHistory from './components/ProfileHistory.vue'
import ProfileResourceTable from './components/ProfileResourceTable.vue'
import { useMyProfile } from './composables/useMyProfile'

/**
 * **My Profile** — kartu pegawai milik sendiri, read-only.
 *
 * Ditulis tangan, bukan hasil `pnpm meinova generate`, karena bentuknya
 * memang bukan CRUD: tidak ada daftar, tidak ada dialog, tidak ada
 * Save. Presedennya `/help`, `/workflow/inbox`, dan `/settings/profile`
 * yang sama-sama di luar generator.
 *
 * **Kenapa bukan `/hr/employees` yang disaring ke dirinya sendiri.**
 * Sudah dicoba di atas kertas dan buntu: karena role `EMPLOYEE` tidak
 * punya `change_employee`, `useCrud` menyembunyikan tombol Edit — dan
 * di tabel itu Edit adalah **satu-satunya** jalan membuka detail.
 * Hasilnya tabel satu baris yang tidak bisa dibuka sama sekali.
 * Menambalnya berarti membangun aksi View read-only, mode read-only
 * untuk workspace, lalu menyembunyikan 15 tab admin beserta tombol
 * Actions/Import/Export/Bulk Delete — tiga pekerjaan framework, dan
 * tiap penyembunyian itu tempat yang diam-diam terbuka lagi saat ada
 * yang mengubah generator.
 *
 * **Halaman ini tidak menjaga apa pun, dan tidak berpura-pura.**
 * Penjagaannya di backend dan sudah terbukti: `PATCH` ke kartu pegawai
 * dibalas 403, seluruh metode tulis di `me/` dibalas 405, dan kesembilan
 * endpoint sub-resource kini bercakupan `own`.
 */

definePageMeta({
  title: 'My Profile',
})

const {
  record,
  sections,
  pending,
  error,
  load,
} = useMyProfile()

const employeeId = computed(() => record.value?.id ?? null)

const fullName = computed(() => {
  // `full_name` diturunkan backend, tapi bisa kosong kalau serializer
  // membuangnya — jadi nama tetap bisa dirakit dari dua kolom yang
  // pasti ada. Ditulis bertahap, bukan satu rantai: mencampur `??`
  // dan `||` dalam satu ekspresi ditolak TypeScript, dan yang
  // menambahkan kurung asal-asalan mengubah artinya tanpa sadar.
  const derived = [
    record.value?.first_name,
    record.value?.last_name,
  ]
    .filter(Boolean)
    .join(' ')

  return record.value?.full_name || derived || '—'
})

/**
 * Inisial untuk fallback foto.
 *
 * Diambil dari huruf pertama tiap kata, dibatasi dua. Nama yang tidak
 * punya spasi (mis. yang cuma mengisi First Name) tetap menghasilkan
 * satu huruf, bukan kotak kosong.
 */
const initials = computed(() =>
  fullName.value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() ?? '')
    .join('') || '?',
)

/**
 * Baris identitas di kepala halaman.
 *
 * Sengaja **tidak** memuat gaji atau apa pun yang diatur
 * `EmployeeDataPolicy`: kepala halaman terbaca sekilas dan sering
 * terlihat orang lain yang kebetulan lewat di belakang layar.
 */
const summary = computed(() => [
  { label: 'Employee Number', value: record.value?.employee_number },
  { label: 'Company', value: record.value?.company_name },
  { label: 'Location', value: record.value?.location_name },
  { label: 'Join Date', value: record.value?.join_date },
].filter(item => item.value))

onMounted(load)
</script>

<template>
  <div class="space-y-6">
    <div
      class="
        flex flex-col gap-4
        sm:flex-row sm:items-center sm:justify-between
      "
    >
      <div>
        <h1 class="text-xl font-semibold">
          My Profile
        </h1>

        <p class="mt-1 text-sm text-muted-foreground">
          Data kepegawaian Anda. Halaman ini hanya untuk dibaca —
          hubungi HR kalau ada yang perlu diperbaiki.
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        :disabled="pending"
        @click="load"
      >
        <RefreshCw class="mr-2 h-4 w-4" />
        Muat Ulang
      </Button>
    </div>

    <p v-if="pending && !record" class="text-sm text-muted-foreground">
      Memuat data…
    </p>

    <!--
    | Kegagalan ditampilkan apa adanya dari backend. 404 di sini punya
    | arti tersendiri — akun yang belum ditautkan ke kartu pegawai —
    | dan pesannya sudah menyebut jalan keluarnya.
    -->
    <div
      v-else-if="error"
      class="rounded-lg border border-destructive/40 bg-destructive/5 p-5"
    >
      <p class="text-sm font-medium text-destructive">
        {{ error }}
      </p>
    </div>

    <template v-else-if="record">
      <div class="rounded-xl border bg-background p-6">
        <div class="flex items-center gap-4">
          <!--
          | Foto ditaruh di kepala, bukan di grid field. Di grid ia
          | tercetak sebagai jalur berkas ("employees/avatars/9f3c.png")
          | yang tidak memberi tahu apa pun; di sini ia justru hal
          | pertama yang dicari orang saat membuka profilnya sendiri.
          |
          | Yang belum punya foto dapat inisialnya, bukan kotak kosong
          | yang terbaca seperti gambar gagal dimuat.
          -->
          <Avatar class="h-14 w-14">
            <AvatarImage
              v-if="record.avatar"
              :src="record.avatar"
              :alt="fullName"
            />

            <AvatarFallback>{{ initials }}</AvatarFallback>
          </Avatar>

          <h2 class="text-lg font-semibold">
            {{ fullName }}
          </h2>
        </div>

        <dl
          class="
            mt-4 grid gap-x-8 gap-y-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <div v-for="item in summary" :key="item.label">
            <dt class="text-xs text-muted-foreground">
              {{ item.label }}
            </dt>

            <dd class="mt-1 text-sm font-medium">
              {{ item.value }}
            </dd>
          </div>
        </dl>
      </div>

      <section
        v-for="section in sections"
        :key="section.key"
        class="rounded-xl border bg-background"
      >
        <div class="border-b rounded-t-xl bg-muted/30 px-6 py-4">
          <h3 class="text-sm font-semibold">
            {{ section.label }}
          </h3>
        </div>

        <div class="p-6">
          <ProfileFieldGrid
            v-if="section.kind === 'fields'"
            :fields="section.fields"
            :record="record"
          />

          <ProfileHistory
            v-else-if="section.kind === 'history'"
            :employee-id="employeeId"
          />

          <ProfileResourceTable
            v-else-if="section.endpoint"
            :endpoint="section.endpoint"
            :employee-id="employeeId"
            :fields="section.fields"
          />

          <p v-else class="text-sm text-muted-foreground">
            Belum ada data.
          </p>
        </div>
      </section>
    </template>
  </div>
</template>
