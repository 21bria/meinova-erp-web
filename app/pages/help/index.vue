<script setup lang="ts">
// `apiErrorMessage` **tidak** auto-import: `imports.dirs` di
// `nuxt.config.ts` diselesaikan relatif terhadap `app/`, jadi entri
// `./framework/core/utils` di sana tidak menunjuk ke mana-mana.
// Seluruh komponen framework mengimpornya eksplisit karena alasan yang
// sama.
import { apiErrorMessage } from '@framework'

import { LifeBuoy, Search, X } from 'lucide-vue-next'

import HelpArticleCard from '@/modules/helpcenter/components/HelpArticleCard.vue'
import { useHelpCenter } from '@/modules/helpcenter/composables/useHelpCenter'

definePageMeta({
  title: 'Help Center',
})

const api = useHelpCenter()
const route = useRoute()
const notify = useNotify()

const categories = ref<any[]>([])
const modules = ref<any[]>([])
const pending = ref(false)

// Modul yang sedang dipilih. `null` = semua.
//
// Penyaringannya di klien, bukan menembak `?module=` tiap kali tab
// ditekan: seluruh pohonnya sudah ikut di respons pertama dan
// ukurannya kecil. Layar bantuan dibuka justru saat penggunanya
// sedang bingung — menunggu request tiap kali menekan tab adalah
// tempat paling buruk untuk menghemat satu payload.
const activeModule = ref<string | null>(null)

const query = ref('')
const results = ref<any[] | null>(null)
const searching = ref(false)

// Panduan untuk layar tempat pengguna menekan Help & Support.
// Sidebar menyisipkan rutenya sebagai `?route=`; tanpa itu bagian ini
// tidak dirender sama sekali.
const contextRoute = computed(() => String(route.query.route ?? ''))
const contextual = ref<any[]>([])

const activeCategory = ref<string | null>(null)

// Kategori milik modul yang sedang dipilih. Menjadi dasar daftar
// kategori di samping **dan** isi halamannya, supaya keduanya tidak
// pernah bisa menunjukkan himpunan yang berbeda.
const moduleCategories = computed(() => {
  if (activeModule.value === null)
    return categories.value

  return categories.value.filter(
    c => (c.module || '') === activeModule.value,
  )
})

const visibleCategories = computed(() => {
  if (!activeCategory.value)
    return moduleCategories.value

  return moduleCategories.value.filter(c => c.code === activeCategory.value)
})

const totalArticles = computed(() =>
  moduleCategories.value.reduce((sum, c) => sum + c.articles.length, 0),
)

// Pindah modul mengosongkan pilihan kategori: kategori yang dipilih
// lazimnya bukan milik modul yang baru, dan membiarkannya menghasilkan
// layar kosong yang terbaca seperti modul tanpa panduan.
watch(activeModule, () => {
  activeCategory.value = null
})

async function load() {
  pending.value = true

  try {
    const res: any = await api.getPortal()
    categories.value = res?.data?.categories ?? []
    modules.value = res?.data?.modules ?? []
  }
  catch (error: any) {
    notify.error(apiErrorMessage(error, 'Gagal memuat Help Center.'))
    categories.value = []
    modules.value = []
  }
  finally {
    pending.value = false
  }
}

async function loadContextual() {
  if (!contextRoute.value) {
    contextual.value = []
    return
  }

  try {
    const res: any = await api.getContextual(contextRoute.value)
    contextual.value = res?.data?.results ?? []
  }
  catch {
    // Bagian pelengkap. Kegagalannya tidak boleh memunculkan pesan
    // error di halaman yang justru dibuka orang karena sedang
    // kesulitan — sisa halamannya tetap berguna tanpa bagian ini.
    contextual.value = []
  }
}

// Pencarian ditembak setelah pengetikan berhenti, bukan tiap huruf:
// tanpa jeda, mengetik "cuti tahunan" berarti dua belas request yang
// hasilnya saling mendahului dan yang tampil belum tentu yang terakhir.
let searchTimer: ReturnType<typeof setTimeout> | null = null

watch(query, (value) => {
  if (searchTimer)
    clearTimeout(searchTimer)

  if (value.trim().length < 2) {
    results.value = null
    searching.value = false
    return
  }

  searching.value = true

  searchTimer = setTimeout(async () => {
    try {
      const res: any = await api.search(value.trim())
      results.value = res?.data?.results ?? []
    }
    catch (error: any) {
      notify.error(apiErrorMessage(error, 'Pencarian gagal.'))
      results.value = []
    }
    finally {
      searching.value = false
    }
  }, 350)
})

function clearSearch() {
  query.value = ''
  results.value = null
}

onBeforeUnmount(() => {
  if (searchTimer)
    clearTimeout(searchTimer)
})

onMounted(() => {
  load()
  loadContextual()
})
</script>

