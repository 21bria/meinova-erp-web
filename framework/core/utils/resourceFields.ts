import type { FormField } from "../../builders/forms/types"

/*
|--------------------------------------------------------------------------
| Field tab resource
|--------------------------------------------------------------------------
|
| Tab resource pada workspace membawa **konfigurasi field mentah dari
| backend** — `lookup_endpoint`, `read_only`, `display_key`,
| `visible_when`, semuanya snake_case. Field pada `form.ts` sebaliknya
| sudah dipetakan generator ke camelCase.
|
| Dulu keduanya dioper apa adanya ke `MFormBuilder`, dan komponen itu
| membaca `endpoint` / `readonly` / `displayKey`. Akibatnya di tab
| resource:
|
| * dropdown lookup tidak pernah punya sumber data (`lookup_endpoint`
|   tidak pernah dibaca) — daftarnya kosong, tanpa error;
| * kolom read-only tetap bisa diketik;
| * `visible_when` diabaikan, jadi seluruh field usulan Employee Action
|   tampil sekaligus walau Action Type belum dipilih.
|
| Pemetaannya ditaruh di sini, bukan di tiap modul: satu tempat, dibaca
| semua tab resource di semua workspace hasil generate.
*/

const KEY_MAP: Record<string, string> = {
  lookup_endpoint: "endpoint",
  lookup_params: "lookupParams",
  display_key: "displayKey",
  depends_on: "dependsOn",
  read_only: "readonly",
  visible_when: "visibleWhen",
  help_text: "hint",
  required_on_create: "requiredOnCreate",
  ordering_key: "orderingKey",
  max_size_mb: "maxSizeMb",
  upload_endpoint: "uploadEndpoint",
  upload_mode: "uploadMode",
  value_mode: "valueMode",
  detail_field: "detailField",
}

// Kolom audit dan turunan yang tidak pernah diisi orang. Dibuang di
// sini supaya tiap tab resource tidak perlu menyebutkan `form: false`
// satu per satu.
const DROPPED = new Set([
  "id",
  "created_at",
  "updated_at",
  "deleted_at",
  "created_by",
  "updated_by",
  "deleted_by",
  "is_deleted",
])

export type NormalizeResourceFieldsOptions = {
  /**
   * Nama kolom induk (`foreignKey` pada tab).
   *
   * Dibuang dari form: induknya sudah ditentukan tab yang sedang
   * dibuka, dan menampilkannya berarti meminta orang memilih ulang
   * pegawai yang kartunya sedang ia buka — lalu membiarkannya memilih
   * pegawai yang salah.
   */
  parentField?: string | null
}

export function normalizeResourceFields(
  fields: any,
  options: NormalizeResourceFieldsOptions = {},
): FormField[] {
  if (!Array.isArray(fields))
    return []

  const parentField = options.parentField
    ? String(options.parentField)
    : null

  const result: FormField[] = []

  for (const raw of fields) {
    if (!raw || typeof raw !== "object")
      continue

    const key = String(raw.key ?? "")

    if (!key || DROPPED.has(key))
      continue

    if (parentField && key === parentField)
      continue

    const mapped: Record<string, any> = {}

    for (const [name, value] of Object.entries(raw)) {
      const target = KEY_MAP[name] ?? name

      // Yang sudah dipetakan generator menang atas bentuk mentahnya —
      // field yang membawa dua-duanya tidak boleh tergantung urutan
      // kunci di JSON.
      if (mapped[target] !== undefined && KEY_MAP[name])
        continue

      mapped[target] = value
    }

    // Field read-only tetap ikut hanya kalau memang diminta tampil
    // (`display: true`). Aturan yang sama dengan generator form —
    // tanpa itu kolom audit ikut terseret masuk.
    if (mapped.readonly === true && mapped.display !== true)
      continue

    result.push(mapped as FormField)
  }

  return result
}
