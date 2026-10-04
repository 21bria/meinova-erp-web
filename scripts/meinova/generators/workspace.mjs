import { labelKey } from "./i18n.mjs"

function humanize(value) {
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase())
}

function normalizeTab(tab, index) {
  if (!tab || typeof tab !== "object")
    return null

  const key = tab.key ?? tab.name ?? tab.id

  if (!key)
    return null

  return {
    key: String(key),

    label:
      tab.label
      ?? humanize(key),

    type:
      tab.type
      ?? "form",

    fields:
      Array.isArray(tab.fields)
        ? tab.fields
        : (
          tab.fields
            && typeof tab.fields === "object"
            ? Object.entries(tab.fields).map(
              ([key, config]) => ({
                key,
                ...config,

                endpoint:
                  config.endpoint
                  ?? config.lookup_endpoint
                  ?? null,

                dependsOn:
                  config.dependsOn
                  ?? config.depends_on
                  ?? null,

                lookupParams:
                  config.lookupParams
                  ?? config.lookup_params
                  ?? {},

                /*
                * Lookup table menampilkan label,
                * bukan foreign-key ID.
                *
                * Backend dapat menentukan:
                * display_key="currency_code"
                *
                * Jika tidak ditentukan, fallback:
                * bank       -> bank_name
                * payroll_group -> payroll_group_name
                */
                displayKey:
                  config.displayKey
                  ?? config.display_key
                  ?? (
                    config.type === "lookup"
                      ? `${key}_name`
                      : key
                  ),
              }),
            )
            : null
        ),

    modes:
      Array.isArray(tab.modes)
        ? tab.modes
        : null,

    endpoint:
      tab.endpoint ?? null,

    module:
      tab.module ?? null,

    foreignKey:
      tab.foreign_key
      ?? tab.foreignKey
      ?? null,

    component:
      tab.component ?? null,

    icon:
      tab.icon ?? null,

    readonly:
      Boolean(tab.readonly),

    disabled:
      Boolean(tab.disabled),

    requiresRecord:
      Boolean(
        tab.requires_record
        ?? tab.requiresRecord,
      ),

    // Tab resource yang barisnya disunting langsung di tabel, bukan lewat
    // dialog per baris. Dipakai data yang bentuk aslinya memang tabel
    // jadwal — periode roster, travel arrangement.
    inline:
      Boolean(
        tab.inline
        ?? tab.editable,
      ),

    // Tab resource yang barisnya dibuat di tempat lain — mis. tabel
    // akomodasi yang menumpang baris travel. Hanya `false` eksplisit yang
    // mematikan tombol tambah; tab tanpa flag tetap bisa menambah baris.
    canCreate:
      (tab.create ?? tab.canCreate) !== false,

    // Syarat kunci per record, mis. `{"field": "is_editable", "op":
    // "is_false"}` pada tabel anak Travel Request. Dinilai komponen
    // Workspace terhadap record induknya (`actionVisible`). Dulu tidak
    // diteruskan sama sekali, jadi tab anak dokumen yang sudah diajukan
    // tetap menawarkan Add Row/hapus — yang didapat pengguna cuma 400.
    // Hanya ditulis kalau schema menyebutnya: modul lain yang
    // diregenerate tidak berubah satu byte pun karenanya.
    ...(
      (tab.readonly_when ?? tab.readonlyWhen)
        ? { readonlyWhen: tab.readonly_when ?? tab.readonlyWhen }
        : {}
    ),

    // `delete: false` = baris yang sudah tersimpan tidak bisa dihapus dari
    // tab ini (draft yang belum disimpan tetap bisa dibuang) — mis. tab
    // Accommodation Travel Request, yang barisnya etape perjalanan itu
    // sendiri. Hanya ditulis kalau dimatikan.
    ...(
      (tab.delete ?? tab.canDelete) === false
        ? { canDelete: false }
        : {}
    ),

    // Teks bantu singkat di kepala tab. Diterjemahkan lewat
    // `descriptionKey` (lihat `markLabels`). Hanya ditulis kalau ada.
    ...(
      typeof tab.description === "string" && tab.description
        ? { description: tab.description }
        : {}
    ),

    showOnCreate:
      tab.show_on_create
      ?? tab.showOnCreate
      ?? true,

    order:
      Number.isFinite(Number(tab.order))
        ? Number(tab.order)
        : (index + 1) * 10,
  }
}

