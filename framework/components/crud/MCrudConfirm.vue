<script setup lang="ts">
/*
| Konfirmasi generik untuk aksi yang BUKAN penghapusan.
|
| Sebelum ini aksi massal memakai ulang `MCrudDelete`, dan itu keliru
| dengan cara yang paling berbahaya: `confirm-delete.vue` menanam teks
| tombol "Delete" beserta warna merahnya, jadi konfirmasi "Post saldo
| awal?" — aksi yang justru MENERBITKAN saldo untuk puluhan pegawai —
| tampil sebagai tombol merah bertuliskan Delete. Yang membacanya punya
| dua pilihan yang sama-sama salah: menekannya sambil mengira sedang
| menghapus, atau membatalkannya sambil mengira layarnya rusak.
|
| Judul dan keterangan datang dari schema; label tombolnya dari
| `confirmLabel`, dan warnanya hanya merah kalau aksinya memang
| destruktif.
*/
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /* Nama varian dari schema — hanya "destructive" yang jadi merah. */
  variant?: string | null
  loading?: boolean
}>(), {
  title: "",
  description: "",
  confirmLabel: "",
  /*
   * Kosong, bukan "Cancel".
   *
   * Default `withDefaults` dievaluasi sekali saat modul dimuat, jadi
   * teks apa pun yang ditaruh di sini tidak akan pernah ikut berganti
   * bahasa. Fallback-nya dipindah ke template, tempat `$t` reaktif.
   * Perilakunya sama persis bagi pemanggil yang tidak mengisinya.
   */
  cancelLabel: "",
  variant: "default",
  loading: false,
})

const emit = defineEmits<{
  (e: "update:open", value: boolean): void
  (e: "confirm"): void
}>()

function close() {
  emit("update:open", false)
}
</script>

<template>
  <AlertDialog :open="open" @update:open="close">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {{ props.title || $t('common.state.confirmTitle') }}
        </AlertDialogTitle>

        <AlertDialogDescription v-if="props.description">
          {{ props.description }}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel :disabled="props.loading" @click="close">
          {{ props.cancelLabel || $t('common.actions.cancel') }}
        </AlertDialogCancel>

        <AlertDialogAction
          :class="props.variant === 'destructive'
            ? 'bg-red-600 hover:bg-red-700'
            : undefined"
          :disabled="props.loading"
          @click="emit('confirm')"
        >
          {{ props.confirmLabel || props.title || $t('common.actions.confirm') }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
