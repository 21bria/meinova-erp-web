<script setup lang="ts">
import { TrendingDown, TrendingUp } from 'lucide-vue-next'

import type { CarouselApi } from '@/components/ui/carousel'
import type { DashboardKpi } from '../types'

defineProps<{
  items: DashboardKpi[]
}>()

/**
 * `resolveComponent`, **bukan** string `'NuxtLink'` di `:is`.
 *
 * Nama komponen yang cuma muncul sebagai string tidak ikut
 * ditransformasi auto-import, jadi Vue memperlakukannya sebagai elemen
 * HTML biasa: kartunya tampil normal, bisa di-hover, dan **tidak
 * melakukan apa pun saat diklik** — tanpa satu pun error. Kartu KPI
 * memang seharusnya membawa ke layar yang menghasilkan angkanya.
 */
const NuxtLinkComponent = resolveComponent('NuxtLink')

function cardTag(href?: string) {
  return href ? NuxtLinkComponent : 'div'
}

/*
 * Di layar sempit empat kartu KPI menumpuk jadi empat baris penuh, dan
 * dua di antaranya sudah keluar layar sebelum ada yang sempat
 * dibacanya — bagian bawah beranda praktis tidak pernah terlihat di
 * ponsel. Digeser seperti tumpukan kartu bank, keempatnya muat di satu
 * layar.
 *
 * Polanya dipakai ulang dari `MDashboard` yang sudah terbukti di
 * dashboard modul; dipisah lewat CSS (`sm:hidden` / `hidden sm:grid`),
 * bukan `useMediaQuery`, supaya render pertama tidak pernah salah
 * bentuk sebelum ukuran layar diketahui.
 */
const carouselApi = ref<CarouselApi>()
const activeSlide = ref(0)

function onCarouselInit(api: CarouselApi) {
  carouselApi.value = api

  api?.on('select', () => {
    activeSlide.value = api.selectedScrollSnap()
  })
}

function goToSlide(index: number) {
  carouselApi.value?.scrollTo(index)
}
</script>

<template>
  <section>
    <!-- Layar kecil: digeser. -->
    <div class="sm:hidden">
      <Carousel
        class="w-full"
        :opts="{ align: 'start', containScroll: 'trimSnaps' }"
        @init-api="onCarouselInit"
      >
        <CarouselContent class="-ml-3">
          <CarouselItem
            v-for="item in items"
            :key="item.code"
            class="basis-[80%] pl-3"
          >
            <component
              :is="cardTag(item.href)"
              :to="item.href"
              class="block h-full"
            >
              <Card class="h-full transition-all hover:shadow-md">
                <CardHeader class="flex flex-row items-center justify-between pb-2">
                  <CardDescription>{{ item.title }}</CardDescription>

                  <span
                    v-if="item.icon"
                    class="flex size-8 shrink-0 items-center justify-center rounded-xl"
                    :class="item.badge || 'bg-muted text-muted-foreground'"
                  >
                    <component :is="item.icon" class="size-4" />
                  </span>
                </CardHeader>

                <CardContent>
                  <div class="text-3xl font-bold">
                    {{ item.value }}
                  </div>
                </CardContent>
              </Card>
            </component>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <!--
        Titik penanda posisi. Tanpa ini tidak ada satu pun tanda bahwa
        kartunya bisa digeser, dan yang tidak terlihat tidak akan
        pernah dicoba.
      -->
      <div
        v-if="items.length > 1"
        class="mt-3 flex items-center justify-center gap-1.5"
      >
        <button
          v-for="(item, index) in items"
          :key="item.code"
          type="button"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="
            activeSlide === index
              ? 'w-5 bg-primary'
              : 'w-1.5 bg-muted-foreground/30'
          "
          :aria-label="`Ke kartu ${item.title}`"
          @click="goToSlide(index)"
        />
      </div>
    </div>

    <!--
      Layar lebar: grid seperti semula.

      Empat kolom mulai `lg`, bukan `xl`. Sejak baris KPI berdiri di
      luar grid dua kolom beranda — selebar halaman penuh — di 1024px
      satu kartu jadi selebar 476px untuk memuat satu angka, dan
      keempatnya terlipat jadi dua baris padahal ruangnya lebih dari
      cukup. Di bawah `lg` tetap 2 kolom, dan di bawah `sm` tetap
      carousel; keduanya tidak bergeser sedikit pun.

      Dibungkus NuxtLink, bukan `Card` yang jadi tautan: kartunya
      menautkan ke layar yang menghasilkan angkanya, dan "Waiting for My
      Approval: 3" tanpa jalan ke kotak masuknya memaksa orang mencari
      sendiri menu mana yang dimaksud.
    -->
    <div class="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
      <component
        :is="cardTag(item.href)"
        v-for="item in items"
        :key="item.code"
        :to="item.href"
      >
        <Card class="h-full transition-all hover:shadow-md">
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardDescription>{{ item.title }}</CardDescription>

            <!--
              Ikon berlatar bulat berwarna, bukan ikon telanjang.
              Empat kartu putih dengan ikon kecil abu-abu tidak punya
              satu pun titik yang membedakannya sekilas; latar seukuran
              ikon memberi warna tanpa mengganggu angkanya.
            -->
            <span
              v-if="item.icon"
              class="flex size-9 shrink-0 items-center justify-center rounded-xl"
              :class="item.badge || 'bg-muted text-muted-foreground'"
            >
              <component :is="item.icon" class="size-5" />
            </span>
          </CardHeader>

          <CardContent>
            <div class="text-3xl font-bold">
              {{ item.value }}
            </div>

            <div
              v-if="item.change !== undefined"
              class="mt-2 flex items-center gap-1 text-xs"
              :class="item.trend === 'down' ? 'text-red-600' : 'text-emerald-600'"
            >
              <TrendingDown
                v-if="item.trend === 'down'"
                class="h-3 w-3"
              />
              <TrendingUp
                v-else
                class="h-3 w-3"
              />

              {{ item.change > 0 ? '+' : '' }}{{ item.change }}% this month
            </div>
          </CardContent>
        </Card>
      </component>
    </div>
  </section>
</template>
