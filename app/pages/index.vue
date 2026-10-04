<script setup lang="ts">
definePageMeta({
  showGlobalSearch: true,
})

import { Eye, EyeOff, RotateCcw, Settings2 } from 'lucide-vue-next'

import { DashboardHeader } from '~/modules/dashboard/'
import CollapsibleUtilityCard from '~/modules/dashboard/components/CollapsibleUtilityCard.vue'
import DashboardWidgetFrame from '~/modules/dashboard/components/DashboardWidgetFrame.vue'
import { pendingApprovalCount } from '~/modules/dashboard/mapper'
import {
  resolveWidgetComponent,
  UTILITY_CODES,
  UTILITY_WIDGETS,
  widgetHeightClass,
  widgetSpanClass,
} from '~/modules/dashboard/registry'
import { useDashboard } from '~/modules/dashboard/composables/useDashboard'

const {
  workspace,
  layout,
  favoriteApps,
  favoriteMenus,
  toggleFavoriteMenu,
  quickActions,
  toggleQuickAction,
  visibleWidgets,
  isCustomizing,
  isLoading,
  error,
  toggleFavorite,
  moveWidget,
  toggleWidgetVisible,
  toggleWidgetCollapsed,
  saveLayout,
  resetLayout,
} = useDashboard()

/**
 * KPI berdiri **di luar** grid dua kolom, selebar halaman.
 *
 * Bukan preferensi tata letak: empat angka itu ringkasan seluruh
 * beranda, dan begitu ia ikut masuk kolom kiri, lebarnya ditentukan
 * oleh kartu utility di sebelahnya — di 1024px keempatnya terlipat
 * jadi 2x2 setinggi dua baris hanya karena ada kolom selebar 320px
 * yang isinya tiga kepala kartu terlipat.
 *
 * Disematkan di halaman ini, bukan dengan mengubah katalog backend:
 * susunan yang sudah tersimpan pengguna tidak ikut berubah oleh
 * katalog, jadi mengubahnya di sana hanya menolong akun yang belum
 * pernah menekan Save.
 */
const KPI_CODE = 'kpi'

/**
 * Prop tiap widget dirakit di sini, bukan di dalam komponennya.
 *
 * Konsekuensi dari merender lewat registry: komponennya dipilih dari
 * string, jadi tidak ada tempat lain yang tahu widget mana butuh data
 * apa. Kunci di peta ini **harus** cocok dengan `code` di
 * `HOME_WIDGETS` sisi backend — kode yang tidak ada di sini dirender
 * tanpa prop, bukan gagal.
 */
function propsFor(code: string): Record<string, unknown> {
  switch (code) {
    case 'kpi':
      return { items: workspace.value.kpis }

    case 'favorite_menus':
      // `favoriteMenus`, bukan `workspace.favoriteMenus`: yang pertama
      // sudah menyaring ke pilihan pengguna di luar mode Customize —
      // isinya sekarang seluruh katalog menu, bukan lagi lima pintasan
      // hasil seed.
      return {
        items: favoriteMenus.value,
        isCustomizing: isCustomizing.value,
      }

    case 'quick_actions':
      return {
        items: quickActions.value,
        isCustomizing: isCustomizing.value,
      }

    case 'approval_chart':
      return { charts: workspace.value.charts }

    case 'notifications':
      return { items: workspace.value.notifications }

    case 'recent_documents':
      return { items: workspace.value.workflows }

    case 'applications':
      return {
        items: favoriteApps.value,
        isCustomizing: isCustomizing.value,
        loading: isLoading.value,
      }

    default:
      return {}
  }
}

/**
 * Dua widget menyusun ulang daftarnya sendiri (`v-model:items`).
 *
 * Dicocokkan per kode, bukan "yang bukan applications berarti menu":
 * widget ketiga yang besok ikut memancarkan `update:items` akan
 * menimpa daftar menu favorit tanpa ada yang menyadarinya.
 */
function onItemsUpdate(code: string, items: unknown) {
  if (code === 'applications') {
    workspace.value.favoriteApps = items as never
    return
  }

  if (code === 'favorite_menus') {
    workspace.value.favoriteMenus = items as never
  }
}

/**
 * Isi kolom kiri: seluruh widget yang **bukan** penghuni kolom utility.
 *
 * Komponennya di-resolve sekali di sini, bukan dua kali di template.
 * Widget yang komponennya tidak ada di registry dibuang dari daftar —
 * backend bisa saja lebih dulu di-deploy daripada frontend, dan beranda
 * yang kehilangan satu kartu jauh lebih baik daripada beranda yang
 * blank.
 */
