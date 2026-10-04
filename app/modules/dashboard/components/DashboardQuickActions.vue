<script setup lang="ts">
import { ArrowRight, Star } from 'lucide-vue-next'
import type { QuickAction } from '../types'

const props = defineProps<{
  items: QuickAction[]
  isCustomizing?: boolean
}>()

const emit = defineEmits<{
  'toggle-action': [code: string]
}>()

/**
 * `resolveComponent`, **bukan** string `'NuxtLink'` di `:is`.
 *
 * Nama komponen yang cuma muncul sebagai string tidak ikut
 * ditransformasi auto-import, jadi Vue memperlakukannya sebagai elemen
 * HTML biasa: kartunya tampil normal, bisa di-hover, dan **tidak
 * melakukan apa pun saat diklik** — tanpa satu pun error. Pola yang
 * benar ada di `MasterHubCard.vue`.
 */
const cardTag = computed(() =>
  props.isCustomizing ? 'div' : resolveComponent('NuxtLink'),
)
</script>

<template>
  <section>
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-lg font-semibold">Quick Actions</h2>

      <p v-if="isCustomizing" class="text-xs text-muted-foreground">
        Pilih pintasan yang ingin tampil
      </p>
    </div>

    <!--
      Dua kolom di ponsel, bukan satu.

      Base grid-nya dulu satu kolom, jadi empat pintasan jadi empat
      baris setinggi layar dan yang keempat sudah keluar layar sebelum
      ada yang sempat menekannya. Empat tombol pendek muat di dua baris.

      **Bukan carousel** seperti kartu KPI, walau polanya sudah ada:
      KPI itu angka yang dibaca satu per satu, quick action itu tombol
      yang dicari — dan tombol yang harus digeser dulu supaya terlihat
      lebih lambat daripada tombol yang langsung ada di layar.
    -->
    <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <!--
        Saat menyusun, kartunya **bukan tautan**.

        Kalau tetap `NuxtLink`, menekan bintang untuk memilih pintasan
        ikut membuka halamannya — dan penggunanya terlempar keluar dari
        beranda tepat saat sedang menyusunnya.
      -->
      <component
        :is="cardTag"
        v-for="item in items"
        :key="item.code"
        :to="isCustomizing ? undefined : item.href"
        class="group flex items-center gap-3 rounded-2xl border bg-card p-3 transition sm:p-4"
        :class="
          isCustomizing
            ? (item.selected === false ? 'opacity-50' : '')
            : 'hover:-translate-y-0.5 hover:shadow-md'
        "
      >
        <div
          class="flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-10"
          :class="item.color || 'bg-muted text-muted-foreground'"
        >
          <component :is="item.icon" v-if="item.icon" class="size-5" />
        </div>

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium">{{ item.title }}</p>

          <!--
            Keterangannya dari backend, bukan "Create new record" untuk
            semuanya — salah satu pintasannya membuka kotak masuk dan
            tidak membuat apa pun.

            Disembunyikan di layar sempit: di kolom selebar setengah
            ponsel kalimatnya terpotong jadi tiga kata yang tidak
            menjelaskan apa pun, dan cuma menambah tinggi tombolnya.
          -->
          <p class="hidden truncate text-xs text-muted-foreground sm:block">
            {{ item.description }}
          </p>
        </div>

        <button
          v-if="isCustomizing"
          type="button"
          class="shrink-0 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted"
          :aria-label="item.selected === false ? 'Tampilkan pintasan' : 'Sembunyikan pintasan'"
          @click="emit('toggle-action', item.code)"
        >
          <Star
            class="size-4"
            :class="item.selected === false ? '' : 'fill-amber-400 text-amber-500'"
          />
        </button>

        <ArrowRight
          v-else
          class="hidden size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 sm:block"
        />
      </component>
    </div>
  </section>
</template>