<template>
  <main class="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
    <header class="mb-8">
      <h1 class="flex items-center gap-2 text-2xl font-semibold">
        <LifeBuoy class="size-6 text-primary" />
        Help Center
      </h1>

      <p class="mt-1 text-muted-foreground">
        Panduan pemakaian sistem. Telusuri per kategori, atau cari
        langsung apa yang ingin Anda kerjakan.
      </p>

      <div class="relative mt-5 max-w-2xl">
        <Search
          class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          v-model="query"
          placeholder="Cari panduan — mis. 'cuti', 'roster', 'tidak bisa simpan'"
          class="pl-9 pr-9"
        />

        <button
          v-if="query"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Bersihkan pencarian"
          @click="clearSearch"
        >
          <X class="size-4" />
        </button>
      </div>
    </header>

    <!--
      Tab per modul. Baru muncul kalau panduannya memang tersebar di
      lebih dari satu modul — satu tab tunggal bukan pilihan, cuma
      hiasan yang memakan satu baris di kepala halaman.
    -->
    <nav
      v-if="results === null && modules.length > 1"
      class="mb-6 flex gap-1 overflow-x-auto border-b"
    >
      <button
        type="button"
        class="whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors"
        :class="activeModule === null
          ? 'border-primary font-medium text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground'"
        @click="activeModule = null"
      >
        Semua
      </button>

      <button
        v-for="mod in modules"
        :key="mod.code || 'general'"
        type="button"
        class="whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors"
        :class="activeModule === mod.code
          ? 'border-primary font-medium text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground'"
        @click="activeModule = mod.code"
      >
        {{ mod.label }}
        <span class="ml-1 opacity-60">{{ mod.count }}</span>
      </button>
    </nav>

    <!-- Hasil pencarian menggantikan seluruh daftar selama kotak
         cari terisi — dua daftar sekaligus membuat orang tidak tahu
         yang mana hasilnya. -->
    <section v-if="results !== null" class="space-y-3">
      <p class="text-sm text-muted-foreground">
        <template v-if="searching">
          Mencari…
        </template>
        <template v-else>
          {{ results.length }} hasil untuk “{{ query }}”
        </template>
      </p>

      <div v-if="searching" class="space-y-3">
        <Skeleton v-for="n in 3" :key="n" class="h-20 w-full" />
      </div>

      <template v-else-if="results.length">
        <HelpArticleCard
          v-for="article in results"
          :key="article.slug"
          :article="article"
          show-category
        />
      </template>

      <div
        v-else
        class="rounded-lg border border-dashed p-8 text-center text-muted-foreground"
      >
        <p>Tidak ada panduan yang cocok dengan “{{ query }}”.</p>
        <p class="mt-1 text-sm">
          Coba kata lain, atau hubungi admin perusahaan Anda.
        </p>
      </div>
    </section>

    <div v-else class="grid gap-8 lg:grid-cols-[220px_1fr]">
      <!-- Daftar kategori. Di layar sempit ia jadi baris chip yang
           bisa digeser, bukan kolom setinggi layar yang harus
           dilewati dulu sebelum sampai ke isinya. -->
      <aside class="lg:sticky lg:top-6 lg:self-start">
        <div class="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          <button
            type="button"
            class="whitespace-nowrap rounded-md px-3 py-2 text-left text-sm transition-colors"
            :class="activeCategory === null
              ? 'bg-accent font-medium text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent/50'"
            @click="activeCategory = null"
          >
            Semua ({{ totalArticles }})
          </button>

          <button
            v-for="category in moduleCategories"
            :key="category.code"
            type="button"
            class="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-left text-sm transition-colors"
            :class="activeCategory === category.code
              ? 'bg-accent font-medium text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent/50'"
            @click="activeCategory = category.code"
          >
            <Icon v-if="category.icon" :name="category.icon" class="size-4" />
            {{ category.name }}
          </button>
        </div>
      </aside>

      <div class="space-y-10">
        <section v-if="contextual.length" class="space-y-3">
          <div>
            <h2 class="text-lg font-semibold">
              Untuk layar yang tadi Anda buka
            </h2>
            <p class="text-sm text-muted-foreground">
              <code class="rounded bg-muted px-1.5 py-0.5 text-xs">{{ contextRoute }}</code>
            </p>
          </div>

          <HelpArticleCard
            v-for="article in contextual"
            :key="`ctx-${article.slug}`"
            :article="article"
            show-category
          />
        </section>

        <div v-if="pending" class="space-y-4">
          <Skeleton v-for="n in 4" :key="n" class="h-24 w-full" />
        </div>

        <section
          v-for="category in visibleCategories"
          v-else
          :key="category.code"
          class="space-y-3"
        >
          <div>
            <h2 class="flex items-center gap-2 text-lg font-semibold">
              <Icon v-if="category.icon" :name="category.icon" class="size-5 text-primary" />
              {{ category.name }}
            </h2>

            <p v-if="category.description" class="text-sm text-muted-foreground">
              {{ category.description }}
            </p>
          </div>

          <div class="grid gap-3 md:grid-cols-2">
            <HelpArticleCard
              v-for="article in category.articles"
              :key="article.slug"
              :article="article"
            />
          </div>
        </section>

        <div
          v-if="!pending && !categories.length"
          class="rounded-lg border border-dashed p-10 text-center"
        >
          <p class="font-medium">
            Belum ada panduan yang diterbitkan.
          </p>
          <p class="mt-1 text-sm text-muted-foreground">
            Admin dapat menulisnya di Administration &rsaquo; Help Center,
            atau menerbitkan panduan bawaan dengan perintah
            <code class="rounded bg-muted px-1.5 py-0.5 text-xs">seed_help_center</code>.
          </p>
        </div>

        <div class="rounded-lg border bg-muted/30 p-6 text-center">
          <p class="font-medium">
            Tidak menemukan jawabannya?
          </p>
          <p class="mt-1 text-sm text-muted-foreground">
            Hubungi admin perusahaan Anda. Sertakan nama layar, tombol
            yang Anda tekan, dan pesan yang muncul — tiga hal itu yang
            paling cepat menyelesaikannya.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