const mainCards = computed(() =>
  visibleWidgets.value
    .filter(widget => !UTILITY_CODES.includes(widget.code))
    .map(widget => ({
      widget,
      component: resolveWidgetComponent(widget.component),
    }))
    .filter(card => card.component),
)

const kpiCard = computed(() =>
  mainCards.value.find(card => card.widget.code === KPI_CODE),
)

/**
 * Isi kolom kiri di bawah KPI, urut susunan pengguna: Favorite Menus,
 * Quick Actions, lalu Application Launcher.
 */
const stackedCards = computed(() =>
  mainCards.value.filter(card => card.widget.code !== KPI_CODE),
)

/**
 * Kode yang boleh saling ditukar posisinya oleh tombol naik/turun.
 *
 * KPI tidak ikut (disematkan di atas, selebar halaman), begitu pula
 * ketiga kartu kolom kanan — menukar widget dengan tetangga yang
 * dirender di kolom lain menghasilkan tombol yang tidak melakukan apa
 * pun di layar.
 */
const mainScope = computed(() => stackedCards.value.map(card => card.widget.code))

/**
 * Tiga kartu kolom kanan, urut sesuai `UTILITY_WIDGETS`.
 *
 * Kartu yang widget-nya disembunyikan pengguna lewat Customize tetap
 * tidak ditampilkan — kolomnya berganti bentuk, haknya tidak. Selama
 * katalog layout belum selesai dimuat (`layout` masih kosong)
 * ketiganya tetap berdiri, supaya kolom kanan tidak berkedip dari
 * kosong ke tiga kartu sesudah request pertama mendarat.
 */
const utilityCards = computed(() =>
  UTILITY_WIDGETS
    .map(meta => ({
      meta,
      widget: layout.value.find(item => item.code === meta.code),
    }))
    .filter(entry =>
      entry.widget
        ? isCustomizing.value || entry.widget.is_visible !== false
        : !layout.value.length,
    ),
)

/**
 * Angka kecil di kepala kartu saat terlipat.
 *
 * Ketiganya dihitung dari data yang **sudah** ada di beranda, bukan
 * dari permintaan baru: hitungan yang tidak akan cocok dengan isi
 * kartunya sendiri begitu dibuka lebih buruk daripada tidak ada angka
 * sama sekali.
 */
function utilityCount(code: string): number {
  if (code === 'approval_chart')
    return pendingApprovalCount(workspace.value.charts)

  if (code === 'notifications')
    return workspace.value.notifications.filter(item => !item.is_read).length

  if (code === 'recent_documents')
    return workspace.value.workflows.length

  return 0
}
</script>

