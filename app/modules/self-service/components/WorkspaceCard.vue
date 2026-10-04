<script setup lang="ts">
import type { Component } from 'vue'
import type { SelfAction } from '../types'

/**
 * Rangka satu kartu dashboard.
 *
 * Ada supaya ketujuh kartu punya **tinggi, jarak, posisi tombol, dan
 * perlakuan ikon yang sama persis**. Tujuh salinan markup yang harus
 * tetap sepakat adalah cara satu kartu diam-diam jadi lebih pendek dari
 * tetangganya, dan barisnya terbaca ragged seperti tata letak yang belum
 * selesai.
 *
 * Keputusan yang menempel di sini, bukan di pemanggilnya:
 *
 * 1. **Padding dipegang `Card`, bukan `CardContent`.** `Card` bawaannya
 *    sudah `py-6`; menambah `py-5` di dalamnya menghasilkan 44px ruang
 *    kosong di atas tiap judul — dan tujuh kartu seperti itu mendorong
 *    "Hari Ini" jauh ke bawah lipatan layar.
 * 2. **`h-full` + `flex-col`.** Tinggi ditentukan baris grid, bukan isi
 *    kartu; kartu berisi satu baris tetap setinggi tetangganya.
 * 3. **Tombol menempel di dasar** (`mt-auto`), dipisah garis tipis.
 *    Tanpa itu CTA tiap kartu berhenti di ketinggian berbeda dan mata
 *    harus mencarinya. Isinya diberi jarak bawah (`py-3`, bukan `pt-3`):
 *    di ponsel tinggi kartu ditentukan isinya sendiri, jadi tanpa jarak
 *    itu garis pemisahnya menempel persis pada kalimat terakhir.
 * 4. **Keadaan kosong punya ikonnya sendiri**, berbingkai putus-putus.
 *    Kalimat telanjang di kartu kosong terbaca seperti gagal memuat;
 *    bingkai putus-putus terbaca seperti tempat yang memang menunggu
 *    diisi. Sengaja tanpa warna peringatan — tidak ada yang salah.
 */
import { ArrowRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

defineProps<{
  title: string
  icon: Component
  /** `null` = tidak layak untuk akun ini; tombolnya hilang, bukan kelabu. */
  action?: SelfAction | null
  empty?: boolean
  emptyText?: string
}>()

const { t } = useI18n()
</script>

<template>
  <Card class="flex h-full flex-col gap-0 py-5">
    <CardContent class="flex flex-1 flex-col">
      <div class="flex items-center gap-2">
        <span
          class="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
        >
          <component :is="icon" class="size-3.5" aria-hidden="true" />
        </span>

        <h3 class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          {{ title }}
        </h3>
      </div>

      <!--
        Keadaan kosong mulai di ketinggian yang **sama** dengan isi kartu
        berisi (`pt-3`), bukan di tengah sisa ruangnya. Ditaruh di tengah,
        ikon kartu kosong berhenti sebaris dengan angka kartu sebelahnya —
        dan yang tingginya berbeda-beda ternyata ditentukan ada-tidaknya
        tombol di kaki kartu, hal yang sama sekali tidak ada hubungannya
        dengan isinya. Satu garis awal untuk seluruh baris jauh lebih
        cepat dipindai.
      -->
      <div
        v-if="empty"
        class="flex flex-1 flex-col items-start gap-2.5 py-3"
      >
        <span
          class="flex size-9 items-center justify-center rounded-lg border border-dashed text-muted-foreground/60"
        >
          <component :is="icon" class="size-4" aria-hidden="true" />
        </span>

        <p class="text-sm text-muted-foreground">
          {{ emptyText }}
        </p>
      </div>

      <div v-else class="flex-1 space-y-1.5 py-3">
        <slot />
      </div>

      <div v-if="action" class="mt-auto border-t pt-3">
        <NuxtLink
          :to="action.route"
          class="
            group -mx-1 inline-flex items-center gap-1.5 rounded-md px-1 py-0.5
            text-sm font-medium text-primary transition-colors
            hover:text-primary/75
            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none
          "
        >
          {{ t(`me.actions.${action.code}`) }}

          <ArrowRight
            class="size-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </CardContent>
  </Card>
</template>
