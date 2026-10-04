<script setup lang="ts">
/*
 | Ditulis tangan, bukan hasil generator.
 |
 | Form User hasil generate menampilkan `role_names` sebagai teks
 | read-only — tidak ada satu pun kontrol untuk memberikan role, jadi
 | seluruh RBAC hanya bisa ditugaskan lewat shell.
 |
 | Dua pertanyaan, dan urutannya penting
 | -------------------------------------
 | Layar ini menjawab **WHAT** dan **WHERE** berurutan, bukan bersamaan:
 |
 |   1. role apa yang dipegang orang ini   -> daftar centang, disimpan
 |      ke `/user-roles/save/` dengan kontrak `roles: [id, ...]` yang
 |      tidak berubah
 |   2. sejauh mana tiap role itu berlaku  -> `/user-roles/authority/`,
 |      satu penugasan per simpanan
 |
 | Digabung jadi satu tombol Simpan, orang dipaksa menentukan kewenangan
 | untuk role yang bahkan belum diputuskan diberikan — dan kegagalan di
 | tengah menyisakan sebagian tersimpan tanpa ada yang tahu bagian mana.
 |
 | Yang **tidak** disunting di sini: `Role.data_scope_mode` dan
 | `RoleDataPermission`. Keduanya menjawab "role ini umumnya seluas
 | apa", jadi mengubahnya menggeser kewenangan **setiap** pemegangnya
 | sekaligus. Keduanya tinggal untuk kompatibilitas/backfill.
 */
import { computed, ref, watch } from 'vue'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import LookupSelect from '@/components/forms/LookupSelect.vue'
import { useApi } from '@/composables/useApi'
import { useNotify } from '@/composables/useNotify'
import { apiErrorMessage } from '@framework'

interface RoleRow {
  id: number
  label: string
  code: string
  description?: string
  checked: boolean
}

interface AuthorityRow {
  resource_type: string
  resource_id: number | null
}

interface Assignment {
  assignment: number
  role: number
  role_code: string
  role_name: string
  authority_mode: string
  authority_level: string
  authorities: AuthorityRow[]
  preserved: AuthorityRow[]
}

const MODES = [
  { value: 'unrestricted', label: 'Tanpa Batas' },
  { value: 'placement', label: 'Ikut Penempatan Pemegang' },
  { value: 'explicit', label: 'Ditentukan Sendiri' },
]

const LEVELS = [
  { value: 'company', label: 'Company' },
  { value: 'branch', label: 'Branch' },
  { value: 'location', label: 'Location' },
  { value: 'division', label: 'Division' },
  { value: 'department', label: 'Department' },
  { value: 'section', label: 'Section' },
  { value: 'cost_center', label: 'Cost Center' },
]

// Endpoint pemilih nilai per jenis kewenangan. `warehouse`, `project`,
// dan `iup` sengaja tidak ada: ketiganya ada di enum backend tapi belum
// punya satu pun model yang dipetakan, jadi menyodorkannya cuma
// menawarkan kewenangan yang tidak menyaring apa pun.
const RESOURCE_ENDPOINTS: Record<string, string> = {
  company: '/api/administration/organization/lookup/companies/',
  branch: '/api/administration/organization/lookup/branches/',
  location: '/api/administration/organization/lookup/locations/',
  division: '/api/administration/organization/lookup/divisions/',
  department: '/api/administration/organization/lookup/departments/',
  section: '/api/administration/organization/lookup/sections/',
  cost_center: '/api/administration/organization/lookup/cost-centers/',
}

const { request } = useApi()
const notify = useNotify()

const user = ref<number | null>(null)
const rows = ref<RoleRow[]>([])
const assignments = ref<Assignment[]>([])
const resourceTypes = ref<string[]>([])
const loading = ref(false)
const saving = ref(false)
const savingAuthority = ref<number | null>(null)

const selectedCount = computed(() => rows.value.filter(row => row.checked).length)

function levelLabel(value: string) {
  return LEVELS.find(level => level.value === value)?.label ?? value
}

/**
 * Endpoint pemilih untuk satu jenis kewenangan.
 *
 * Jenisnya datang dari server (`resource_types`), jadi secara tipe ia
 * `string` dan indeksnya bisa meleset. Dikembalikan string kosong
 * alih-alih `undefined`: `LookupSelect` yang endpoint-nya kosong
 * tampil kosong, sedangkan `undefined` melempar saat render.
 */
