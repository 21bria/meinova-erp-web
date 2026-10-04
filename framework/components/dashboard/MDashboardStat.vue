<script setup lang="ts">
import { computed } from "vue"

import { formatDashboardValue } from "@framework/core/utils/dashboard"

import type {
  DashboardStatData,
  DashboardStatWidget,
} from "@framework/core/types/dashboard"

const props = withDefaults(
  defineProps<{
    widget: DashboardStatWidget
    data: DashboardStatData | null
    loading?: boolean
    // Urutan kartu dipakai untuk memilih warna aksen, jadi satu baris
    // KPI tidak tampil sebagai enam kotak yang identik.
    index?: number
  }>(),
  { index: 0 },
)

const TONES = [
  {
    icon: "bg-primary/10 text-primary",
    accent: "from-primary/70 to-primary/10",
    glow: "bg-primary/10",
  },
  {
    icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    accent: "from-emerald-500/70 to-emerald-500/10",
    glow: "bg-emerald-500/10",
  },
  {
    icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    accent: "from-violet-500/70 to-violet-500/10",
    glow: "bg-violet-500/10",
  },
  {
    icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    accent: "from-amber-500/70 to-amber-500/10",
    glow: "bg-amber-500/10",
  },
  {
    icon: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    accent: "from-sky-500/70 to-sky-500/10",
    glow: "bg-sky-500/10",
  },
  {
    icon: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    accent: "from-rose-500/70 to-rose-500/10",
    glow: "bg-rose-500/10",
  },
]

const tone = computed(() => TONES[props.index % TONES.length]!)

const value = computed(() => {
  return formatDashboardValue(
    props.data?.value,
    props.widget.format ?? "number",
    props.widget.precision,
  )
})

// Backend mengembalikan `trend: null` kalau periode pembandingnya nol —
// "naik 100%" untuk data yang baru mulai terisi lebih menyesatkan
// daripada tidak menampilkan apa-apa.
/*
 * Ukuran huruf angkanya mengikuti panjang angkanya.
 *
 * Enam kartu sejajar membuat kolomnya sekitar 130px, dan "Rp
 * 132.378.341" pada `text-3xl` tidak muat — yang tampil "Rp 132…",
 * yang berarti kartu Gross Payroll dan Net Payroll terbaca **sama
 * persis** padahal selisihnya delapan juta. Angka yang terpotong pada
 * kartu yang seluruh gunanya adalah angkanya bukan kosmetik.
 *
 * Yang diperkecil hurufnya, bukan angkanya: pembulatan ke "Rp 132 jt"
 * menghilangkan tepat yang dicari orang payroll saat mencocokkan total
 * dengan daftar transfer bank. `title` tetap memuat nilai penuh, dan
 * `truncate` tetap ada sebagai jaring terakhir.
 *
 * Kartu berangka pendek — seluruh dashboard yang sudah ada — jatuh ke
 * cabang pertama dan tampil persis seperti sebelumnya.
 */
const valueClass = computed(() => {
  const length = value.value.length

  // Hanya tingkat pertama yang membesar di layar lebar, dan itu bukan
  // kelalaian: kartunya justru paling **sempit** di layar lebar — di
  // situlah keenamnya berbagi satu baris (`statGridClass`), sekitar
  // 138px per kartu. Menaikkan hurufnya di `sm:` memotong tepat angka
  // yang paling perlu dibaca utuh, dan yang tampil "Rp 132…" membuat
  // Gross Payroll dan Net Payroll terbaca sama persis padahal
  // selisihnya delapan juta.
  if (length <= 6) return "text-2xl sm:text-3xl"
  if (length <= 9) return "text-2xl"
  if (length <= 11) return "text-xl"
  if (length <= 12) return "text-lg"

  return "text-base"
})

const trend = computed(() => props.data?.trend ?? null)

const isUp = computed(() => trend.value?.direction === "up")

const iconName = computed(() => {
  return props.widget.icon
    ? `i-lucide-${props.widget.icon}`
    : "i-lucide-activity"
})
</script>

<template>
  <Card
    class="group relative h-full overflow-hidden border-border/60 py-0 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-md"
  >
    <!-- Garis aksen tipis di atas kartu: satu-satunya elemen yang
         membedakan kartu secara visual, cukup untuk memandu mata tanpa
         mewarnai seluruh kartu. -->
    <div
      class="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r"
      :class="tone.accent"
    />

    <div
      class="pointer-events-none absolute -right-8 -top-10 size-28 rounded-full blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
      :class="tone.glow"
    />

    <CardContent class="relative flex h-full flex-col justify-between gap-4 p-4 sm:p-5">
      <div class="flex items-start justify-between gap-3">
        <div
          class="flex size-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
          :class="tone.icon"
        >
          <Icon :name="iconName" class="size-5" />
        </div>

        <Badge
          v-if="trend"
          variant="outline"
          class="gap-1 border-transparent px-2 py-0.5 text-xs font-medium tabular-nums"
          :class="
            isUp
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
          "
        >
          <Icon
            :name="isUp ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
            class="size-3"
          />
          {{ trend.value }}%
        </Badge>
      </div>

      <div class="space-y-1">
        <!-- Label dibiarkan turun ke baris kedua, bukan dipotong: enam
             kartu sejajar membuat kolomnya sempit, dan "Kehadiran
             (Rata-r…" tidak memberi tahu apa-apa. -->
        <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {{ widget.label }}
        </p>

        <Skeleton v-if="loading" class="h-8 w-28" />

        <p
          v-else
          class="truncate font-semibold tracking-tight tabular-nums"
          :class="valueClass"
          :title="value"
        >
          {{ value }}
        </p>

        <p
          v-if="trend"
          class="text-xs leading-snug text-muted-foreground"
        >
          <span
            class="font-medium"
            :class="
              isUp
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            "
          >{{ isUp ? "Naik" : "Turun" }} {{ trend.value }}%</span>
          {{ trend.period }}
        </p>
      </div>
    </CardContent>
  </Card>
</template>
