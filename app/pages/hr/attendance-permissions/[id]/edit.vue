<script setup lang="ts">
import Page from '@/modules/hr/attendance-permissions/page.vue'
import AttendancePermissionReview from '@/modules/hr/attendance-permissions/review/AttendancePermissionReview.vue'
</script>

<template>
  <Page mode="edit">
    <!--
    | Isi tab `review` — jadwal, presensi sesungguhnya, peringatan
    | tabrakan, dan jejak persetujuan.
    |
    | Ditulis di halaman rute, bukan di dalam module: berkas di
    | `app/modules/hr/attendance-permissions/` yang dikenal generator
    | ditimpa setiap kali schema backend berubah dan module-nya
    | diregenerate.
    -->
    <template #review="{ record }">
      <AttendancePermissionReview :record="record" />
    </template>
  </Page>
</template>
