<script setup lang="ts">
const props = withDefaults(defineProps<{
  cols?: 1 | 2 | 3 | 4
}>(), {
  cols: 2,
})

const gridClass = computed(() => ({
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-4",
}[props.cols]))
</script>

<template>
  <div class="grid gap-4" :class="gridClass">
    <slot />
  </div>
</template>