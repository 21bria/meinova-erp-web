<script setup lang="ts">
defineProps<{
  reverse?: boolean
}>()
const year = new Date().getFullYear()
</script>

<template>
  <div
    class="relative flex h-dvh items-center justify-center overflow-hidden bg-background px-4 lg:max-w-none lg:px-0"
    :class="{ 'flex-row-reverse': reverse }"
  >
    <div class="relative hidden h-full flex-1 overflow-hidden p-10 text-white lg:flex lg:flex-col">
      <div class="absolute inset-0 bg-[#0b1120]" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.28),transparent_34%),radial-gradient(circle_at_80%_35%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.14),transparent_34%)]" />
      <div class="absolute inset-0 bg-gradient-to-br from-slate-950/30 via-emerald-950/20 to-slate-950/80" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] bg-[length:24px_24px] opacity-15" />

      <div class="relative z-20 flex items-center gap-3 text-lg font-semibold">
        <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/7 ring-1 ring-white/15 backdrop-blur">
          <img src="/meinova.png" class="size-14 object-contain">
        </div>
      </div>

      <div class="relative z-20 my-auto max-w-xl space-y-8">
        <div class="space-y-4">
          <div class="inline-flex rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100 backdrop-blur">
            Multi Tenant • Multi Company • Workflow Ready
          </div>

          <h1 class="text-4xl font-semibold tracking-tight xl:text-5xl">
            Modern ERP for growing enterprise operations.
          </h1>

          <p class="max-w-lg text-base leading-7 text-white/65">
            Manage finance, HR, payroll, supply chain, workflow, and reporting in one secure business platform.
          </p>
        </div>
      </div>

      <div class="relative z-20 flex items-center justify-between text-xs text-white/45">
        <span>© {{ year }} Meinova Inc. All rights reserved.</span>
        <span>Version 1.0.0</span>
      </div>
    </div>

    <div class="mx-auto flex-1 lg:p-8">
      <slot />
    </div>
  </div>
</template>
<style scoped></style>
