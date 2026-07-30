<script setup lang="ts">
import { computed, ref } from "vue"
import {
  Check,
  ChevronsUpDown,
  X,
} from "lucide-vue-next"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"
import MFieldLabel from "./MFieldLabel.vue"

export type MultiSelectValue =
  | string
  | number

export interface MultiSelectOption {
  label: string
  value: MultiSelectValue
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: MultiSelectValue[]
    label?: string
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    options?: MultiSelectOption[]
    error?: string | null
    hint?: string | null
    required?: boolean
    disabled?: boolean
    clearable?: boolean
    maxVisible?: number
  }>(),
  {
    modelValue: () => [],
    placeholder: "Select options",
    searchPlaceholder: "Search...",
    emptyText: "No options found.",
    options: () => [],
    error: null,
    hint: null,
    required: false,
    disabled: false,
    clearable: true,
    maxVisible: 3,
  },
)

const emit = defineEmits<{
  "update:modelValue": [
    value: MultiSelectValue[],
  ]
}>()

const open = ref(false)

const selectedValues = computed<
  MultiSelectValue[]
>(() => {
  return Array.isArray(props.modelValue)
    ? props.modelValue
    : []
})

const selectedOptions = computed(() => {
  const selected = new Set(
    selectedValues.value.map(String),
  )

  return props.options.filter(
    option =>
      selected.has(String(option.value)),
  )
})

const visibleSelectedOptions = computed(() => {
  return selectedOptions.value.slice(
    0,
    props.maxVisible,
  )
})

const remainingCount = computed(() => {
  return Math.max(
    selectedOptions.value.length
      - props.maxVisible,
    0,
  )
})

function isSelected(
  value: MultiSelectValue,
) {
  return selectedValues.value.some(
    selected =>
      String(selected) === String(value),
  )
}

function toggleOption(
  option: MultiSelectOption,
) {
  if (
    props.disabled
    || option.disabled
  ) {
    return
  }

  const exists = isSelected(option.value)

  const next = exists
    ? selectedValues.value.filter(
        value =>
          String(value)
          !== String(option.value),
      )
    : [
        ...selectedValues.value,
        option.value,
      ]

  emit("update:modelValue", next)
}

function removeOption(
  value: MultiSelectValue,
) {
  if (props.disabled)
    return

  emit(
    "update:modelValue",
    selectedValues.value.filter(
      selected =>
        String(selected) !== String(value),
    ),
  )
}

function clearAll() {
  if (
    props.disabled
    || !props.clearable
  ) {
    return
  }

  emit("update:modelValue", [])
}

function handleBadgeRemove(
  event: MouseEvent,
  value: MultiSelectValue,
) {
  event.preventDefault()
  event.stopPropagation()

  removeOption(value)
}
</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel
      :label="label"
      :required="required"
    />

    <Popover
      v-model:open="open"
    >
      <PopoverTrigger as-child>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          :aria-expanded="open"
          :disabled="disabled"
          :class="
            cn(
              'h-auto min-h-9 w-full justify-between px-3 py-2 font-normal',
              error && 'border-destructive',
            )
          "
        >
          <div
            v-if="selectedOptions.length"
            class="flex min-w-0 flex-1 flex-wrap gap-1.5"
          >
            <Badge
              v-for="option in visibleSelectedOptions"
              :key="String(option.value)"
              variant="secondary"
              class="max-w-full gap-1"
            >
              <span class="truncate">
                {{ option.label }}
              </span>

              <button
                v-if="!disabled"
                type="button"
                class="rounded-sm opacity-60 transition-opacity hover:opacity-100"
                :aria-label="`Remove ${option.label}`"
                @click="
                  handleBadgeRemove(
                    $event,
                    option.value,
                  )
                "
              >
                <X class="h-3 w-3" />
              </button>
            </Badge>

            <Badge
              v-if="remainingCount > 0"
              variant="secondary"
            >
              +{{ remainingCount }}
            </Badge>
          </div>

          <span
            v-else
            class="truncate text-muted-foreground"
          >
            {{ placeholder }}
          </span>

          <div
            class="ml-2 flex shrink-0 items-center gap-1"
          >
            <button
              v-if="
                clearable
                && selectedOptions.length
                && !disabled
              "
              type="button"
              class="rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear selected options"
              @click.stop="clearAll"
            >
              <X class="h-4 w-4" />
            </button>

            <ChevronsUpDown
              class="h-4 w-4 opacity-50"
            />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        class="w-[var(--reka-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput
            :placeholder="searchPlaceholder"
          />

          <CommandList>
            <CommandEmpty>
              {{ emptyText }}
            </CommandEmpty>

            <CommandGroup>
              <CommandItem
                v-for="option in options"
                :key="String(option.value)"
                :value="`${option.label} ${option.value}`"
                :disabled="option.disabled"
                @select="toggleOption(option)"
              >
                <div
                  :class="
                    cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                      isSelected(option.value)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/40',
                    )
                  "
                >
                  <Check
                    v-if="isSelected(option.value)"
                    class="h-3 w-3"
                  />
                </div>

                <span class="truncate">
                  {{ option.label }}
                </span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>

    <MFieldHint :text="hint" />
    <MFieldError :error="error" />
  </div>
</template>