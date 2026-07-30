<script setup lang="ts">
const today = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})
</script>

<template>
  <section class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
    <div>
      <p class="text-sm font-medium text-muted-foreground">
        Welcome back
      </p>

      <h1 class="text-3xl font-semibold tracking-tight">
        Meinova ERP Workspace
      </h1>

      <p class="mt-2 text-muted-foreground">
        Manage people, operations, supply chain, and finance in one platform.
      </p>

      <p class="mt-1 text-xs text-muted-foreground">
        {{ today }}
      </p>
    </div>

    <slot />
  </section>
</template>