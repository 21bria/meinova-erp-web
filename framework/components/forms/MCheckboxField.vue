<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox"

import MFieldError from "./MFieldError.vue"

defineProps({
    modelValue: Boolean,
    label: String,
    error: String,
    disabled: Boolean,
})

const emit = defineEmits([
    "update:modelValue"
])
</script>

<template>
    <div class="space-y-2">
        <div class="flex items-center gap-2">
            <Checkbox :model-value="modelValue" :disabled="disabled"
                @update:model-value="v => emit('update:modelValue', v === true)" />
            <label>{{ label }}</label>
        </div>
        <MFieldError :error="error" />
    </div>
</template>