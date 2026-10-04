<script setup lang="ts">
// Tidak auto-import — lihat catatan di `help/index.vue`.
import { apiErrorMessage } from '@framework'

import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  ThumbsDown,
  ThumbsUp,
  Video,
} from 'lucide-vue-next'

import { useHelpCenter } from '@/modules/helpcenter/composables/useHelpCenter'

definePageMeta({
  title: 'Help Article',
})

const route = useRoute()
const api = useHelpCenter()
const notify = useNotify()

const slug = computed(() => String(route.params.slug ?? ''))

const article = ref<any>(null)
const pending = ref(true)
const notFound = ref(false)

// Daftar artikel untuk sidebar. Ditarik terpisah dari artikelnya:
// dulu halaman ini cuma punya prev/next, jadi pindah ke artikel lain
// di kategori yang sama harus lewat tombol Kembali dulu.
const categories = ref<any[]>([])

// Kategori artikel yang sedang dibuka, dibiarkan terbuka di sidebar.
// Kategori lain terlipat — daftar 45 artikel yang seluruhnya terbuka
// membuat artikel yang sedang dibaca tenggelam di antaranya.
const openCategory = ref<string | null>(null)

const activeHeading = ref<string | null>(null)

// Kotak komentar hanya dibuka untuk yang menjawab "tidak membantu".
// "Apa yang kurang" adalah pertanyaan yang cuma masuk akal setelah
// jawabannya tidak, dan menampilkannya untuk semua orang membuat
// tombol jempol terasa seperti formulir.
const showComment = ref(false)
const comment = ref('')
const sending = ref(false)

async function load() {
  pending.value = true
  notFound.value = false

  try {
    const res: any = await api.getArticle(slug.value)
    article.value = res?.data ?? null
    openCategory.value = article.value?.category_code ?? null
  }
  catch (error: any) {
    if (error?.response?.status === 404) {
      notFound.value = true
    }
    else {
      notify.error(apiErrorMessage(error, 'Gagal memuat artikel.'))
    }

    article.value = null
  }
  finally {
    pending.value = false
  }
}

async function vote(isHelpful: boolean) {
  if (sending.value)
    return

  if (!isHelpful && !showComment.value) {
    showComment.value = true
    return
  }

  sending.value = true

  try {
    const res: any = await api.sendFeedback(slug.value, {
      is_helpful: isHelpful,
      comment: comment.value,
    })

    // Angkanya dari respons, bukan dihitung sendiri di klien: yang
    // mengubah suaranya dari ya ke tidak menggeser dua penghitung
    // sekaligus, dan menebaknya di sini berarti angkanya meleset
    // sampai halaman dimuat ulang.
    article.value = { ...article.value, ...res?.data }

    showComment.value = false
    comment.value = ''

    notify.success('Terima kasih atas masukannya.')
  }
  catch (error: any) {
    notify.error(apiErrorMessage(error, 'Masukan gagal dikirim.'))
  }
  finally {
    sending.value = false
  }
}

async function loadNav() {
  try {
    const res: any = await api.getPortal()
    categories.value = res?.data?.categories ?? []
  }
  catch {
    // Sidebar itu pelengkap. Artikelnya sendiri sudah tampil, dan
    // memunculkan pesan error di halaman yang dibuka orang karena
    // sedang kesulitan cuma menambah satu masalah lagi.
    categories.value = []
  }
}

function scrollToHeading(id: string, behavior: ScrollBehavior = 'smooth') {
  const el = document.getElementById(id)

  if (!el)
    return false

  // `scrollIntoView` menempelkan heading ke tepi paling atas viewport,
  // dan di sana ia tertutup header aplikasi. Offset-nya dihitung
  // manual supaya judul bagiannya benar-benar terlihat.
  const top = el.getBoundingClientRect().top + window.scrollY - 96

  window.scrollTo({ top, behavior })
  activeHeading.value = id

  return true
}

function goToHeading(id: string) {
  if (!scrollToHeading(id))
    return

  // `replaceState`, bukan `pushState` (dan bukan lompatan bawaan
  // browser yang juga mendorong riwayat): URL-nya tetap bisa disalin
  // dan dibagikan, tapi tombol Back mengembalikan orang ke Help
  // Center — bukan menyusuri ulang enam bagian artikel yang sama.
  window.history.replaceState(null, '', `#${id}`)
}