function endpointFor(resourceType: string): string {
  return RESOURCE_ENDPOINTS[resourceType] ?? ''
}

/** Penugasan tanpa kewenangan sama sekali — harus terbaca, bukan tersirat. */
function hasNoAuthority(row: Assignment) {
  return row.authority_mode === 'explicit' && row.authorities.length === 0
}

/**
 * Belum ditentukan sama sekali — dan itu berarti **tidak melihat apa
 * pun**, bukan "ikut konfigurasi role".
 *
 * Sampai Stage 4G kosong memang berarti mengikuti cakupan lama milik
 * `Role`, dan layar ini mengatakannya. Kalimat itu sekarang salah ke
 * arah yang berbahaya: yang membacanya akan mengira kewenangannya sudah
 * terurus. Sejak Stage 4H penugasan bahkan tidak lagi lahir dengan
 * cakupan turunan — yang tidak disebut, tidak ada.
 */
function isUnset(row: Assignment) {
  return !row.authority_mode
}

/**
 * Role yang baru dicentang tapi belum disimpan.
 *
 * Dipakai memperingatkan sebelum langkah 1 disimpan: memberi role tidak
 * lagi membawa cakupan apa pun, jadi orangnya belum bisa bekerja sampai
 * langkah 2 diisi. Memperingatkannya di depan lebih murah daripada
 * membiarkan orang menutup layar dan melapor "akunnya tidak bisa
 * melihat apa-apa".
 */
const newlyChecked = computed(() => {
  const held = new Set(assignments.value.map(row => row.role))

  return rows.value.filter(row => row.checked && !held.has(row.id))
})

async function loadRoles() {
  if (!user.value) {
    rows.value = []
    assignments.value = []
    return
  }

  loading.value = true

  try {
    rows.value = await request('/api/accounts/user-roles/tree/', {
      method: 'GET',
      query: { user: user.value },
    })

    await loadAuthority()
  }
  catch (e: any) {
    notify.error(apiErrorMessage(e, 'Gagal memuat role pengguna.'))
  }
  finally {
    loading.value = false
  }
}

async function loadAuthority() {
  if (!user.value) {
    assignments.value = []
    return
  }

  const payload = await request('/api/accounts/user-roles/authority/', {
    method: 'GET',
    query: { user: user.value },
  })

  assignments.value = payload.assignments ?? []
  resourceTypes.value = payload.resource_types ?? []
}

async function save() {
  if (!user.value)
    return

  saving.value = true

  try {
    await request('/api/accounts/user-roles/save/', {
      method: 'POST',
      body: {
        user: user.value,
        roles: rows.value.filter(row => row.checked).map(row => String(row.id)),
      },
    })

    notify.success('Role pengguna tersimpan. Berlaku pada request berikutnya.')

    // Daftar kewenangan ikut berubah: role yang dicabut hilang berikut
    // kewenangannya, role baru muncul tanpa kewenangan.
    await loadAuthority()
  }
  catch (e: any) {
    notify.error(apiErrorMessage(e, 'Gagal menyimpan role pengguna.'))
  }
  finally {
    saving.value = false
  }
}

function onModeChange(row: Assignment, mode: string) {
  row.authority_mode = mode

  // Kombinasi yang ditolak backend tidak dibiarkan terbentuk di layar
  // lebih dulu: level hanya milik `placement`, daftar hanya milik
  // `explicit`.
  if (mode !== 'placement')
    row.authority_level = ''

  if (mode !== 'explicit')
    row.authorities = []
}

function addAuthority(row: Assignment) {
  row.authorities.push({ resource_type: 'company', resource_id: null })
}

function removeAuthority(row: Assignment, index: number) {
  row.authorities.splice(index, 1)
}

