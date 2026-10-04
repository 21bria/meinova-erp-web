<script setup lang="ts">
/**
 * Identitas halaman + sapaan.
 *
 * Sapaan mengikuti jam **perangkat pengguna**, bukan jam server —
 * tenant ini dipakai lintas zona waktu (Jakarta dan Halmahera beda satu
 * jam), dan "Selamat pagi" jam sembilan malam adalah kesalahan yang
 * langsung terlihat. Alasan yang sama dengan `DashboardHeader.vue`.
 *
 * Nol logika backend: tidak ada endpoint baru, tidak ada field baru.
 */
import { useI18n } from 'vue-i18n'

const props = defineProps<{ fullName: string }>()

const { t, locale } = useI18n()

const greeting = computed(() => {
  const hour = new Date().getHours()

  if (hour < 11)
    return t('me.workspace.greeting.morning')

  if (hour < 15)
    return t('me.workspace.greeting.afternoon')

  if (hour < 19)
    return t('me.workspace.greeting.evening')

  return t('me.workspace.greeting.night')
})

// Nama depan saja. "Selamat pagi, Muhammad Reza Aditya Pratama" memakan
// satu baris penuh dan berhenti terdengar seperti sapaan.
const firstName = computed(() => (props.fullName || '').split(' ')[0] ?? '')

/*
 * Sapaan dirakit di sini, bukan di template.
 *
 * `{{ greeting }}<template v-if>, {{ name }}</template>` yang ditulis
 * multi-baris menyisipkan spasi dari indentasinya — hasilnya "Selamat
 * pagi , Adrian", dengan spasi sebelum koma. Satu string, satu tempat,
 * dan tidak ada spasi yang datang dari tata letak berkas.
 */
const headline = computed(() =>
  firstName.value ? `${greeting.value}, ${firstName.value}` : greeting.value,
)

const today = computed(() =>
  new Intl.DateTimeFormat(locale.value === 'id' ? 'id-ID' : 'en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date()),
)
</script>

<template>
  <div class="space-y-1">
    <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {{ today }}
    </p>

    <h1 class="text-2xl font-semibold tracking-tight">
      {{ headline }}
    </h1>

    <p class="text-sm text-muted-foreground">
      {{ t('me.workspace.subtitle') }}
    </p>
  </div>
</template>
