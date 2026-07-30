<script setup lang="ts">
import AuditTrail from "./audit-trail/page.vue"
</script>

<template>
  <main class="mx-auto max-w-screen-2xl px-0 py-0">
    <section class="mb-6 flex flex-col gap-1">
      <h1 class="text-2xl font-normal tracking-tight">
        Audit
      </h1>

      <p class="max-w-3xl text-muted-foreground">
        Review system activity, changes, and user actions.
      </p>
    </section>

    <AuditTrail />
  </main>
</template>