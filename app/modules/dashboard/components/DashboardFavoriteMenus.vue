<script setup lang="ts">
import draggable from 'vuedraggable'
import { ArrowRight, GripVertical, Search, Star } from 'lucide-vue-next'
import type { FavoriteMenu } from '../types'

const props = defineProps<{
  items: FavoriteMenu[]
  isCustomizing?: boolean
}>()

const emit = defineEmits<{
  'update:items': [value: FavoriteMenu[]]
  'toggle-menu': [code: string]
}>()

const query = ref('')

/**
 * `resolveComponent`, **bukan** string `'NuxtLink'` di `:is`.
 *
 * Komponen Nuxt di-auto-import saat kompilasi template; nama yang cuma
 * muncul sebagai string tidak ikut ditransformasi, jadi
 * `resolveDynamicComponent('NuxtLink')` tidak menemukannya dan
 * memperlakukannya sebagai **elemen HTML biasa**. Hasilnya `<nuxtlink>`
 * yang tampil normal, bisa di-hover, dan **tidak melakukan apa pun saat
 * diklik** — tanpa satu pun error. Pola yang sudah benar sejak lama di
 * `MasterHubCard.vue`.
 */
const rowTag = computed(() =>
  props.isCustomizing ? 'div' : resolveComponent('NuxtLink'),
)

const localItems = computed({
  get: () => props.items,
  set: value => emit('update:items', value),
})

/**
 * Katalognya seluruh menu yang boleh dilihat pengguna — untuk superuser
 * itu 45 baris. Tanpa kotak cari, memilih satu pintasan berarti memindai
 * daftar sepanjang layar.
 *
 * Dicocokkan ke judul **maupun** nama grupnya: orang mencari "Leave",
 * tapi juga "Attendance" untuk melihat apa saja isi kelompok itu.
 */
const shown = computed(() => {
  const keyword = query.value.trim().toLowerCase()

  if (!keyword) return new Set(props.items.map(item => item.code))

  return new Set(
    props.items
      .filter(item => `${item.title} ${item.description}`.toLowerCase().includes(keyword))
      .map(item => item.code),
  )
})

/**
 * Drag dimatikan selama daftarnya tersaring.
 *
 * `vuedraggable` mengembalikan urutan **daftar yang dirender**; kalau
 * yang dirender cuma hasil pencarian, menyimpannya akan membuang
 * seluruh baris yang sedang tidak cocok — tanpa satu pun pesan.
 */
const isDraggable = computed(() => Boolean(props.isCustomizing) && !query.value.trim())

function handleClick(event: MouseEvent) {
  if (props.isCustomizing)
    event.preventDefault()
}
</script>

<template>
  <section>
    <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <h2 class="text-lg font-semibold">Favorite Menus</h2>
        <Badge variant="secondary">{{ items.length }}</Badge>
      </div>

      <!--
        Kotak cari hanya saat menyusun: di luar mode itu yang tampil cuma
        pintasan pilihannya sendiri, dan mencari di antara lima kartu
        yang semuanya terlihat tidak ada gunanya.
      -->
      <div v-if="isCustomizing" class="relative w-full sm:w-56">
        <Search class="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input v-model="query" placeholder="Cari menu…" class="h-9 pl-8" />
      </div>
    </div>

    <div class="rounded-2xl border bg-card p-4">
      <!--
        Kosong itu dua keadaan yang berbeda, dan keduanya perlu kalimat
        sendiri: pencarian yang tidak ketemu vs pintasan yang memang
        belum dipilih. Satu pesan untuk keduanya membuat orang mengira
        datanya gagal dimuat.
      -->
      <p v-if="!shown.size" class="py-6 text-center text-sm text-muted-foreground">
        <template v-if="query.trim()">
          Tidak ada menu yang cocok dengan "{{ query }}".
        </template>
        <template v-else-if="isCustomizing">
          Tidak ada menu yang bisa dijadikan pintasan untuk akun Anda.
        </template>
        <template v-else>
          Belum ada pintasan. Tekan Customize untuk memilihnya.
        </template>
      </p>

      <draggable
        v-else
        v-model="localItems"
        item-key="code"
        handle=".menu-drag-handle"
        :disabled="!isDraggable"
        class="grid max-h-104 gap-3 overflow-y-auto sm:grid-cols-2 xl:grid-cols-3"
        ghost-class="opacity-40"
      >
        <!--
          Slot `#item` harus berisi **tepat satu** anak, dan komentar pun
          ikut dihitung: `vuedraggable` menghitung vnode, sementara Vue
          merender komentar template jadi vnode tersendiri di mode dev.
          Satu baris keterangan di dalam sini menjatuhkan seluruh halaman
          dengan "Item slot must have only one child" — jadi
          keterangannya ditulis di luar slotnya.

          Yang perlu diketahui soal `v-show` di bawah: baris yang tidak
          lolos pencarian tetap ikut dirender (`draggable` merender
          seluruh `v-model`), jadi disembunyikan — bukan dibuang dari
          daftarnya — supaya urutan yang tersimpan tidak ikut berubah.
        -->
        <template #item="{ element: menu }">
          <component
            :is="rowTag"
            v-show="shown.has(menu.code)"
            :to="isCustomizing ? undefined : menu.href"
            class="flex items-center gap-3 rounded-xl p-2 transition"
            :class="
              isCustomizing
                ? (menu.favorite === false ? 'opacity-50' : '')
                : 'hover:bg-muted/60'
            "
            @click="handleClick"
          >
            <button
              v-if="isDraggable"
              type="button"
              class="menu-drag-handle shrink-0 cursor-grab rounded-md p-1 text-muted-foreground hover:text-foreground"
              aria-label="Geser posisi"
            >
              <GripVertical class="size-4" />
            </button>

            <div
              class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15"
            >
              <component :is="menu.icon" v-if="menu.icon" class="size-5" />
            </div>

            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium">{{ menu.title }}</p>
              <p class="truncate text-xs text-muted-foreground">{{ menu.description }}</p>
            </div>

            <!--
              Bintang, sama seperti Applications dan Quick Actions.
              Sebelumnya tidak ada satu pun cara memilih pintasan dari
              layar: barisnya cuma bisa lahir dari seed.
            -->
            <button
              v-if="isCustomizing"
              type="button"
              class="shrink-0 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted"
              :aria-label="menu.favorite === false ? 'Jadikan pintasan' : 'Buang dari pintasan'"
              @click="emit('toggle-menu', menu.code)"
            >
              <Star
                class="size-4"
                :class="menu.favorite === false ? '' : 'fill-amber-400 text-amber-500'"
              />
            </button>

            <ArrowRight v-else class="size-4 shrink-0 text-muted-foreground" />
          </component>
        </template>
      </draggable>
    </div>
  </section>
</template>
