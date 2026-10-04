<script setup lang="ts">
/**
 * Bingkai satu widget beranda: kendali susun di atasnya, isinya di
 * bawah.
 *
 * Kendalinya **hanya muncul saat mode Customize**. Tombol mata dan
 * panah yang selalu terlihat mengubah beranda jadi panel pengaturan,
 * dan yang paling sering dipakai justru bukan menyusunnya.
 */
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Eye,
  EyeOff,
} from 'lucide-vue-next'

import type { DashboardWidgetCard } from '../types'

defineProps<{
  widget: DashboardWidgetCard
  isCustomizing?: boolean
  isFirst?: boolean
  isLast?: boolean
}>()

const emit = defineEmits<{
  move: [direction: -1 | 1]
  'toggle-visible': []
  'toggle-collapsed': []
}>()
</script>

<template>
  <section
    :class="[
      'flex h-full flex-col gap-2',
      isCustomizing && !widget.is_visible ? 'opacity-50' : '',
    ]"
  >
    <!--
      Baris kendali hanya di mode Customize. Di luar itu widget tampil
      apa adanya, tanpa satu piksel pun tambahan.
    -->
    <div
      v-if="isCustomizing"
      class="flex items-center justify-between gap-2 rounded-lg border border-dashed px-3 py-1.5"
    >
      <span class="truncate text-xs font-medium text-muted-foreground">
        {{ widget.title }}
      </span>

      <div class="flex shrink-0 items-center gap-0.5">
        <!--
          Naik/turun, bukan drag. Di ponsel drag bertabrakan dengan
          gulir halaman dan selalu terasa rusak; tombol bekerja sama di
          kedua ukuran layar dan tidak punya keadaan "terjepit".
        -->
        <Button
          variant="ghost"
          size="icon"
          class="size-7"
          :disabled="isFirst"
          :aria-label="$t('home.widget.moveUp')"
          @click="emit('move', -1)"
        >
          <ChevronUp class="size-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          class="size-7"
          :disabled="isLast"
          :aria-label="$t('home.widget.moveDown')"
          @click="emit('move', 1)"
        >
          <ChevronDown class="size-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          class="size-7"
          :aria-label="widget.is_visible ? $t('home.widget.hide') : $t('home.widget.show')"
          @click="emit('toggle-visible')"
        >
          <component
            :is="widget.is_visible ? Eye : EyeOff"
            class="size-4"
          />
        </Button>
      </div>
    </div>

    <!--
      Tombol lipat menempel di widget, bukan di baris kendali: melipat
      adalah hal yang dilakukan sehari-hari, bukan saat menyusun.
    -->
    <div v-if="widget.is_collapsed" class="relative">
      <button
        type="button"
        class="flex w-full items-center gap-2 rounded-xl border bg-card px-4 py-3 text-left transition-colors hover:bg-muted/50"
        @click="emit('toggle-collapsed')"
      >
        <ChevronRight class="size-4 shrink-0 text-muted-foreground" />

        <span class="truncate text-sm font-medium">{{ widget.title }}</span>

        <span class="ml-auto shrink-0 text-xs text-muted-foreground">
          {{ $t('home.widget.expand') }}
        </span>
      </button>
    </div>

    <!--
      Tombol lipat sengaja **selalu terlihat**, bukan muncul saat
      hover: di layar sentuh tidak ada hover sama sekali, jadi kendali
      yang bersembunyi di baliknya sama saja dengan tidak ada.
      Diredupkan supaya tidak bersaing dengan isi kartunya.
    -->
    <!--
      `min-h-0` wajib, bukan hiasan: anak sebuah flex punya
      `min-height: auto` secara bawaan, jadi tanpa ini kartunya menolak
      menyusut dan `overflow-y-auto` di dalamnya tidak pernah menyala.
    -->
    <div v-else class="relative min-h-0 flex-1">
      <Button
        variant="ghost"
        size="icon"
        class="absolute right-1 top-1 z-10 size-7 text-muted-foreground/60 hover:text-foreground"
        :aria-label="$t('home.utility.collapse', { title: widget.title })"
        @click="emit('toggle-collapsed')"
      >
        <ChevronDown class="size-4" />
      </Button>

      <slot />
    </div>
  </section>
</template>
