<script setup lang="ts">
/**
 * Pratinjau notifikasi di kolom kanan beranda.
 *
 * **Bukan pusat notifikasi kedua.** Yang bisa ditandai terbaca, dibuka
 * satu-satu, dan dibersihkan tetap bel di header (`NotificationBell`);
 * di sini cuma daftar ringkas supaya orang tahu ada yang baru tanpa
 * membuka apa pun. Baris yang membawa tautan bisa ditekan untuk
 * menuju dokumennya — itu yang dulu tidak ada sama sekali walau
 * `link`-nya sudah dikirim backend sejak awal.
 *
 * Kartunya sendiri (kepala, badge, lipat) milik
 * `CollapsibleUtilityCard`; berkas ini hanya isinya.
 */
import type { NotificationItem } from '../types'

const props = withDefaults(
  defineProps<{
    items: NotificationItem[]
    /**
     * Beranda adalah pratinjau, bukan arsip.
     *
     * Backend mengirim sepuluh baris terakhir; menampilkan semuanya di
     * kolom kanan membuat kartu ini sendirian lebih tinggi daripada
     * launcher di sebelahnya, dan yang di bawahnya tidak pernah
     * terlihat tanpa menggulir. Sisanya ada di bel header.
     */
    limit?: number
  }>(),
  { limit: 5 },
)

const visibleItems = computed(() => props.items.slice(0, props.limit))

/*
 * Warna titik mengikuti bel di header, bukan palet baru: notifikasi
 * yang sama tidak boleh berwarna berbeda di dua tempat.
 */
const TYPE_DOT: Record<string, string> = {
  info: 'bg-sky-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-rose-500',
}

function dotClass(type: string) {
  return TYPE_DOT[type] ?? TYPE_DOT.info
}

/**
 * `resolveComponent`, bukan string `'NuxtLink'` di `:is` — nama yang
 * cuma berupa string tidak ikut ditransformasi auto-import, dan
 * barisnya jadi terlihat bisa ditekan tanpa melakukan apa pun.
 */
const linkTag = computed(() => resolveComponent('NuxtLink'))
</script>

<template>
  <div>
    <ul v-if="visibleItems.length" class="divide-y">
      <li v-for="item in visibleItems" :key="item.id">
        <component
          :is="item.href ? linkTag : 'div'"
          :to="item.href"
          class="flex items-start gap-2 py-2 text-left"
          :class="item.href ? 'transition-colors hover:text-foreground' : ''"
        >
          <!--
            Titik hanya untuk yang belum dibaca. Titik abu-abu di
            seluruh baris membuat "belum dibaca" berhenti jadi tanda.
          -->
          <span
            class="mt-1.5 size-2 shrink-0 rounded-full"
            :class="item.is_read ? 'bg-transparent' : dotClass(item.type)"
          />

          <span class="min-w-0 flex-1">
            <span
              class="block truncate text-sm"
              :class="item.is_read ? 'text-muted-foreground' : 'font-medium'"
            >
              {{ item.title }}
            </span>

            <span
              v-if="item.description"
              class="mt-0.5 block line-clamp-2 text-xs text-muted-foreground"
            >
              {{ item.description }}
            </span>

            <span class="mt-0.5 block text-[11px] text-muted-foreground">
              {{ item.created_at }}
            </span>
          </span>
        </component>
      </li>
    </ul>

    <!--
      Daftar kosong itu keadaan yang sah — sampai tugas harian pengingat
      dinyalakan, memang belum ada baris `Notification` yang ditulis.
      Kotak kosong tanpa keterangan terbaca seperti gagal memuat.
    -->
    <p v-else class="py-4 text-center text-xs text-muted-foreground">
      {{ $t('home.notifications.empty') }}
    </p>
  </div>
</template>