// Menyorot bagian yang sedang dibaca. `IntersectionObserver`, bukan
// listener `scroll`: yang kedua jalan puluhan kali per detik untuk
// pekerjaan yang cuma perlu tahu heading mana yang masuk layar.
let observer: IntersectionObserver | null = null

function observeHeadings() {
  observer?.disconnect()

  const ids: string[] = (article.value?.toc ?? []).map((t: any) => t.id)

  if (!ids.length)
    return

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

      if (visible[0]?.target?.id)
        activeHeading.value = visible[0].target.id
    },
    // Jendela sempit di sepertiga atas layar: heading dianggap
    // "sedang dibaca" saat ia berada di sana, bukan saat baru muncul
    // di tepi bawah — kalau tidak, sorotannya melompat ke bagian yang
    // belum dibaca siapa pun.
    { rootMargin: '-88px 0px -70% 0px', threshold: 0 },
  )

  for (const id of ids) {
    const el = document.getElementById(id)

    if (el)
      observer.observe(el)
  }
}

function formatDate(value?: string | null) {
  if (!value)
    return '—'

  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

// Heading baru ada di DOM setelah `v-html` dirender, jadi observernya
// dipasang setelah artikelnya berganti — bukan di `onMounted`, yang
// jalan sebelum permintaan pertama selesai.
watch(article, async () => {
  activeHeading.value = null
  await nextTick()
  observeHeadings()

  // Tautan ber-`#bagian` yang dibuka dari luar (disalin ke rekan).
  // Lompatan bawaan browser sudah lewat jauh sebelum ini: saat halaman
  // pertama dirender, isi artikelnya belum datang dan heading yang
  // dituju belum ada di DOM — jadi tautannya mendarat di kepala
  // artikel dan terbaca seperti anchor yang salah.
  //
  // `auto`, bukan `smooth`: menggulir pelan-pelan dari atas ke bagian
  // yang memang sengaja dituju cuma menunda pembacanya.
  const hash = route.hash.replace(/^#/, '')

  if (hash)
    scrollToHeading(hash, 'auto')
})

watch(slug, load)

/*
 | Klik gambar untuk memperbesar.
 |
 | Tangkapan layar panduan sengaja disempitkan penulisnya (320/560px)
 | supaya tidak menenggelamkan teks di sekitarnya — dan itu benar untuk
 | membaca alurnya, tapi salah tepat pada saat pembacanya berhenti untuk
 | mencocokkan satu tombol kecil dengan layarnya sendiri. Tanpa ini
 | satu-satunya jalan adalah membuka gambar di tab baru lewat klik
 | kanan, dan itu membuang tempat pembacanya berada di artikel.
 |
 | Lewat delegasi pada wadahnya, bukan handler per gambar: isinya
 | dirender `v-html`, jadi tidak ada satu pun `<img>` di sini yang bisa
 | dipasangi listener.
 */
const lightbox = ref<{ src: string, alt: string } | null>(null)

function onArticleClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null

  if (!(target instanceof HTMLImageElement))
    return

  lightbox.value = {
    src: target.currentSrc || target.src,
    alt: target.alt || '',
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape')
    lightbox.value = null
}

watch(slug, () => {
  lightbox.value = null
})

onMounted(() => {
  load()
  loadNav()

  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  observer?.disconnect()

  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <main class="mx-auto w-full max-w-[88rem] px-4 py-8 md:px-6">
    <!--
      Tiga kolom di layar lebar: navigasi artikel, isi, daftar isi.
      Di bawah `xl` daftar isi hilang lebih dulu (isinya bisa
      digulir), di bawah `lg` sidebar ikut hilang dan tombol Kembali
      yang menggantikannya — tiga kolom di layar sempit berarti kolom
      isi tinggal selebar beberapa kata.
    -->
    <div class="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_220px]">
      <aside class="hidden lg:sticky lg:top-6 lg:block lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto">
        <NuxtLink
          to="/help"
          class="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft class="size-4" />
          Help Center
        </NuxtLink>

        <nav class="space-y-1">
          <div v-for="category in categories" :key="category.code">
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium transition-colors hover:bg-accent/50"
              @click="openCategory = openCategory === category.code ? null : category.code"
            >
              <ChevronRight
                class="size-3.5 shrink-0 transition-transform"
                :class="openCategory === category.code ? 'rotate-90' : ''"
              />
              <span class="min-w-0 truncate">{{ category.name }}</span>
            </button>

            <div v-if="openCategory === category.code" class="ml-4 mt-0.5 space-y-0.5 border-l pl-2">
              <NuxtLink
                v-for="item in category.articles"
                :key="item.slug"
                :to="`/help/${item.slug}`"
                class="block rounded-md px-2 py-1.5 text-sm transition-colors"
                :class="item.slug === slug
                  ? 'bg-accent font-medium text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'"
              >
                {{ item.title }}
              </NuxtLink>
            </div>
          </div>
        </nav>
      </aside>

      <div class="min-w-0">
        <NuxtLink
          to="/help"
          class="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground lg:hidden"
        >
          <ChevronLeft class="size-4" />
          Kembali ke Help Center
        </NuxtLink>

        <div v-if="pending" class="space-y-4">
          <Skeleton class="h-9 w-2/3" />
          <Skeleton class="h-4 w-1/3" />
          <Skeleton class="h-64 w-full" />
        </div>

        <div
          v-else-if="notFound"
          class="rounded-lg border border-dashed p-10 text-center"
        >
          <p class="font-medium">
            Artikel tidak ditemukan.
          </p>
          <p class="mt-1 text-sm text-muted-foreground">
            Tautannya mungkin sudah berubah, atau artikelnya ditarik kembali
            jadi draft.
          </p>
        </div>

        <article v-else-if="article">
          <header class="border-b pb-5">
            <p class="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon
                v-if="article.category?.icon"
                :name="article.category.icon"
                class="size-4"
              />
              {{ article.category?.name }}
            </p>

            <h1 class="mt-2 text-3xl font-semibold leading-tight">
              {{ article.title }}
            </h1>

            <p v-if="article.summary" class="mt-2 text-muted-foreground">
              {{ article.summary }}
            </p>

            <div class="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span>Diperbarui {{ formatDate(article.updated_at) }}</span>
              <span class="flex items-center gap-1">
                <Eye class="size-3.5" />
                {{ article.view_count }} kali dibaca
              </span>
            </div>
          </header>

          <a
            v-if="article.video_url"
            :href="article.video_url"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-6 flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
          >
            <Video class="size-5 text-primary" />
            <span class="text-sm font-medium">Tonton video panduannya</span>
          </a>

          <!--
        `v-html` dengan isi buatan penulis artikel. Amannya bukan dari
        sini: isi dibersihkan `sanitize_html()` di backend **saat
        disimpan**, jadi yang tersimpan di database sudah bebas script
        dan atribut event. Membersihkannya di sini saja berarti setiap
        pembaca baru (ekspor, cetak) harus ingat melakukannya lagi.
      -->
          <div
            class="help-article mt-6 text-[15px] leading-relaxed"
            @click="onArticleClick"
            v-html="article.content"
          />

          <!-- Feedback -->
          <section class="mt-10 rounded-lg border bg-muted/30 p-5">
            <p class="font-medium">
              Apakah panduan ini membantu?
            </p>

            <div class="mt-3 flex flex-wrap items-center gap-2">
              <Button
                :variant="article.my_feedback === true ? 'default' : 'outline'"
                size="sm"
                :disabled="sending"
                @click="vote(true)"
              >
                <ThumbsUp class="mr-2 size-4" />
                Ya
                <span v-if="article.helpful_count" class="ml-1.5 opacity-70">
                  {{ article.helpful_count }}
                </span>
              </Button>

              <Button
                :variant="article.my_feedback === false ? 'default' : 'outline'"
                size="sm"
                :disabled="sending"
                @click="vote(false)"
              >
                <ThumbsDown class="mr-2 size-4" />
                Belum
                <span v-if="article.not_helpful_count" class="ml-1.5 opacity-70">
                  {{ article.not_helpful_count }}
                </span>
              </Button>
            </div>

            <div v-if="showComment" class="mt-4 space-y-3">
              <Textarea
                v-model="comment"
                :rows="3"
                placeholder="Bagian mana yang kurang jelas, atau apa yang Anda cari tapi tidak ada di sini?"
              />

              <div class="flex gap-2">
                <Button size="sm" :disabled="sending" @click="vote(false)">
                  Kirim masukan
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  :disabled="sending"
                  @click="showComment = false"
                >
                  Batal
                </Button>
              </div>
            </div>
          </section>

          <!-- Artikel sebelum/sesudah dalam kategori yang sama -->
          <nav
            v-if="article.previous || article.next"
            class="mt-8 grid gap-3 sm:grid-cols-2"
          >
            <NuxtLink
              v-if="article.previous"
              :to="`/help/${article.previous.slug}`"
              class="rounded-lg border p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <span class="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ArrowLeft class="size-3.5" />
                Sebelumnya
              </span>
              <span class="mt-1 block text-sm font-medium">
                {{ article.previous.title }}
              </span>
            </NuxtLink>

            <NuxtLink
              v-if="article.next"
              :to="`/help/${article.next.slug}`"
              class="rounded-lg border p-4 text-right transition-colors hover:border-primary/40 hover:bg-accent/40 sm:col-start-2"
            >
              <span class="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                Berikutnya
                <ArrowRight class="size-3.5" />
              </span>
              <span class="mt-1 block text-sm font-medium">
                {{ article.next.title }}
              </span>
            </NuxtLink>
          </nav>
        </article>
      </div>

      <!--
        ON THIS PAGE. Daftar isinya datang dari backend
        (`build_outline`), yang sekalian menanamkan id pada tiap
        heading — menurunkannya di sini berarti dua penurun anchor
        yang harus tetap sama, dan tautan yang dibagikan orang akan
        mendarat di tempat berbeda tergantung dari mana ia dibuat.

        Hilang di bawah `xl`, dan artikel tanpa heading tidak
        merendernya sama sekali: kotak berjudul "Di halaman ini" yang
        isinya kosong terbaca seperti gagal memuat.
      -->
      <aside
        v-if="article?.toc?.length"
        class="hidden xl:sticky xl:top-6 xl:block xl:self-start"
      >
        <p class="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Di halaman ini
        </p>

        <!--
          Tautan `<a href="#id">`, bukan tombol. Bedanya bukan
          kosmetik: tombol tidak mengubah URL, jadi bagian tertentu
          dari sebuah panduan **tidak bisa dibagikan** — dan justru itu
          yang orang lakukan dengan halaman bantuan ("baca bagian
          Tanggalnya bentrok"). Klik kanan pada tombol juga tidak
          memberi "Copy link address", dan tengah-klik tidak membuka
          tab baru.

          `@click.prevent` tetap ada karena lompatan bawaan browser
          menempelkan heading ke tepi paling atas viewport, dan di sana
          ia tertutup header aplikasi. Untuk tautan yang dibuka dari
          luar halaman (disalin ke rekan), yang menanganinya
          `scroll-margin-top` di bagian style.
        -->
        <nav class="space-y-1 border-l">
          <a
            v-for="item in article.toc"
            :key="item.id"
            :href="`#${item.id}`"
            class="-ml-px block w-full border-l-2 py-1 text-left text-sm transition-colors"
            :class="[
              item.level > 1 ? 'pl-5' : 'pl-3',
              activeHeading === item.id
                ? 'border-primary font-medium text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            ]"
            @click.prevent="goToHeading(item.id)"
          >
            {{ item.text }}
          </a>
        </nav>
      </aside>
    </div>
    <!--
      Gambar yang diperbesar.
      Ditulis di sini, bukan lewat komponen dialog: yang dibutuhkan cuma
      satu lapisan gelap berisi satu gambar, dan dialog bawaan membawa
      kotak berlatar kartu yang justru membingkai tangkapan layar dengan
      bingkai kedua.

      `alt` dipakai apa adanya sebagai keterangan — penulis artikel
      mengisinya dengan nama berkas atau penjelasan langkahnya, dan
      keduanya lebih berguna daripada tidak ada tulisan sama sekali.
    -->
    <div
      v-if="lightbox"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      @click="lightbox = null"
    >
      <img
        :src="lightbox.src"
        :alt="lightbox.alt"
        class="max-h-[88vh] max-w-full rounded-md object-contain shadow-2xl"
      >

      <p class="text-xs text-white/70">
        {{ lightbox.alt || 'Gambar' }} · klik di mana saja atau tekan Esc untuk menutup
      </p>
    </div>
  </main>
</template>

<style scoped>
/*
  Proyek ini tidak memakai plugin typography Tailwind, jadi HTML
  artikel tidak mendapat gaya apa pun secara bawaan — tanpa aturan di
  bawah ini seluruh panduan tampil sebagai satu blok teks tanpa jarak
  antarparagraf dan daftar bernomornya kehilangan angkanya.
*/
.help-article :deep(p) {
  margin: 0.85rem 0;
}

/*
  `scroll-margin-top` supaya heading yang dituju anchor tidak berhenti
  persis di bawah header aplikasi. `scrollToHeading` sudah menghitung
  offset-nya sendiri, tapi tautan `#anchor` yang dibuka dari luar
  halaman (dibagikan ke rekan) tidak lewat fungsi itu.
*/
.help-article :deep(h2),
.help-article :deep(h3),
.help-article :deep(h4) {
  scroll-margin-top: 6rem;
}

.help-article :deep(h2) {
  margin: 1.75rem 0 0.6rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.help-article :deep(h3) {
  margin: 1.5rem 0 0.5rem;
  font-size: 1.05rem;
  font-weight: 600;
}

/*
  Video sematan. Tanpa rasio dan lebar eksplisit, iframe memakai
  ukuran bawaan browser (300×150) — videonya masuk tapi terlihat
  seperti pita kecil di tengah artikel, dan pembacanya menyangka
  sematannya rusak.
*/
.help-article :deep(iframe) {
  display: block;
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
  margin: 1.25rem 0;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
}

.help-article :deep(ul) {
  margin: 0.75rem 0;
  padding-left: 1.35rem;
  list-style: disc;
}

.help-article :deep(ol) {
  margin: 0.75rem 0;
  padding-left: 1.35rem;
  list-style: decimal;
}

.help-article :deep(li) {
  margin: 0.35rem 0;
}

/*
  TipTap menormalkan isi butir daftar jadi `<li><p>teks</p></li>`.
  Artinya begitu sebuah artikel disunting lewat editor — cepat atau
  lambat semuanya — tiap butir mendapat margin paragraf di dalamnya
  dan daftar langkah yang tadinya rapat jadi merenggang dua kali
  lipat. Bentuk tersimpannya berubah tanpa ada yang mengubah tulisan;
  yang terlihat cuma "kok jadi jarang-jarang".
*/
.help-article :deep(li > p) {
  margin: 0;
}

.help-article :deep(a) {
  color: var(--primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.help-article :deep(blockquote) {
  margin: 1rem 0;
  border-left: 3px solid var(--border);
  padding-left: 1rem;
  color: var(--muted-foreground);
}

/* Sorotan penulis artikel. Tanpa ini `mark` memakai kuning bawaan
   browser dengan warna teks yang diwarisi — di tema gelap itu teks
   terang di atas kuning terang, praktis tidak terbaca. Dipakukan ke
   token tema supaya keduanya ikut mode yang sedang aktif. */
.help-article :deep(mark) {
  border-radius: 0.25rem;
  background: color-mix(in oklch, var(--primary) 15%, transparent);
  padding: 0.05rem 0.3rem;
  color: inherit;
}

.help-article :deep(code) {
  border-radius: 0.25rem;
  background: var(--muted);
  padding: 0.1rem 0.35rem;
  font-size: 0.875em;
}

.help-article :deep(pre) {
  overflow-x: auto;
  margin: 1rem 0;
  border-radius: 0.375rem;
  background: var(--muted);
  padding: 0.75rem 1rem;
}

.help-article :deep(table) {
  width: 100%;
  margin: 1rem 0;
  border-collapse: collapse;
  font-size: 0.9em;
}

.help-article :deep(th),
.help-article :deep(td) {
  border: 1px solid var(--border);
  padding: 0.5rem 0.75rem;
  text-align: left;
  vertical-align: top;
}

.help-article :deep(th) {
  background: var(--muted);
  font-weight: 600;
}

.help-article :deep(img) {
  max-width: 100%;
  border-radius: 0.375rem;

  /* Satu-satunya petunjuk bahwa gambarnya bisa ditekan. Tanpa ini
     pembacanya tidak punya alasan mencobanya, dan fiturnya sama saja
     dengan tidak ada. */
  cursor: zoom-in;
}

.help-article :deep(hr) {
  margin: 1.5rem 0;
  border-top: 1px solid var(--border);
}
</style>
