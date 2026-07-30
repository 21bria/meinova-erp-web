<script setup lang="ts">
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'
import { Icon } from '#components'

const props = defineProps<{
    row: any
    onEdit: (row: any) => void
    onDelete: (row: any) => void
}>()
</script>
<template>
  <div class="flex w-full justify-end">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="h-8 w-8 p-0">
          <Icon name="i-radix-icons-dots-horizontal" class="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" class="w-[160px]">
        <DropdownMenuItem @click="props.onEdit(props.row)">Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="text-red-600" @click="props.onDelete(props.row)">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
