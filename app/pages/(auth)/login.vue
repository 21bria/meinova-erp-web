<script setup lang="ts">
definePageMeta({
  layout: 'blank',
  public: true

})

const year = new Date().getFullYear()
</script>

<template>
  <LayoutAuth reverse>
    <div class="mx-auto grid max-w-sm gap-6">
      <!-- Mobile logo only -->
      <NuxtLink to="/" class="flex items-center justify-center lg:hidden">
        <div class="flex h-20 w-24 items-center justify-center">
          <img src="/meinova_white.png" alt="Meinova" class="size-18 object-contain">
        </div>
      </NuxtLink>

      <div class="grid gap-2 text-center">
        <h1 class="text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>

        <p class="text-balance text-sm text-muted-foreground">
          Sign in to access your Meinova ERP workspace.
        </p>
      </div>

      <AuthSignIn />

      <p class="text-center text-xs text-muted-foreground lg:hidden">
        © {{ year }} Meinova Inc. All rights reserved.
      </p>
    </div>
  </LayoutAuth>
</template>