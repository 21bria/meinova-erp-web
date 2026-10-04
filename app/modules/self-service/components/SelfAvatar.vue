<script setup lang="ts">
/**
 * Avatar Self Service.
 *
 * Fotonya datang sebagai `blob:` URL dari `useSelfAvatar()` — lihat
 * composable itu untuk alasan kenapa alamat API tidak boleh dipasang
 * langsung ke `src`.
 *
 * Yang belum punya foto mendapat **inisialnya**, bukan kotak kosong:
 * kotak kosong terbaca seperti gambar yang gagal dimuat, dan itu
 * mengirim orang mencari masalah yang tidak ada.
 */
import { avatarInitials } from '@/utils/avatar'

const props = withDefaults(
  defineProps<{
    src?: string | null
    name: string
    /** Inisial dari backend; dipakai kalau nama tidak bisa dipecah. */
    initials?: string | null
    size?: 'sm' | 'md' | 'hero' | 'lg'
  }>(),
  { src: null, initials: null, size: 'lg' },
)

const SIZES = {
  // 72–88 px di desktop, mengecil di layar sempit supaya kepala halaman
  // tidak mendorong identitasnya keluar layar.
  lg: 'size-16 sm:size-20 lg:size-22 text-xl sm:text-2xl',
  // Kepala dashboard. Sengaja lebih kecil dari `lg`: `/me` bukan halaman
  // kartu pegawai, dan kepala halaman yang tinggi mendorong "Hari Ini"
  // — bagian yang benar-benar dibaca tiap pagi — ke bawah lipatan layar.
  // `lg` **tidak** ikut dikecilkan; halaman profil memakainya dan
  // bentuknya tidak berubah.
  hero: 'size-14 sm:size-16 text-lg sm:text-xl',
  md: 'size-12 text-base',
  sm: 'size-9 text-sm',
} as const

const fallback = computed(
  () => avatarInitials(props.name) || props.initials || '?',
)

const sizeClass = computed(() => SIZES[props.size])
</script>

<template>
  <Avatar :class="sizeClass" class="rounded-xl border bg-muted">
    <!--
    | `alt` dikosongkan dengan sengaja saat fotonya ada: namanya sudah
    | tercetak sebagai teks tepat di sebelahnya, dan pembaca layar yang
    | mengumumkannya dua kali justru lebih sulit diikuti. Yang tidak
    | punya foto tidak memasang <img> sama sekali.
    -->
    <AvatarImage v-if="src" :src="src" alt="" />

    <AvatarFallback class="rounded-xl font-semibold">
      {{ fallback }}
    </AvatarFallback>
  </Avatar>
</template>
