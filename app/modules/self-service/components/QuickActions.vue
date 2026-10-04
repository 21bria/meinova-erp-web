<script setup lang="ts">
import type { Component } from 'vue'
import type { SelfAction } from '../types'

/**
 * Aksi cepat — **hanya yang benar-benar bisa dibuka akun ini**.
 *
 * Daftarnya datang dari backend, yang sudah memeriksa dua hal sekaligus:
 * menunya terlihat, dan izin modelnya ada. Dua aksi yang valid tampil
 * dua; nol tampil nol dan seksinya hilang sekalian.
 *
 * Tidak ada tombol "Segera Hadir" dan tidak ada tombol kelabu. Pemilik
 * dashboard ini tidak bisa memberikan izin kepada dirinya sendiri, jadi
 * tombol mati tidak memberi tahu apa pun yang bisa ia tindaklanjuti —
 * yang dilakukannya cuma melatih orang berhenti membaca barisnya.
 *
 * Bentuknya **deret petak**, bukan deretan tombol kecil. Tombol `sm` di
 * kaki halaman terbaca seperti kontrol sekunder yang tersisa; petak
 * berukuran sentuh dengan ikonnya sendiri terbaca seperti pintu. Di
 * ponsel ia jadi dua kolom — cukup lebar untuk jempol, cukup pendek
 * untuk tidak menghabiskan satu layar penuh.
 *
 * Di layar lebar petaknya **flex-wrap**, bukan grid berkolom tetap.
 * Grid empat kolom untuk tiga aksi melarkan tiap petak sampai 290px
 * berisi dua kata — deret yang lebarnya ditentukan jumlah isinya, bukan
 * lebar layarnya, terbaca jauh lebih disengaja.
 */
import {
  CalendarOff,
  ClipboardCheck,
  Fingerprint,
  IdCard,
  Timer,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

defineProps<{ actions: SelfAction[] }>()

const { t } = useI18n()

/*
| Ikon per kode aksi. Kode yang tidak dikenal tetap tampil — dengan
| petak kosong, bukan tanpa tombol: aksi yang backend nyatakan sah tidak
| boleh hilang dari layar cuma karena ikonnya belum dipilih.
*/
const ICONS: Record<string, Component> = {
  profile: IdCard,
  check_in: Fingerprint,
  leave_request: CalendarOff,
  permission_request: ClipboardCheck,
  overtime_request: Timer,
}
</script>

<template>
  <div
    v-if="actions.length"
    class="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"
    data-testid="quick-actions"
  >
    <NuxtLink
      v-for="action in actions"
      :key="action.code"
      :to="action.route"
      class="
        group flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2.5
        text-sm font-medium transition-colors
        hover:border-primary/30 hover:bg-accent
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none
        sm:min-w-[10.5rem]
      "
    >
      <span
        class="
          flex size-7 shrink-0 items-center justify-center rounded-md bg-muted
          text-muted-foreground transition-colors
          group-hover:bg-background group-hover:text-foreground
        "
      >
        <component
          :is="ICONS[action.code]"
          v-if="ICONS[action.code]"
          class="size-3.5"
          aria-hidden="true"
        />
      </span>

      <span class="min-w-0 truncate">{{ t(`me.actions.${action.code}`) }}</span>
    </NuxtLink>
  </div>
</template>
