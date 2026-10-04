<script setup lang="ts">
type Decision = 'approve' | 'reject' | 'return'

const props = defineProps<{
  open: boolean
  decision: Decision
  documentLabel?: string | null
  stepName?: string | null
  submitting?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: [comment: string]
}>()

const comment = ref('')
const touched = ref(false)

const COPY: Record<Decision, {
  title: string
  description: string
  confirm: string
  variant: 'default' | 'destructive' | 'outline'
  label: string
  // Penolakan tanpa alasan tidak bisa ditindaklanjuti pengaju — dia
  // hanya tahu ditolak, tidak tahu apa yang harus dibetulkan. Backend
  // juga menolaknya, jadi kalau tidak diwajibkan di sini pengguna cuma
  // dapat error setelah menekan tombol.
  required: boolean
}> = {
  approve: {
    title: 'Setujui dokumen',
    description: 'Dokumen diteruskan ke tahap berikutnya, atau selesai kalau ini tahap terakhir.',
    confirm: 'Approve',
    variant: 'default',
    label: 'Catatan (opsional)',
    required: false,
  },
  reject: {
    title: 'Tolak dokumen',
    description: 'Alur berhenti dan dokumen ditandai ditolak. Pengaju harus membuat pengajuan baru.',
    confirm: 'Reject',
    variant: 'destructive',
    label: 'Alasan penolakan',
    required: true,
  },
  return: {
    title: 'Kembalikan ke pengaju',
    description: 'Bukan penolakan — dokumen bisa diperbaiki lalu diajukan ulang dari tahap pertama.',
    confirm: 'Return',
    variant: 'outline',
    label: 'Yang perlu diperbaiki',
    required: true,
  },
}

const copy = computed(() => COPY[props.decision])

const invalid = computed(() =>
  copy.value.required && comment.value.trim() === '',
)

watch(
  () => props.open,
  (open) => {
    if (!open)
      return

    comment.value = ''
    touched.value = false
  },
)

function confirm() {
  touched.value = true

  if (invalid.value)
    return

  emit('confirm', comment.value.trim())
}
</script>

<template>
  <Dialog
    :open="open"
    @update:open="emit('update:open', $event)"
  >
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{{ copy.title }}</DialogTitle>
        <DialogDescription>{{ copy.description }}</DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <div
          v-if="documentLabel"
          class="rounded-md border bg-muted/40 p-3 text-sm"
        >
          <p class="font-medium">
            {{ documentLabel }}
          </p>
          <p v-if="stepName" class="text-xs text-muted-foreground">
            {{ stepName }}
          </p>
        </div>

        <div class="space-y-2">
          <Label for="workflow-decision-comment">
            {{ copy.label }}
          </Label>

          <Textarea
            id="workflow-decision-comment"
            v-model="comment"
            :rows="4"
            :placeholder="copy.required ? 'Wajib diisi' : 'Boleh dikosongkan'"
          />

          <p
            v-if="touched && invalid"
            class="text-sm text-destructive"
          >
            {{ copy.label }} wajib diisi.
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="ghost"
          :disabled="submitting"
          @click="emit('update:open', false)"
        >
          Batal
        </Button>

        <Button
          :variant="copy.variant"
          :disabled="submitting"
          @click="confirm"
        >
          {{ submitting ? 'Memproses…' : copy.confirm }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
