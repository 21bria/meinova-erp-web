<script setup lang="ts">
import type { MasterHubItem } from '../types'

const props = defineProps<{
  item: MasterHubItem
}>()

const componentType = computed(() => {
  if (props.item.disabled)
    return 'div'

  if (props.item.external)
    return 'a'

  return resolveComponent('NuxtLink')
})

const componentProps = computed(() => {
  if (props.item.disabled)
    return {}

  if (props.item.external) {
    return {
      href: props.item.link,
      target: '_blank',
      rel: 'noopener noreferrer',
    }
  }

  return {
    to: props.item.link,
  }
})
</script>

<template>
  <component
    :is="componentType"
    v-bind="componentProps"
    class="group flex min-h-24 items-start gap-4 rounded-xl border border-transparent p-3 transition-all duration-200 md:p-4"
    :class="[
      item.disabled
        ? 'cursor-not-allowed opacity-50'
        : 'cursor-pointer hover:border-border hover:bg-muted/60',
    ]"
  >
    <div
      class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200"
      :class="!item.disabled && 'group-hover:scale-105'"
    >
      <Icon
        :name="item.icon"
        class="size-5"
      />
    </div>

    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-3">
        <h2 class="truncate text-sm font-medium text-foreground">
          {{ item.title }}
        </h2>

        <Badge
          v-if="item.badge !== undefined"
          variant="secondary"
          class="shrink-0"
        >
          {{ item.badge }}
        </Badge>
      </div>

      <p
        v-if="item.description"
        class="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground"
      >
        {{ item.description }}
      </p>
    </div>

    <Icon
      v-if="!item.disabled"
      :name="item.external
        ? 'i-lucide-external-link'
        : 'i-lucide-chevron-right'"
      class="mt-1 size-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
    />
  </component>
</template>