/*
|--------------------------------------------------------------------------
| Label hasil generator yang bisa diterjemahkan
|--------------------------------------------------------------------------
|
| Sampai sebelum ini generator memancarkan label Inggris sebagai literal:
|
|     column.text("employee_no", "Employee Number")
|
| Sekarang ia bisa memancarkan bentuk yang mencari terjemahan lebih dulu:
|
|     column.text("employee_no", resourceLabel("hr.employees.fields.employee_no", "Employee Number"))
|
| Argumen keduanya **teks Inggris yang sama persis dengan sebelumnya**.
| `resourceLabel` mengembalikannya apa adanya kalau kuncinya belum ada di
| katalog. Jadi modul yang diregenerate tapi belum diterjemahkan tampil
| sama persis seperti sebelumnya, dalam bahasa apa pun.
|
| **Opt-in.** Tanpa namespace, seluruh fungsi di sini mengembalikan
| literal yang identik dengan keluaran lama — byte per byte. Modul yang
| sudah ada tidak berubah sampai seseorang memang menyalakannya.
|
| Cara menyalakannya, berurutan menurut prioritas:
|
|   1. `schema.i18n.namespace` dari backend (jalur yang dituju)
|   2. `schema.i18n_namespace` — bentuk datar, untuk schema lama
|   3. opsi `--i18n=<namespace>` di CLI
|
| Tidak ada penurunan otomatis dari `modulePath`. Namespace adalah
| kontrak dengan katalog terjemahan; menebaknya dari nama folder berarti
| memindahkan folder diam-diam memutus seluruh terjemahannya.
*/

/**
 * Namespace i18n untuk sebuah schema, atau `null` kalau tidak disetel.
 */
export function i18nNamespace(schema, options = {}) {
  const fromSchema
    = schema?.i18n?.namespace
      ?? schema?.i18n_namespace
      ?? null

  const ns = fromSchema ?? options.i18n ?? null

  if (!ns || typeof ns !== 'string')
    return null

  const trimmed = ns.trim().replace(/\.+$/, '')

  return trimmed || null
}

/*
| Kunci yang dipancarkan selama satu kali generate, untuk dicetak di
| akhir supaya bisa disalin ke berkas katalog.
|
| Sekadar catatan, bukan keadaan yang dibaca siapa pun: `reset` dipanggil
| di awal tiap modul.
*/
let collected = new Map()

export function resetCollectedKeys() {
  collected = new Map()
}

export function collectedKeys() {
  return [...collected.entries()].map(([key, label]) => ({ key, label }))
}

function jsString(value) {
  return JSON.stringify(String(value ?? ''))
}

/**
 * Ekspresi JS untuk sebuah label.
 *
 * `namespace` null  -> literal, persis seperti keluaran lama.
 * `namespace` diisi -> panggilan `resourceLabel(kunci, literal)`.
 *
 * `kind` memisahkan ruang kunci: `fields` untuk kolom & field form,
 * `filters` untuk penyaring, `actions` untuk tombol aksi. Tanpa itu
 * kolom "Status" dan filter "Status" berebut satu kunci, dan yang satu
 * akan menang tanpa ada yang tahu.
 */
export function labelExpr(namespace, kind, name, label) {
  const literal = jsString(label)

  if (!namespace || !name)
    return literal

  const key = `${namespace}.${kind}.${name}`

  collected.set(key, String(label ?? ''))

  return `resourceLabel(${jsString(key)}, ${literal})`
}

/**
 * Kunci terjemahan untuk sebuah label, atau `null`.
 *
 * Dipakai jalur yang menyimpan label sebagai **konfigurasi tingkat
 * modul** — `createForm([...])` dan `createFilters({...})` adalah
 * `const` di puncak berkas, jadi isinya dihitung **sekali saat modul
 * dimuat**, bukan tiap render.
 *
 * Memanggil `resourceLabel()` di sana tidak berhasil, dan gagalnya
 * tidak berbunyi: saat chunk-nya dievaluasi, instance i18n belum tentu
 * terpasang, jadi seluruh label jatuh ke teks Inggris — untuk kedua
 * bahasa sekaligus. Terbukti di UAT: header tabel ikut bahasa (dirakit
 * di dalam fungsi render), sementara label form tidak (dirakit di
 * module scope).
 *
 * Jadi yang disimpan **kuncinya**, dan yang menerjemahkan adalah
 * komponen saat merender. `label` tetap teks Inggris apa adanya, jadi
 * apa pun yang membaca `.label` tetap mendapat string seperti dulu.
 */
export function labelKey(namespace, kind, name, label) {
  if (!namespace || !name)
    return null

  const key = `${namespace}.${kind}.${name}`

  collected.set(key, String(label ?? ''))

  return key
}

/**
 * Potongan yang disisipkan ke baris `import ... from "@framework"`.
 *
 * Kosong kalau i18n mati — supaya berkas hasil generate tidak membawa
 * import yang tidak dipakainya.
 */
export function i18nImport(namespace) {
  return namespace ? ', resourceLabel' : ''
}
