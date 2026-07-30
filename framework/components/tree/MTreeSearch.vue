<script setup lang="ts">
import { Search } from 'lucide-vue-next'

const model = defineModel<string>({
  default: '',
})
</script>

<template>
  <div class="relative">
    <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

    <Input
      v-model="model"
      class="pl-9"
      placeholder="Search tree..."
    />
  </div>
</template>