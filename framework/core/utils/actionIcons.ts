/*
| Ikon dari schema adalah **nama**, bukan komponen — backend tidak boleh
| mengirim komponen Vue. Yang tidak dikenal jatuh ke ikon bawaan, sama
| seperti registry ikon di halaman depan: salah ketik nama ikon tidak
| boleh menjatuhkan tombolnya.
|
| Satu peta untuk record action DAN collection action. Dua salinan yang
| harus tetap sama adalah persis cara satu tombol punya ikonnya dan
| tombol sebelahnya jatuh ke ikon bawaan tanpa ada yang tahu kenapa —
| pelajaran yang sama dengan `resolveLookupParams`.
|
| Nama yang ditambahkan di sini WAJIB benar-benar ada di
| `lucide-vue-next`: nama yang salah di sebuah impor menggagalkan
| pemuatan modul dan menjatuhkan halamannya dengan 500, bukan cuma
| menghilangkan satu ikon. Periksa dulu:
|
|   node -e "console.log('NamaIkon' in require('lucide-vue-next'))"
*/
import {
  CalendarCog,
  CalendarPlus,
  CalendarSearch,
  CalendarSync,
  CheckCircle2,
  Clock,
  Copy,
  FilePlus2,
  RefreshCw,
  RotateCcw,
  Send,
  Trash2,
  Undo2,
  UserPlus,
  XCircle,
  Zap,
} from "lucide-vue-next"

export const ACTION_ICONS: Record<string, any> = {
  CalendarCog,
  // Ketiganya sudah lama disebut schema Roster Schedule dan tidak
  // pernah ada di sini, jadi Generate Periods, Extend Schedule, dan
  // Set Shift Pattern memakai ikon bawaan yang sama — tiga tombol
  // berbeda yang terlihat persis sama di satu baris.
  CalendarPlus,
  CalendarSearch,
  CalendarSync,
  CheckCircle2,
  Clock,
  Copy,
  FilePlus2,
  RefreshCw,
  RotateCcw,
  Send,
  Trash2,
  Undo2,
  UserPlus,
  XCircle,
}

export const ACTION_ICON_FALLBACK = Zap

export function actionIcon(name?: string | null) {
  return ACTION_ICONS[String(name ?? "")] ?? ACTION_ICON_FALLBACK
}
