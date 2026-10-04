<script setup lang="ts">
/**
 * Panel pendamping editor template email.
 *
 * Dua hal yang tidak bisa dinyatakan sebagai field CRUD, jadi ditulis
 * tangan: daftar placeholder yang tersedia untuk event yang dipilih,
 * dan pratinjau hasil rendernya.
 *
 * **Tinggal di luar folder modul hasil generate**, jadi
 * `pnpm meinova generate administration/email-templates` tidak
 * menimpanya. Yang perlu dipasang ulang setelah regenerate cuma satu
 * baris pemanggilnya di `EmailTemplatesWorkspace.vue` — ada catatan
 * pengingat di kepala berkas itu.
 *
 * Kenapa panelnya perlu ada sama sekali: tanpa daftar placeholder,
 * satu-satunya cara mengetahui kunci apa yang tersedia untuk sebuah
 * event adalah membaca kode pengirimnya di repo backend. Orang yang
 * menyunting kalimat surat tidak membuka repo — dan kunci yang salah
 * ketik dirender jadi string kosong, jadi suratnya terkirim berlubang
 * tanpa satu pun pesan.
 */
import { computed, onMounted, ref, watch } from 'vue'

// `apiErrorMessage` TIDAK auto-import: entri `imports.dirs` di
// `nuxt.config.ts` diselesaikan relatif terhadap `app/`, jadi jalur
// framework di sana tidak menunjuk ke mana-mana. Yang menangkapnya
// `vue-tsc`, bukan browser.
import { apiErrorMessage } from '@framework'

import { useNotificationAdmin } from '../composables/useNotificationAdmin'

interface Placeholder {
  key: string
  label: string
  example: string
}

interface EventSpec {
  code: string
  label: string
  module: string
  description: string
  placeholders: Placeholder[]
}

const props = withDefaults(
  defineProps<{
    /** Nilai form yang sedang diketik. */
    modelValue?: Record<string, any>
  }>(),
  {
    modelValue: () => ({}),
  },
)

const { getEvents, preview } = useNotificationAdmin()

const events = ref<EventSpec[]>([])
const loading = ref(false)
const copied = ref('')

const previewing = ref(false)
const previewResult = ref<{
  subject: string
  body: string
  error: string
  unknown_placeholders: string[]
} | null>(null)

/*
|--------------------------------------------------------------------------
| Katalog event
|--------------------------------------------------------------------------
*/

async function loadEvents() {
  if (events.value.length > 0)
    return

  loading.value = true

  try {
    const response: any = await getEvents()

    events.value = response?.data?.events ?? []
  }
  catch {
    /*
     * Panel bantu, bukan jalur simpan. Kegagalannya cukup membuat
     * daftarnya kosong dengan keterangan — melempar toast di sini
     * berarti orang yang cuma ingin mengetik kalimatnya diganggu oleh
     * kegagalan yang tidak menghalanginya.
     */
    events.value = []
  }
  finally {
    loading.value = false
  }
}

/*
 * Dimuat di `onMounted`, **bukan** di-await di tingkat atas
 * `<script setup>`: yang kedua membuat komponennya async dan menuntut
 * pembungkus `<Suspense>` di setiap pemanggil — dan tanpa pembungkus
 * itu seluruh workspace gagal dirender, bukan cuma panel ini.
 */
onMounted(loadEvents)

const currentEvent = computed<EventSpec | null>(() => {
  const code = String(props.modelValue?.event ?? '')

  if (!code)
    return null

  return events.value.find(item => item.code === code) ?? null
})

/*
|--------------------------------------------------------------------------
| Menyalin placeholder
|--------------------------------------------------------------------------
*/

/*
 * Token placeholder dirakit di sini, bukan di dalam mustache template.
 * Menuliskan literal berisi kurung kurawal ganda di dalam `{{ }}`
 * membuat parser Vue membacanya sebagai penutup interpolasi, dan
 * seluruh berkas gagal dikompilasi dengan pesan yang menunjuk baris
 * terakhir — jauh dari sumbernya.
 */
function token(key: string) {
  return ['{', '{ ', key, ' }', '}'].join('')
}

async function copyPlaceholder(key: string) {
  const value = token(key)

  try {
    await navigator.clipboard.writeText(value)

    copied.value = key

    setTimeout(() => {
      if (copied.value === key)
        copied.value = ''
    }, 1500)
  }
  catch {
    /*
     * Clipboard ditolak browser (halaman tanpa HTTPS, izin dicabut).
     * Tidak apa-apa: token-nya tetap tercetak di layar dan bisa
     * disalin tangan — itu sebabnya ia ditampilkan sebagai teks, bukan
     * disembunyikan di balik tombol.
     */
  }
}

/*
|--------------------------------------------------------------------------
| Pratinjau
|--------------------------------------------------------------------------
*/

async function runPreview() {
  const code = String(props.modelValue?.event ?? '')

  if (!code)
    return

  previewing.value = true

  try {
    const response: any = await preview({
      event: code,
      subject: String(props.modelValue?.subject ?? ''),
      body: String(props.modelValue?.body ?? ''),
    })

    previewResult.value = response?.data ?? null
  }
  catch (error: any) {
    previewResult.value = {
      subject: '',
      body: '',
      error: apiErrorMessage(error),
      unknown_placeholders: [],
    }
  }
  finally {
    previewing.value = false
  }
}

