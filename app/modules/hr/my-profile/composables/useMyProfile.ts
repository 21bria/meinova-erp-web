import { useApi } from '@/composables/useApi'

/**
 * Data untuk layar **My Profile** (`/hr/my-profile`).
 *
 * Read-only sepenuhnya, dan itu bukan tombol Save yang disembunyikan:
 * satu-satunya endpoint tulis yang menyentuh kartu pegawai adalah
 * `PATCH /api/hr/employees/<id>/`, yang membalas **403** untuk role
 * `EMPLOYEE`. Halaman ini tidak pernah memanggilnya.
 *
 * **Susunan layarnya dibaca dari `ui-schema`, bukan ditulis ulang di
 * sini.** Backend sudah jadi sumber kebenaran untuk label, urutan, dan
 * pengelompokan tab di kartu pegawai; menyalinnya ke halaman ini
 * berarti dua daftar field yang harus dijaga tetap sama, dan yang
 * kedua akan basi diam-diam — kolom yang ditambahkan HR besok tidak
 * akan pernah muncul di halaman pegawainya sendiri.
 */

export type ProfileField = {
  key: string
  label: string
  type: string
  displayKey?: string
  hidden?: boolean
}

export type ProfileSection = {
  key: string
  label: string
  kind: 'fields' | 'resource' | 'history'
  fields: ProfileField[]
  endpoint?: string
}

/**
 * Tab yang **tidak** ikut ditampilkan.
 *
 * `activity` adalah jejak audit — siapa mengubah apa, kapan. Itu alat
 * administrasi, bukan informasi yang dicari orang saat membuka datanya
 * sendiri, dan barisnya menyebut nama admin yang menyuntingnya.
 */
const EXCLUDED_TABS = new Set(['activity'])

export function useMyProfile() {
  const { request } = useApi()

  const record = ref<Record<string, any> | null>(null)
  const sections = ref<ProfileSection[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  /**
   * Tipe yang tidak punya bentuk baca yang masuk akal di grid teks.
   *
   * `avatar` bertipe `image`, dan nilainya jalur berkas — dicetak apa
   * adanya ia jadi baris "employees/avatars/9f3c.png" yang tidak
   * memberi tahu apa pun. Fotonya dipindah ke kepala halaman, tempat
   * foto profil memang dicari orang.
   */
  const SKIPPED_TYPES = new Set(['file', 'image'])

  function toField(key: string, config: any): ProfileField {
    /*
     * `modes` membatasi field ke layar tertentu. Halaman ini membaca
     * record yang **sudah ada**, jadi yang setara dengannya `edit` —
     * field ber-`modes: ["create"]` tidak boleh ikut.
     *
     * Yang paling terasa: `auto_generate_employee_number`, sebuah
     * saklar yang cuma bermakna saat pegawainya dibuat. Di halaman
     * baca ia muncul sebagai baris "Auto Generate Employee Number:
     * Tidak" — pernyataan yang tidak menjelaskan apa pun tentang orang
     * yang sedang membacanya.
     */
    const modes = config?.modes

    const wrongMode
      = Array.isArray(modes)
        && modes.length > 0
        && !modes.includes('edit')

    const type = String(config?.type ?? 'text')

    return {
      key,
      label: String(config?.label ?? key.replace(/_/g, ' ')),
      type,
      displayKey: config?.display_key ?? undefined,
      hidden:
        config?.hidden === true
        || wrongMode
        || SKIPPED_TYPES.has(type),
    }
  }

  function buildSections(schema: any): ProfileSection[] {
    const fields = schema?.fields ?? {}
    const tabs = Array.isArray(schema?.tabs) ? schema.tabs : []

    const result: ProfileSection[] = []

    for (const tab of tabs) {
      if (EXCLUDED_TABS.has(tab?.key))
        continue

      const kind
        = tab?.type === 'resource'
          ? 'resource'
          : tab?.type === 'history'
            ? 'history'
            : 'fields'

      /*
       * `fields` sebuah tab punya **dua bentuk**: tab form menyebut
       * nama kolom (`string[]`), tab resource membawa salinan config
       * field-nya sendiri (dict). Menangani satu saja membuat separuh
       * tab kosong tanpa satu pun pesan.
       */
      const raw = tab?.fields
      let list: ProfileField[] = []

      if (Array.isArray(raw)) {
        list = raw
          .map((key: string) => toField(key, fields[key]))
          .filter(f => !f.hidden)
      }
      else if (raw && typeof raw === 'object') {
        list = Object.entries(raw)
          .map(([key, config]) => toField(key, config))
          .filter(f => !f.hidden)
      }

      // Tab form tanpa satu pun field yang bisa ditampilkan tidak
      // dirender: judul yang dibuka lalu kosong terbaca seperti
      // halaman gagal memuat, bukan seperti "belum ada isinya".
      if (kind === 'fields' && !list.length)
        continue

      result.push({
        key: String(tab?.key ?? ''),
        label: String(tab?.label ?? tab?.key ?? ''),
        kind,
        fields: list,
        endpoint: tab?.endpoint ?? undefined,
      })
    }

    return result
  }

  async function load() {
    pending.value = true
    error.value = null

    try {
      /*
       * Dua permintaan sekaligus, bukan berurutan: keduanya tidak
       * saling bergantung, dan halaman profil dibuka sambil menunggu.
       *
       * `ui-schema` sengaja `AllowAny` di backend supaya generator
       * bisa jalan — jadi ia tidak pernah gagal karena hak akses, dan
       * yang menentukan isi halaman tetap payload `me/` yang memang
       * sudah tersaring `EmployeeDataPolicy`.
       */
      const [me, schema] = await Promise.all([
        request<any>('/api/hr/employees/me/'),
        request<any>('/api/hr/employees/ui-schema/'),
      ])

      record.value = me?.data ?? me ?? null
      sections.value = buildSections(schema?.data ?? schema)
    }
    catch (err: any) {
      // 404 di sini punya arti tersendiri dan bukan kesalahan sistem:
      // akun yang belum ditautkan ke kartu pegawai. Pesan dari backend
      // sudah menyebut jalan keluarnya, jadi diteruskan apa adanya.
      error.value
        = err?.data?.message
          ?? err?.data?.detail
          ?? 'Gagal memuat data. Coba muat ulang halaman.'
    }
    finally {
      pending.value = false
    }
  }

  return {
    record,
    sections,
    pending,
    error,
    load,
  }
}
