<script setup lang="ts">
// Halaman dashboard-nya tinggal di `/payroll/dashboard`, dan itu satu-
// satunya salinannya. Path modul telanjang tetap dijawab supaya
// tautan lama dan pengetikan `/payroll` tidak berakhir di 404 — tapi
// menjawabnya dengan komponen yang sama berarti dua rute yang harus
// tetap sepakat, jadi yang ini mengoper saja.
definePageMeta({
  redirect: '/payroll/dashboard',
})
</script>
