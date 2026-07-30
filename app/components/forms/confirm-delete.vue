<script setup lang="ts">
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from '@/components/ui/alert-dialog'

const props = defineProps<{
    open: boolean
    title?: string
    description?: string
}>()

const emit = defineEmits(['update:open', 'confirm'])

const close = () => emit('update:open', false)
</script>

<template>
    <AlertDialog :open="open" @update:open="close">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    {{ title || 'Confirm delete' }}
                </AlertDialogTitle>

                <AlertDialogDescription>
                    {{ description }}
                </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
                <AlertDialogCancel @click="close">
                    Cancel
                </AlertDialogCancel>

                <AlertDialogAction class="bg-red-600 hover:bg-red-700" @click="emit('confirm')">
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
