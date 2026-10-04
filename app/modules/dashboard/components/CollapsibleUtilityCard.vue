<script setup lang="ts">
import type { Component } from 'vue'

/**
 * Kartu kecil di kolom kanan beranda: kepala yang bisa ditekan, isinya
 * yang muncul/hilang.
 *
 * Satu komponen untuk ketiganya (Approval, Notifications, Recent
 * Documents) — tiga salinan logika lipat yang sama adalah tiga tempat
 * yang bisa berbeda perilakunya besok.
 *
 * **Bukan `Card` shadcn.** Kartu itu ber-`py-6 px-6`; tiga kartu
 * seperti itu ditumpuk di kolom selebar 320px menghabiskan 100px hanya
 * untuk ruang kosong di dalam kepalanya.
 */
import { ChevronDown } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    title: string
    icon?: Component
    /** Angka kecil di kanan judul. `0`/undefined = tidak ada badge. */
    count?: number
    /**
     * Keadaan awal **sebelum** preferensi pengguna dibaca.
     *
     * Bawaan beranda: Approval dan Notifications tertutup, Recent
     * Documents terbuka. Yang paling sering dibaca berdiri terbuka;
     * dua sisanya cukup angkanya yang terlihat.
     */
    defaultOpen?: boolean
    /**
     * Kunci penyimpanan preferensi lipat. Kosong = tidak disimpan.
     *
     * `localStorage`, bukan tabel baru di backend: ini keadaan tampilan
     * satu kolom di satu halaman, dan menyimpannya ke server berarti
     * satu request tiap kali ada yang menekan kepala kartu.
     */
    storageKey?: string
  }>(),
  { defaultOpen: false },
)

const open = ref(props.defaultOpen)

/*
 * Preferensi dibaca **sesudah** render pertama, bukan saat setup.
 *
 * Halaman ini dirender di server, dan `localStorage` tidak ada di
 * sana. Membacanya saat setup membuat markup server (selalu bawaan)
 * berbeda dari markup klien (preferensi pengguna), dan Vue membuang
 * seluruh pohon itu saat hydration sambil menulis peringatan mismatch.
 */
onMounted(() => {
  if (!props.storageKey)
    return

  try {
    const saved = window.localStorage.getItem(props.storageKey)

    if (saved === 'true' || saved === 'false')
      open.value = saved === 'true'
  }
  catch {
    // Mode privat / storage dimatikan: bawaan saja. Kegagalan membaca
    // preferensi tampilan tidak boleh menjatuhkan kartunya.
  }
})

watch(open, (value) => {
  if (!props.storageKey || !import.meta.client)
    return

  try {
    window.localStorage.setItem(props.storageKey, String(value))
  }
  catch {
    // Sama seperti di atas: preferensi hilang, kartunya tetap jalan.
  }
})
</script>

<template>
  <Collapsible
    v-model:open="open"
    class="rounded-xl border bg-card shadow-sm"
  >
    <div class="flex items-center gap-1 px-3 py-2">
      <CollapsibleTrigger as-child>
        <button
          type="button"
          class="flex min-w-0 flex-1 items-center gap-2 rounded-md py-1 text-left outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          :aria-label="
            open
              ? $t('home.utility.collapse', { title })
              : $t('home.utility.expand', { title })
          "
        >
          <component
            :is="icon"
            v-if="icon"
            class="size-4 shrink-0 text-muted-foreground"
          />

          <span class="truncate text-sm font-medium">{{ title }}</span>

          <span class="ml-auto flex shrink-0 items-center gap-1.5">
            <Badge
              v-if="count"
              variant="secondary"
              class="h-5 min-w-5 justify-center px-1.5 text-[11px] tabular-nums"
            >
              {{ count }}
            </Badge>

            <!--
              Arah panah = keadaan kartunya, dan itu satu-satunya
              penanda yang punya. Chevron yang tidak berputar membuat
              kepala kartu terbaca sama persis saat terbuka dan saat
              tertutup.
            -->
            <ChevronDown
              class="size-4 text-muted-foreground transition-transform duration-150"
              :class="open ? 'rotate-180' : ''"
            />
          </span>
        </button>
      </CollapsibleTrigger>

      <!-- Kendali tambahan (mis. tombol sembunyikan saat Customize). -->
      <slot name="actions" />
    </div>

    <CollapsibleContent>
      <div class="border-t px-3 py-2.5">
        <slot />
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>
