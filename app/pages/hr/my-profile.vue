<script setup lang="ts">
/*
 * Pengalihan kompatibilitas: `/hr/my-profile` → `/me/profile`.
 *
 * Layarnya pindah keluar dari HR di Stage 6 — kartu pegawai milik
 * sendiri bukan fitur HR. Rutenya **tidak dihapus**: ia sudah lama jadi
 * penanda halaman orang, ada di riwayat browser, dan mungkin tertaut
 * dari email. Yang mati diam-diam lebih merepotkan daripada satu berkas
 * pengalihan.
 *
 * `replace` supaya tombol Kembali tidak memantulkan orang balik ke sini
 * lalu mengalihkannya lagi — tanpa itu, keluar dari halaman profil butuh
 * dua kali tekan.
 *
 * Modul lamanya sengaja **tidak** di-import di sini: kalau di-import, ia
 * ikut terbundel selamanya dan pembersihan Stage 9 jadi mustahil
 * dibuktikan aman.
 */
definePageMeta({
  middleware: () => navigateTo('/me/profile', { replace: true }),
})
</script>

<template>
  <div />
</template>