export function getWorkspaceTabs(schema) {
  const source =
    schema?.ui?.workspace?.tabs
    ?? schema?.workspace?.tabs
    ?? schema?.tabs

  if (!Array.isArray(source))
    return []

  return source
    .map(normalizeTab)
    .filter(Boolean)
    .sort(
      (a, b) =>
        (a.order ?? 9999)
        - (b.order ?? 9999),
    )
}

/**
 * @param tab  key tab yang sedang dimasuki, atau `null` di tingkat atas.
 */
function markLabels(node, namespace, tab = null) {
  if (Array.isArray(node))
    return node.map(item => markLabels(item, namespace, tab))

  if (!node || typeof node !== "object")
    return node

  const isTab = typeof node.type === "string"
    && (node.type === "form" || node.type === "resource")
    && Array.isArray(node.fields)

  const inner = isTab ? String(node.key) : tab

  const out = {}

  for (const [key, value] of Object.entries(node)) {
    /*
     * Hanya `label` milik objek yang punya `key`. Objek tanpa `key`
     * tidak bisa diberi kunci terjemahan yang stabil, dan menebaknya
     * dari urutan berarti terjemahannya berpindah begitu ada field
     * yang disisipkan.
     */
    if (key === "label" && typeof value === "string" && node.key) {
      /*
       * Tab dapat `tabs.<key>`.
       *
       * Field **di dalam** tab dapat `<tabkey>.fields.<key>`, bukan
       * `fields.<key>`. Alasannya konkret: tab `steps` di layar
       * Workflow Definition menampilkan field milik resource **lain**
       * (Workflow Step), dan di sana `name` berarti "Step Name" —
       * sementara `fields.name` milik Definition sendiri berarti
       * "Name". Satu ruang kunci membuat yang satu memungut kalimat
       * milik yang lain, dan salahnya tidak berbunyi: kolomnya cuma
       * menyebut hal yang keliru.
       */
      const kind = isTab
        ? "tabs"
        : (tab ? `${tab}.fields` : "fields")

      /*
       * Label tetap teks Inggris; kuncinya ditaruh di `labelKey` di
       * sebelahnya. `workspace.ts` juga `const` tingkat module —
       * memanggil `resourceLabel()` di sana menghasilkan bahasa
       * Inggris untuk kedua bahasa. Yang menerjemahkan komponen
       * Workspace saat merender.
       */
      out[key] = value

      const k = labelKey(namespace, kind, node.key, value)

      if (k)
        out.labelKey = k

      continue
    }

    /*
     * Teks bantu tab dapat `tabHints.<key>` — ruang kunci sendiri,
     * supaya tidak bertabrakan dengan label tab di `tabs.<key>`.
     */
    if (key === "description" && isTab && typeof value === "string") {
      out[key] = value

      const k = labelKey(namespace, "tabHints", node.key, value)

      if (k)
        out.descriptionKey = k

      continue
    }

    out[key] = markLabels(value, namespace, inner)
  }

  return out
}

export function generateWorkspaceTabs(schema, namespace = null) {
  const tabs = getWorkspaceTabs(schema)

  // Murni JSON — tidak ada ekspresi yang perlu disisipkan lagi sejak
  // labelnya dititipkan sebagai `labelKey` alih-alih dipanggil di sini.
  return JSON.stringify(
    namespace ? markLabels(tabs, namespace) : tabs,
    null,
    2,
  )
}

export function generateWorkspaceDefaultTab(schema) {
  const tabs = getWorkspaceTabs(schema)

  const configured =
    schema?.ui?.workspace?.default_tab
    ?? schema?.ui?.workspace?.defaultTab
    ?? schema?.ui?.default_tab
    ?? schema?.ui?.defaultTab

  if (
    configured
    && tabs.some(tab => tab.key === configured)
  ) {
    return JSON.stringify(configured)
  }

  return JSON.stringify(
    tabs.find(tab => !tab.disabled)?.key
    ?? "",
  )
}