<template>
  <main class="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
    <DashboardHeader :highlights="workspace.highlights">
      <div class="flex items-center gap-2">
        <template v-if="isCustomizing">
          <Button variant="ghost" size="sm" @click="resetLayout">
            <RotateCcw class="mr-2 h-4 w-4" />
            {{ $t('common.actions.reset') }}
          </Button>

          <!--
            Disimpan saat Done, bukan tiap geseran: satu tarikan
            menghasilkan puluhan perubahan posisi, dan menyimpan tiap
            perubahan berarti puluhan request untuk satu gerakan.
          -->
          <Button variant="outline" size="sm" @click="saveLayout">
            {{ $t('common.actions.save') }}
          </Button>
        </template>

        <Button variant="ghost" size="sm" @click="isCustomizing = !isCustomizing">
          <Settings2 class="mr-2 h-4 w-4" />
          {{ isCustomizing ? $t('home.actions.done') : $t('home.actions.customize') }}
        </Button>
      </div>
    </DashboardHeader>

    <!--
      Kegagalan memuat ditampilkan, bukan cuma dicatat di konsol.
      Sebelumnya `error` dari `useDashboard` tidak dirender di mana pun,
      dan beranda yang gagal memuat tampil persis seperti beranda milik
      akun baru: kosong, tanpa sebab.
    -->
    <p
      v-if="error"
      class="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
    >
      {{ error }}
    </p>

    <!--
      Baris KPI: selebar halaman, tepat di bawah kepala beranda, dan
      **di luar** grid dua kolom di bawahnya. Tombol naik/turun-nya
      mati (`is-first` + `is-last`) — itulah bentuk "disematkan" yang
      bisa dilihat orang; tombol yang tetap menyala tapi tidak
      menggeser apa pun jauh lebih membingungkan.
    -->
    <DashboardWidgetFrame
      v-if="kpiCard"
      :widget="kpiCard.widget"
      :is-customizing="isCustomizing"
      is-first
      is-last
      @toggle-visible="toggleWidgetVisible(kpiCard.widget.code)"
      @toggle-collapsed="toggleWidgetCollapsed(kpiCard.widget.code)"
    >
      <component
        :is="kpiCard.component"
        v-bind="propsFor(kpiCard.widget.code)"
      />
    </DashboardWidgetFrame>

    <!--
      Baru di bawah KPI halaman terbagi dua: pekerjaan di kiri,
      informasi operasional di kanan.

      Lebar kolom kanan dipatok (`20rem`/`22rem`) dan kolom kiri
      mengambil sisanya — bukan 75%/25% — supaya kartu utility punya
      lebar yang sama di layar 1280px dan 1600px. `minmax(0,1fr)` wajib
      di kolom kiri: `1fr` polos tidak pernah menyusut di bawah lebar
      isinya, dan satu judul dokumen panjang di dalamnya cukup untuk
      mendorong seluruh halaman melebar ke samping.

      Di bawah `lg` keduanya menumpuk: kolom kiri lebih dulu, tiga
      kartu utility di bawahnya.
    -->
    <div
      class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]"
    >
      <div class="min-w-0">
        <!--
          Sisa widget beranda tetap dirender dari susunan pengguna.
          Menambah widget untuk modul baru = satu baris di
          `HOME_WIDGETS` (backend) + satu baris di `registry.ts`;
          berkas ini tidak perlu disentuh.

          Grid 12 kolom dipertahankan walau seluruh widget hari ini
          ber-`span: 12`: widget berikutnya boleh menyebut 6 dan langsung
          berbagi baris dengan tetangganya.
        -->
        <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div
            v-for="(card, index) in stackedCards"
            :key="card.widget.code"
            :class="[
              widgetSpanClass(card.widget.span),
              widgetHeightClass(card.widget.fixed_height && !card.widget.is_collapsed),
            ]"
          >
            <DashboardWidgetFrame
              :widget="card.widget"
              :is-customizing="isCustomizing"
              :is-first="index === 0"
              :is-last="index === stackedCards.length - 1"
              @move="moveWidget(card.widget.code, $event, mainScope)"
              @toggle-visible="toggleWidgetVisible(card.widget.code)"
              @toggle-collapsed="toggleWidgetCollapsed(card.widget.code)"
            >
              <component
                :is="card.component"
                v-bind="propsFor(card.widget.code)"
                @update:items="onItemsUpdate(card.widget.code, $event)"
                @toggle-favorite="toggleFavorite"
                @toggle-menu="toggleFavoriteMenu"
                @toggle-action="toggleQuickAction"
              />
            </DashboardWidgetFrame>
          </div>
        </div>
      </div>

      <!--
        Kolom utility: status operasional, bukan navigasi. Ketiganya
        membuka/menutup sendiri-sendiri dan tingginya mengikuti isinya
        masing-masing — tiga kartu setinggi sama membuat yang kosong
        terbaca seperti gagal memuat.
      -->
      <aside class="space-y-3">
        <CollapsibleUtilityCard
          v-for="entry in utilityCards"
          :key="entry.meta.code"
          :title="$t(entry.meta.title)"
          :icon="entry.meta.icon"
          :count="utilityCount(entry.meta.code)"
          :default-open="entry.meta.defaultOpen"
          :storage-key="`meinova.home.utility.${entry.meta.code}`"
          :class="
            isCustomizing && entry.widget && !entry.widget.is_visible
              ? 'opacity-50'
              : ''
          "
        >
          <!--
            Menyembunyikan kartu tetap bisa dilakukan seperti dulu —
            kendalinya cuma pindah ke kepala kartunya, dan hanya muncul
            saat menyusun.
          -->
          <template v-if="isCustomizing && entry.widget" #actions>
            <Button
              variant="ghost"
              size="icon"
              class="size-7 shrink-0"
              :aria-label="
                entry.widget.is_visible
                  ? $t('home.utility.hide', { title: $t(entry.meta.title) })
                  : $t('home.utility.show', { title: $t(entry.meta.title) })
              "
              @click="toggleWidgetVisible(entry.meta.code)"
            >
              <component :is="entry.widget.is_visible ? Eye : EyeOff" class="size-4" />
            </Button>
          </template>

          <component
            :is="entry.meta.component"
            v-bind="propsFor(entry.meta.code)"
          />
        </CollapsibleUtilityCard>
      </aside>
    </div>
  </main>
</template>