async function saveAuthority(row: Assignment) {
  if (!user.value)
    return

  savingAuthority.value = row.role

  try {
    await request('/api/accounts/user-roles/authority/', {
      method: 'POST',
      body: {
        user: user.value,
        role: row.role,
        authority_mode: row.authority_mode,
        authority_level: row.authority_level ?? '',
        // Baris `own` sengaja tidak ikut dikirim — ia tidak disunting
        // di sini dan backend mempertahankannya apa adanya.
        authorities: row.authorities.filter(item => item.resource_id != null),
      },
    })

    notify.success(`Kewenangan ${row.role_code} tersimpan.`)

    await loadAuthority()
  }
  catch (e: any) {
    notify.error(apiErrorMessage(e, 'Gagal menyimpan kewenangan.'))
  }
  finally {
    savingAuthority.value = null
  }
}

watch(user, loadRoles)
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div class="grid w-full max-w-md gap-2">
        <label class="text-sm font-medium">User</label>
        <LookupSelect
          v-model="user"
          label="User"
          endpoint="/api/accounts/lookup/users/"
          variant="field"
          label-key="label"
          value-key="value"
        />
      </div>

      <div class="flex items-center gap-3">
        <span class="text-sm text-muted-foreground">
          {{ selectedCount }} role dipilih
        </span>


        <Button :disabled="!user || saving" @click="save">
          {{ saving ? 'Menyimpan...' : 'Simpan Role' }}
        </Button>
      </div>
    </div>

    <!--
      Diberitahukan **sebelum** disimpan, bukan sesudah. Memberi role
      tidak lagi membawa cakupan apa pun: yang tidak disebut, tidak ada.
      Orang yang menutup layar di sini akan melapor "akunnya tidak bisa
      melihat apa-apa", dan sebabnya tidak akan kelihatan dari mana pun.
    -->
    <p
      v-if="newlyChecked.length"
      class="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200"
    >
      <strong>{{ newlyChecked.length }} role baru akan diberikan tanpa
      kewenangan data.</strong>
      Memberi role menentukan <em>apa</em> yang boleh dilakukan, bukan
      <em>baris mana</em> yang terlihat. Setelah disimpan, selesaikan
      langkah 2 di bawah — sebelum itu orangnya belum melihat apa pun
      lewat role tersebut.
    </p>

    <!-- Langkah 1 — role apa -->
    <div class="rounded-lg border p-4">
      <h3 class="mb-3 text-sm font-semibold">
        1. Role yang dipegang
      </h3>

      <div v-if="!user" class="py-12 text-center text-muted-foreground">
        Pilih pengguna untuk menugaskan role.
      </div>

      <div v-else-if="loading" class="py-12 text-center text-muted-foreground">
        Memuat role...
      </div>

      <div v-else class="space-y-1">
        <label
          v-for="row in rows"
          :key="row.id"
          class="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted"
        >
          <Checkbox
            :model-value="row.checked"
            class="mt-0.5"
            @update:model-value="value => (row.checked = value === true)"
          />

          <span>
            <span class="font-medium">{{ row.label }}</span>

            <span v-if="row.description" class="block text-xs text-muted-foreground">
              {{ row.description }}
            </span>
          </span>
        </label>
      </div>
    </div>

    <!-- Langkah 2 — sejauh mana -->
    <div v-if="user && !loading" class="rounded-lg border p-4">
      <h3 class="mb-1 text-sm font-semibold">
        2. Kewenangan tiap role
      </h3>

      <p class="mb-4 text-xs text-muted-foreground">
        Menentukan <strong>baris mana</strong> yang terlihat lewat role itu.
        Role yang sama boleh berkewenangan berbeda untuk orang yang berbeda —
        itu sebabnya tidak perlu ada role terpisah per site.
      </p>

      <div v-if="!assignments.length" class="py-10 text-center text-muted-foreground">
        Belum ada role. Simpan role dulu di atas.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="row in assignments"
          :key="row.assignment"
          class="rounded-md border p-3"
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span class="font-medium">{{ row.role_code }}</span>
              <span class="ml-2 text-xs text-muted-foreground">{{ row.role_name }}</span>
            </div>

            <Button
              size="sm"
              variant="outline"
              :disabled="savingAuthority === row.role"
              @click="saveAuthority(row)"
            >
              {{ savingAuthority === row.role ? 'Menyimpan...' : 'Simpan Kewenangan' }}
            </Button>
          </div>

          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <div class="grid gap-1">
              <label class="text-xs font-medium">Mode Kewenangan</label>
              <select
                :value="row.authority_mode"
                class="h-9 rounded-md border bg-background px-2 text-sm"
                @change="onModeChange(row, ($event.target as HTMLSelectElement).value)"
              >
                <option value="">— belum ditentukan —</option>
                <option v-for="mode in MODES" :key="mode.value" :value="mode.value">
                  {{ mode.label }}
                </option>
              </select>
            </div>

            <div v-if="row.authority_mode === 'placement'" class="grid gap-1">
              <label class="text-xs font-medium">Tingkat Organisasi</label>
              <select
                v-model="row.authority_level"
                class="h-9 rounded-md border bg-background px-2 text-sm"
              >
                <option value="">— pilih —</option>
                <option v-for="level in LEVELS" :key="level.value" :value="level.value">
                  {{ level.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Penjelasan tiap mode, di tempat keputusannya diambil -->
          <p
            v-if="row.authority_mode === 'unrestricted'"
            class="mt-2 text-xs text-muted-foreground"
          >
            Melihat seluruh data tenant lewat role ini.
          </p>

          <p
            v-else-if="row.authority_mode === 'placement'"
            class="mt-2 text-xs text-muted-foreground"
          >
            Mengikuti penempatan orangnya sendiri
            <template v-if="row.authority_level">
              pada tingkat <strong>{{ levelLabel(row.authority_level) }}</strong>
            </template>. Kalau ia pindah, kewenangannya ikut berpindah.
          </p>

          <p
            v-else-if="isUnset(row)"
            class="mt-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200"
          >
            <strong>Belum ditentukan — belum membuka data apa pun.</strong>
            Role ini sudah dipegang dan izinnya berlaku, tapi tidak ada
            satu baris pun yang masuk cakupannya sampai mode di atas
            dipilih dan disimpan.
          </p>

          <!-- Daftar kewenangan untuk mode explicit -->
          <div v-if="row.authority_mode === 'explicit'" class="mt-3 space-y-2">
            <div
              v-for="(item, index) in row.authorities"
              :key="index"
              class="flex flex-wrap items-end gap-2"
            >
              <div class="grid gap-1">
                <label class="text-xs font-medium">Jenis</label>
                <select
                  v-model="item.resource_type"
                  class="h-9 rounded-md border bg-background px-2 text-sm"
                  @change="item.resource_id = null"
                >
                  <option v-for="type in resourceTypes" :key="type" :value="type">
                    {{ levelLabel(type) }}
                  </option>
                </select>
              </div>

              <div class="grid min-w-[220px] flex-1 gap-1">
                <label class="text-xs font-medium">Nilai</label>
                <LookupSelect
                  v-model="item.resource_id"
                  :label="levelLabel(item.resource_type)"
                  :endpoint="endpointFor(item.resource_type)"
                  variant="field"
                />
              </div>

              <Button size="sm" variant="ghost" @click="removeAuthority(row, index)">
                Hapus
              </Button>
            </div>

            <Button size="sm" variant="outline" @click="addAuthority(row)">
              + Tambah Kewenangan
            </Button>

            <!--
              Peringatan yang harus berbunyi jelas: `explicit` tanpa satu
              pun baris berarti role ini tidak membuka data apa pun. Sah,
              dan kadang memang yang dimaksud — tapi tidak boleh jadi
              kejutan.
            -->
            <p
              v-if="hasNoAuthority(row)"
              class="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200"
            >
              <strong>Tanpa kewenangan data.</strong>
              Role ini tidak membuka satu baris pun. Izinnya tetap berlaku,
              tapi tidak ada data yang masuk cakupannya.
            </p>

            <p
              v-if="row.preserved.length"
              class="text-xs text-muted-foreground"
            >
              Ditambah <strong>data milik sendiri</strong>, yang datang dari
              konfigurasi role dan tidak disunting di sini.
            </p>
          </div>
        </div>
      </div>
    </div>

    <p class="text-xs text-muted-foreground">
      Pengguna tanpa role sama sekali tidak bisa mengubah apa pun.
      Role <strong>EMPLOYEE</strong> adalah dasar yang membuat orang tetap bisa
      mengajukan cuti dan perjalanan dinasnya sendiri. Superuser melewati
      seluruh pemeriksaan ini.
    </p>
  </div>
</template>
