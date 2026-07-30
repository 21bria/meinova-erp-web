<script setup lang="ts">
import { Edit, MoreHorizontal, Trash2 } from "lucide-vue-next"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const props = withDefaults(defineProps<{
  row: any
  showEdit?: boolean
  showDelete?: boolean
}>(), {
  showEdit: true,
  showDelete: true,
})

const emit = defineEmits<{
  (e: "edit", row: any): void
  (e: "delete", row: any): void
}>()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button type="button" variant="ghost" size="icon" class="size-8">
        <MoreHorizontal class="size-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" side="bottom" :side-offset="6" class="z-50 w-44 bg-popover">
      <DropdownMenuItem v-if="props.showEdit" class="cursor-pointer" @select="emit('edit', props.row)">
        <Edit class="mr-2 size-4" />
        <span>Edit</span>
      </DropdownMenuItem>

      <DropdownMenuItem v-if="props.showDelete" class="cursor-pointer text-destructive focus:text-destructive"
        @select="emit('delete', props.row)">
        <Trash2 class="mr-2 size-4" />
        <span>Delete</span>
      </DropdownMenuItem>

      <slot :row="props.row" />
    </DropdownMenuContent>
  </DropdownMenu>
</template>