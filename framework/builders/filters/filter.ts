import type {
  CrudFilter,
  FilterOption,
  FilterPlacement,
} from "./types"

type FilterExtra = {
  placeholder?: string

  /*
   * Kunci terjemahan untuk `label` — lihat `CrudFilter.labelKey`.
   *
   * Ditulis eksplisit karena `FilterExtra` adalah tipe literal
   * tersendiri, bukan `Omit<CrudFilter, ...>` seperti padanannya di
   * `field.ts`. Menambah kolom ke `CrudFilter` saja tidak cukup, dan
   * gagalnya muncul sebagai "does not exist in type 'FilterExtra'" di
   * berkas hasil generate — bukan di tipe yang lupa diperbarui.
   */
  labelKey?: string
  placement?: FilterPlacement
  props?: Record<string, any>
  visible?: boolean
  width?: string

  /*
   * Filter berantai. Keduanya sudah lama dihasilkan generator dan sudah
   * lama dibaca `MCrudFilters`, tapi tidak pernah ada di tipe ini —
   * jadi setiap modul yang punya filter berantai membawa satu error
   * TypeScript yang tidak menandakan apa pun. `dependsOn` menerima
   * daftar, sebentuk dengan `depends_on` di schema.
   */
  dependsOn?: string | string[] | null
  lookupParams?: Record<string, any>

  /*
   * Rentang tanggal — lihat catatan panjangnya di `CrudFilter`.
   * Ditulis ulang di sini karena `FilterExtra` tipe literal tersendiri,
   * bukan turunan `CrudFilter`; menambah kolom di sana saja membuat
   * keluaran generator gagal dengan "does not exist in type
   * 'FilterExtra'" — di berkas hasil generate, bukan di tipe yang lupa
   * diperbarui.
   */
  fromKey?: string
  toKey?: string
  defaultRange?: string | null
  maxDays?: number | null
  presets?: string[] | null
  required?: boolean
}

export const filter = {
  text(key: string, label?: string, extra: FilterExtra = {}): CrudFilter {
    return { key, type: "text", label, ...extra }
  },

  select(
    key: string,
    label: string,
    options: FilterOption[],
    extra: FilterExtra = {},
  ): CrudFilter {
    return { key, type: "select", label, options, ...extra }
  },

  lookup(
    key: string,
    label: string,
    endpoint: string,
    extra: FilterExtra = {},
  ): CrudFilter {
    return { key, type: "lookup", label, endpoint, ...extra }
  },

  multiLookup(
    key: string,
    label: string,
    endpoint: string,
    extra: FilterExtra = {},
  ): CrudFilter {
    return { key, type: "multiLookup", label, endpoint, multiple: true, ...extra }
  },

  date(key: string, label: string, extra: FilterExtra = {}): CrudFilter {
    return { key, type: "date", label, ...extra }
  },

  /*
   * Rentang tanggal, dua query param dalam satu kontrol.
   *
   * `fromKey`/`toKey` punya bawaan `date_from`/`date_to` — sama dengan
   * `apps.framework.list_period` — supaya pemanggil yang tidak
   * menyebutkannya tetap mendarat di parameter yang benar, bukan di
   * parameter yang tidak dibaca siapa pun.
   */
  dateRange(key: string, label = "Period", extra: FilterExtra = {}): CrudFilter {
    return {
      key,
      type: "dateRange",
      label,
      fromKey: "date_from",
      toKey: "date_to",
      ...extra,
    }
  },

  boolean(key: string, label: string, extra: FilterExtra = {}): CrudFilter {
    return { key, type: "boolean", label, ...extra }
  },

  custom(key: string, component: any, extra: FilterExtra = {}): CrudFilter {
    return { key, type: "custom", component, ...extra }
  },
}