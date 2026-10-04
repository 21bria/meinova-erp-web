<script setup lang="ts">
/**
 * Satu aplikasi di launcher: ubin ikon + namanya di bawah.
 *
 * **Tidak punya kartu sendiri.** Yang terlihat cuma ubinnya; selnya
 * transparan. Kartu berbingkai per aplikasi membuat katalog modul
 * terbaca seperti kumpulan widget dashboard, dan yang dicari orang di
 * halaman depan adalah pintu masuknya, bukan ringkasan.
 *
 * Ubin punya dua keadaan, dan keduanya datang dari backend — bukan
 * dihitung di sini:
 *
 * * **bisa dibuka** — ikon berwarna, tautan sungguhan;
 * * **tidak bisa dibuka** — kelabu, tidak bisa ditekan, dengan tooltip
 *   yang menyebut sebabnya. Sebabnya dua macam dan kalimatnya berbeda:
 *   tidak punya hak akses (`accessible: false`) atau modulnya memang
 *   belum jalan untuk siapa pun (`available: false`).
 *
 * **Kelabu di sini bukan penjagaan.** Mengetik URL-nya tetap ditolak
 * backend — menu permission, DataScope, dan permission tiap endpoint
 * tidak berubah sedikit pun oleh berkas ini.
 *
 * **Tidak ada satu pun nama modul di berkas ini.** Ikon, warna, dan
 * bayangannya datang dari katalog backend lewat
 * `appRegistry`/`colorRegistry`; komponen ini cuma memakai token yang
 * sudah jadi. Modul baru besok tidak menyentuh berkas ini sama sekali.
 */
import type { FavoriteApplication } from '../types'

import { useI18n } from 'vue-i18n'

const props = defineProps<{
  app: FavoriteApplication
  /** Saat menyusun, ubinnya bukan tautan — lihat `tag`. */
  isCustomizing?: boolean
}>()

const { t, te } = useI18n()

/** Bisa ditekan hanya kalau modulnya jalan **dan** boleh dibuka. */
const isEnabled = computed(() =>
  props.app.accessible !== false && props.app.available !== false,
)

/**
 * `resolveComponent`, **bukan** string `'NuxtLink'` di `:is`.
 *
 * Nama komponen yang cuma muncul sebagai string tidak ikut
 * ditransformasi auto-import Nuxt: Vue merendernya sebagai elemen HTML
 * biasa, ubinnya tampil normal, kursornya berubah, dan **tidak
 * melakukan apa pun saat diklik** — tanpa satu pun error di konsol.
 * Pola yang benar sudah dipakai `DashboardQuickActions.vue`.
 */
const tag = computed(() =>
  props.isCustomizing || !isEnabled.value ? 'div' : resolveComponent('NuxtLink'),
)

/**
 * Sebab ubinnya mati, dalam kalimat yang dibaca pengguna.
 *
 * Urutannya penting: modul yang belum jalan dijawab lebih dulu, karena
 * tidak ada hak akses yang bisa membuka modul yang memang belum ada
 * isinya — "Anda tidak memiliki akses" di situ mengirim orang mengejar
 * admin untuk sesuatu yang tidak bisa diberikan siapa pun.
 */
const disabledReason = computed(() => {
  if (isEnabled.value)
    return ''

  if (props.app.available === false) {
    const key = `home.appStatus.${String(props.app.status ?? '').toLowerCase()}`

    return te(key) ? t(key) : t('home.launcher.unavailable')
  }

  return t('home.launcher.noAccess')
})

/**
 * Status non-aktif ditandai **satu titik kecil**, bukan pil bertulisan.
 *
 * "Coming soon" tidak muat di ubin selebar 64px dalam bahasa mana pun,
 * dan memotongnya jadi "Soon" menghasilkan kata yang tidak ada di
 * katalog terjemahan. Titiknya membawa label lengkapnya lewat teks
 * sr-only, jadi yang memakai pembaca layar tetap mendengarnya.
 *
 * Hanya untuk ubin yang **hidup** (mis. Payroll yang masih Beta): yang
 * mati sudah membawa sebabnya lewat tooltip, dan dua penanda untuk hal
 * yang sama cuma menambah ramai.
 */
const statusLabel = computed(() => {
  const status = props.app.status

  if (!status || status === 'ACTIVE' || !isEnabled.value)
    return ''

  // Saat menyusun, sudutnya sudah ditempati tombol bintang — dua
  // penanda di titik yang sama saling menimpa, dan yang tertimpa
  // justru tombolnya.
  if (props.isCustomizing)
    return ''

  const key = `home.appStatus.${status.toLowerCase()}`

  return te(key) ? t(key) : status
})
</script>

