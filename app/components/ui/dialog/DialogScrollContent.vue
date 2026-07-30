<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { X } from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,

  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<DialogContentProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<DialogContentEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DialogPortal>
    <DialogOverlay
    class="
      fixed inset-0 z-50
      grid place-items-center
      overflow-hidden
      bg-black/80
      p-4
      data-[state=open]:animate-in
      data-[state=closed]:animate-out
      data-[state=closed]:fade-out-0
      data-[state=open]:fade-in-0
    "
  >
    <DialogContent
      :class="
        cn(
          `
            relative z-50
            flex w-full max-w-lg flex-col
            max-h-[calc(100dvh-2rem)]
            overflow-hidden
            border border-border
            bg-background
            shadow-lg
            duration-200
            sm:rounded-lg
          `,
          props.class,
        )
      "
      v-bind="forwarded"
    >
      <slot />

      <DialogClose
        class="
          absolute right-4 top-4
          rounded-md p-0.5
          transition-colors
          hover:bg-secondary
        "
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogOverlay>
  </DialogPortal>
</template>
