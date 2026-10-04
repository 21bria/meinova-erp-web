<script setup lang="ts">
/**
 * Profil pengguna yang sedang login.
 *
 * Berkas ini dulu berisi contoh bawaan template: `verifiedEmails`
 * berisi `m@example.com`, bio "I own a computer.", dua tautan ke
 * shadcn.com, dan `onSubmit` yang **cuma menampilkan toast berisi JSON
 * isian**. Tidak ada satu request pun. Jadi tombol Update profile
 * memang ada, ditekan, dan tidak pernah mengubah apa-apa.
 *
 * Sekarang lewat `PATCH /api/accounts/auth/me/` — yang sebelum ini
 * `RetrieveAPIView`, alias tidak ada cara sama sekali bagi seseorang
 * untuk membetulkan namanya sendiri.
 */
import { apiErrorMessage } from '@framework'

const auth = useAuthStore()
const { request } = useApi()
const notify = useNotify()

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
})

const isSaving = ref(false)
const errors = ref<Record<string, string>>({})

/**
 * Diisi dari profil yang sudah dimuat, dan diisi **ulang** saat
 * profilnya datang.
 *
 * `/auth/me` lazim selesai setelah halaman dirender; tanpa `watch`,
 * yang membuka layar ini langsung setelah login mendapat form kosong
 * dan mengira datanya memang belum ada.
 */
watch(
  () => auth.user,
  (user) => {
    if (!user) return

    form.first_name = user.first_name ?? ''
    form.last_name = user.last_name ?? ''
    form.email = user.email ?? ''
  },
  { immediate: true },
)

// Yang tidak bisa diubah sendiri, ditampilkan apa adanya. Username
// dipakai untuk login dan tercetak di jejak audit; role ditentukan
// admin keamanan. Menyembunyikannya membuat orang mencari-cari di mana
// mengubahnya; menampilkannya read-only menjawabnya sekali.
const identity = computed(() => ({
  username: auth.user?.username ?? '-',
  roles: (auth.user?.roles ?? [])
    .map((role: any) => role.name || role.code)
    .join(', ') || 'Belum ada role',
}))

async function onSubmit() {
  isSaving.value = true
  errors.value = {}

  try {
    const updated = await request('/api/accounts/auth/me/', {
      method: 'PATCH',
      body: { ...form },
    })

    // Respons memakai bentuk **baca** (lengkap dengan role dan izin),
    // jadi bisa dipasang apa adanya. Menyimpan bentuk tulis di sini
    // akan menghapus role dari state dan sidebar langsung kehilangan
    // menunya tanpa satu pun error.
    auth.user = updated

    notify.success('Profil tersimpan.')
  }
  catch (err: any) {
    const payload = err?.data?.errors

    if (payload && typeof payload === 'object') {
      errors.value = Object.fromEntries(
        Object.entries(payload).map(([key, value]) => [
          key,
          Array.isArray(value) ? String(value[0]) : String(value),
        ]),
      )
    }

    notify.error(apiErrorMessage(err, 'Gagal menyimpan profil'))
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      Profil
    </h3>

    <p class="text-sm text-muted-foreground">
      Nama dan email yang tampil di sidebar, dokumen, dan jejak persetujuan.
    </p>

    <Separator class="my-4" />

    <form class="space-y-6" @submit.prevent="onSubmit">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="space-y-2">
          <Label for="first-name">Nama Depan</Label>
          <Input id="first-name" v-model="form.first_name" autocomplete="given-name" />
          <p v-if="errors.first_name" class="text-xs text-destructive">
            {{ errors.first_name }}
          </p>
        </div>

        <div class="space-y-2">
          <Label for="last-name">Nama Belakang</Label>
          <Input id="last-name" v-model="form.last_name" autocomplete="family-name" />
          <p v-if="errors.last_name" class="text-xs text-destructive">
            {{ errors.last_name }}
          </p>
        </div>
      </div>

      <div class="space-y-2">
        <Label for="email">Email</Label>
        <Input id="email" v-model="form.email" type="email" autocomplete="email" />
        <p v-if="errors.email" class="text-xs text-destructive">
          {{ errors.email }}
        </p>
        <p v-else class="text-xs text-muted-foreground">
          Dipakai untuk pemberitahuan dan pemulihan akun.
        </p>
      </div>

      <Separator />

      <!--
        Read-only, bukan disembunyikan: "kenapa role saya begini" dan
        "username saya apa" adalah dua pertanyaan yang selalu muncul di
        layar profil, dan jawabannya ada di sini.
      -->
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="space-y-1">
          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Username
          </p>
          <p class="text-sm">
            {{ identity.username }}
          </p>
        </div>

        <div class="space-y-1">
          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Role
          </p>
          <p class="text-sm">
            {{ identity.roles }}
          </p>
        </div>
      </div>

      <p class="text-xs text-muted-foreground">
        Username dan role diatur administrator keamanan.
      </p>

      <div class="flex items-center gap-2">
        <Button type="submit" :disabled="isSaving">
          {{ isSaving ? 'Menyimpan…' : 'Simpan Perubahan' }}
        </Button>
      </div>
    </form>
  </div>
</template>
