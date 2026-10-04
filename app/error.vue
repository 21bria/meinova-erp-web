<script setup>
/**
 * Halaman error.
 *
 * Dulu selalu menulis "404 — Page Not Found" apa pun errornya, jadi
 * halaman yang **ada** tapi gagal dirender ikut terbaca sebagai
 * "halamannya tidak ada". Itu menyesatkan orang yang mencari sebabnya:
 * rute yang hilang dan komponen yang melempar exception butuh
 * perbaikan yang sama sekali berbeda. Sekarang kode dan pesan aslinya
 * ditampilkan apa adanya.
 */
const props = defineProps({
  error: {
    type: Object,
    default: () => ({}),
  },
})

const { theme } = useAppSettings()

useHead({
  bodyAttrs: {
    class: computed(() => `color-${theme.value?.color || 'default'} theme-${theme.value?.type || 'default'}`),
  },
})

const router = useRouter()

const statusCode = computed(() => props.error?.statusCode ?? 500)

const COPY = {
  401: {
    title: 'Belum masuk',
    body: 'Sesi Anda sudah berakhir. Masuk kembali untuk melanjutkan.',
  },
  403: {
    title: 'Tidak punya akses',
    body: 'Akun Anda tidak berhak membuka halaman ini.',
  },
  404: {
    title: 'Halaman tidak ditemukan',
    body: 'Alamat yang Anda buka tidak ada atau sudah dipindah.',
  },
  500: {
    title: 'Halaman gagal dimuat',
    body: 'Halamannya ada, tapi terjadi kesalahan saat merendernya.',
  },
  503: {
    title: 'Layanan sedang tidak tersedia',
    body: 'Coba lagi beberapa saat lagi.',
  },
}

const copy = computed(() =>
  COPY[statusCode.value] ?? {
    title: 'Terjadi kesalahan',
    body: 'Sesuatu tidak berjalan sebagaimana mestinya.',
  },
)

// Pesan asli hanya ditampilkan saat pengembangan. Di produksi, isi
// exception bisa memuat detail internal yang tidak boleh terbaca
// pengguna.
const detail = computed(() => {
  if (!import.meta.dev)
    return null

  return props.error?.message || null
})

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="h-svh">
    <div class="m-auto h-full w-full flex flex-col items-center justify-center gap-2 px-6">
      <h1 class="text-[7rem] font-bold leading-tight">
        {{ statusCode }}
      </h1>

      <span class="font-medium">{{ copy.title }}</span>

      <p class="max-w-md text-center text-muted-foreground">
        {{ copy.body }}
      </p>

      <pre
        v-if="detail"
        class="mt-4 max-w-2xl overflow-x-auto rounded-md border bg-muted/40 p-3 text-left text-xs"
      >{{ detail }}</pre>

      <div class="mt-6 flex gap-4">
        <Button variant="outline" @click="router.back()">
          Kembali
        </Button>
        <Button @click="goHome">
          Ke Beranda
        </Button>
      </div>
    </div>
  </div>
</template>