/*
 * Pratinjau lama dibuang begitu event-nya diganti. Kalau dibiarkan, apa
 * yang terbaca di panel adalah hasil render event **sebelumnya** —
 * dan itu terbaca persis seperti pratinjau yang benar.
 */
watch(
  () => props.modelValue?.event,
  () => {
    previewResult.value = null
  },
)

const bodyParagraphs = computed(() => {
  return String(previewResult.value?.body ?? '')
    .split(/\n\s*\n/)
    .map(block => block.trim())
    .filter(Boolean)
})
</script>

<template>
  <div class="space-y-4">
    <!-- Placeholder yang tersedia -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-sm">
          Available Placeholders
        </CardTitle>

        <CardDescription class="text-xs">
          <template v-if="currentEvent">
            {{ currentEvent.description }}
          </template>

          <template v-else>
            Pilih Event di tab Scope untuk melihat kunci yang tersedia.
          </template>
        </CardDescription>
      </CardHeader>

      <CardContent class="pt-0">
        <div
          v-if="loading"
          class="space-y-2"
        >
          <Skeleton class="h-6 w-full" />
          <Skeleton class="h-6 w-full" />
          <Skeleton class="h-6 w-2/3" />
        </div>

        <p
          v-else-if="!currentEvent"
          class="text-xs text-muted-foreground"
        >
          Belum ada event yang dipilih.
        </p>

        <div
          v-else
          class="space-y-1"
        >
          <button
            v-for="item in currentEvent.placeholders"
            :key="item.key"
            type="button"
            class="
              flex w-full items-start justify-between gap-3
              rounded-md px-2 py-1.5 text-left
              hover:bg-muted
            "
            @click="copyPlaceholder(item.key)"
          >
            <span class="min-w-0 flex-1">
              <code class="text-xs font-medium">
                {{ token(item.key) }}
              </code>

              <span class="block truncate text-xs text-muted-foreground">
                {{ item.label }}
                <template v-if="item.example">
                  — {{ item.example }}
                </template>
              </span>
            </span>

            <span
              class="shrink-0 text-xs text-muted-foreground"
            >
              {{ copied === item.key ? 'Disalin' : 'Salin' }}
            </span>
          </button>
        </div>
      </CardContent>
    </Card>

    <!-- Pratinjau -->
    <Card>
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between gap-2">
          <div class="min-w-0">
            <CardTitle class="text-sm">
              Preview
            </CardTitle>

            <CardDescription class="text-xs">
              Memakai contoh nilai, bukan data pegawai sungguhan.
            </CardDescription>
          </div>

          <Button
            size="sm"
            variant="outline"
            :disabled="!currentEvent || previewing"
            @click="runPreview"
          >
            {{ previewing ? 'Merender…' : 'Render' }}
          </Button>
        </div>
      </CardHeader>

      <CardContent class="pt-0">
        <p
          v-if="!previewResult"
          class="text-xs text-muted-foreground"
        >
          Tekan Render untuk melihat hasilnya.
        </p>

        <template v-else>
          <!--
            Kesalahan render ditampilkan, tidak disembunyikan: ini
            satu-satunya layar tempat penulisnya bisa tahu templatenya
            rusak sebelum suratnya terkirim ke orang.
          -->
          <Alert
            v-if="previewResult.error"
            variant="destructive"
            class="mb-3"
          >
            <AlertTitle class="text-xs">
              Template tidak bisa dirender
            </AlertTitle>

            <AlertDescription class="text-xs">
              {{ previewResult.error }}
            </AlertDescription>
          </Alert>

          <!--
            Placeholder tak dikenal = peringatan, bukan penolakan.
            Dirender jadi string kosong, jadi surat yang terkirim
            berlubang tanpa satu pun pesan kalau tidak disebut di sini.
          -->
          <Alert
            v-if="previewResult.unknown_placeholders?.length"
            class="mb-3"
          >
            <AlertTitle class="text-xs">
              Kunci tidak dikenal
            </AlertTitle>

            <AlertDescription class="text-xs">
              {{ previewResult.unknown_placeholders.join(', ') }}
              — akan dirender kosong. Periksa ejaannya terhadap daftar
              di atas.
            </AlertDescription>
          </Alert>

          <div class="rounded-md border">
            <div class="border-b bg-muted/40 px-3 py-2">
              <p class="text-xs font-medium">
                {{ previewResult.subject || '(judul kosong)' }}
              </p>
            </div>

            <div class="space-y-2 px-3 py-3">
              <p
                v-for="(block, index) in bodyParagraphs"
                :key="index"
                class="whitespace-pre-line text-xs leading-relaxed"
              >
                {{ block }}
              </p>

              <p
                v-if="bodyParagraphs.length === 0"
                class="text-xs text-muted-foreground"
              >
                (isi kosong)
              </p>
            </div>
          </div>
        </template>
      </CardContent>
    </Card>
  </div>
</template>