<template>
  <!--
    Tooltip membungkus seluruh ubin, bukan cuma ikonnya: yang ditunjuk
    orang saat bertanya "kenapa ini mati" bisa ikonnya **atau** namanya.
  -->
  <Tooltip v-if="!isEnabled" :delay-duration="150">
    <TooltipTrigger as-child>
      <component
        :is="tag"
        data-slot="application-launcher-item"
        :data-app-code="app.code"
        data-enabled="false"
        class="group flex cursor-not-allowed flex-col items-center gap-2.5 rounded-2xl px-1 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-disabled="true"
        tabindex="0"
        :aria-label="`${app.title} — ${disabledReason}`"
      >
        <!--
          Kelabu, bukan berwarna-yang-dipudarkan: identitas warna modul
          adalah janji "ini bisa dibuka". Yang dipudarkan sekitar
          setengah, cukup untuk terbaca sebagai mati tanpa membuat
          namanya berhenti terbaca.
        -->
        <span
          class="relative flex size-16 items-center justify-center overflow-hidden rounded-[1.35rem] bg-muted text-muted-foreground opacity-60 ring-1 ring-inset ring-border sm:size-18 sm:rounded-[1.5rem]"
        >
          <component
            :is="app.icon"
            v-if="app.icon"
            class="relative size-7 sm:size-8"
            :stroke-width="1.9"
          />
        </span>

        <span
          class="line-clamp-2 max-w-full text-center text-xs font-medium leading-tight text-muted-foreground sm:text-sm lg:text-xs xl:text-sm"
        >
          {{ app.title }}
        </span>
      </component>
    </TooltipTrigger>

    <TooltipContent>{{ disabledReason }}</TooltipContent>
  </Tooltip>

  <component
    :is="tag"
    v-else
    data-slot="application-launcher-item"
    :data-app-code="app.code"
    data-enabled="true"
    :to="isCustomizing ? undefined : app.href"
    class="group flex flex-col items-center gap-2.5 rounded-2xl px-1 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    :class="isCustomizing && !app.favorite ? 'opacity-40' : ''"
  >
    <!--
      Yang bergerak saat hover cuma ubinnya, bukan seluruh selnya:
      label yang ikut bergeser membuat baris nama tampak bergoyang
      saat kursor menyapu grid.

      Radius ditulis eksplisit (`rounded-[1.35rem]`), bukan
      `rounded-2xl`: `--radius` bisa diubah tema (`theme-rounded-none`
      menolkannya), dan ubin aplikasi yang berubah jadi kotak siku
      berhenti terbaca sebagai ikon aplikasi.

      `shadow-lg` + `glow` bersemu warna ubinnya: di latar putih
      beranda, bayangan abu-abu netral membuat ubin berwarna terlihat
      seperti ditempel, bukan terangkat.
    -->
    <span
      class="relative flex size-16 items-center justify-center overflow-hidden rounded-[1.35rem] bg-linear-to-br shadow-lg transition-[transform,box-shadow,filter] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:brightness-[1.06] sm:size-18 sm:rounded-[1.5rem]"
      :class="[
        app.color || 'from-muted via-muted to-muted text-muted-foreground',
        app.glow,
      ]"
    >
      <!--
        Kilau tipis di sisi atas + garis dalam seukuran satu piksel.

        Ini yang membedakan ubin aplikasi dari tombol berwarna:
        gradien diagonal saja masih terbaca rata, dan lapisan ini
        memberi sisi kiri-atas kesan tertimpa cahaya. Sengaja berhenti
        di `white/25` — di atasnya ubinnya mulai terlihat mengilap
        seperti ikon tahun 2010.
      -->
      <span
        class="pointer-events-none absolute inset-0 rounded-[inherit] bg-linear-to-b from-white/25 via-white/5 to-transparent"
        aria-hidden="true"
      />
      <span
        class="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/20"
        aria-hidden="true"
      />

      <component
        :is="app.icon"
        v-if="app.icon"
        class="relative size-7 text-white sm:size-8"
        :stroke-width="1.9"
      />

      <span
        v-if="statusLabel"
        class="absolute right-1.5 top-1.5 size-2.5 rounded-full bg-amber-400 ring-2 ring-white/40"
        :title="statusLabel"
      />

      <span v-if="statusLabel" class="sr-only">{{ statusLabel }}</span>
    </span>

    <span
      class="line-clamp-2 max-w-full text-center text-xs font-semibold leading-tight text-foreground/90 transition-colors group-hover:text-foreground sm:text-sm lg:text-xs xl:text-sm"
    >
      {{ app.title }}
    </span>
  </component>
</template>
