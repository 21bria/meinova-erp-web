<script setup lang="ts">
import Page from '@/modules/hr/business-trips/page.vue'
import BusinessTripApproval from '@/modules/hr/business-trips/detail/BusinessTripApproval.vue'
import BusinessTripAssignment from '@/modules/hr/business-trips/detail/BusinessTripAssignment.vue'
import BusinessTripLegs from '@/modules/hr/business-trips/detail/BusinessTripLegs.vue'
</script>

<template>
  <Page mode="detail">
    <!--
    | Isi tiga tab custom schema backend (Assignment, Travel &
    | Accommodation, Approval / History).
    |
    | Ditulis di halaman rute, bukan di dalam module: berkas di
    | `app/modules/hr/business-trips/` yang dikenal generator ditimpa
    | setiap kali schema backend berubah dan module-nya diregenerate.
    -->
    <template #assignment="{ record }">
      <BusinessTripAssignment :record="record" />
    </template>

    <template #travel="{ record, recordId }">
      <BusinessTripLegs :record="record" :record-id="recordId" />
    </template>

    <template #approval="{ record }">
      <BusinessTripApproval :record="record" />
    </template>
  </Page>
</template>
