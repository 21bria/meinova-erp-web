import { labelKey } from "./i18n.mjs"

function q(value) {
  return JSON.stringify(value)
}

function cleanOptions(options) {
  return Object.fromEntries(
    Object.entries(options).filter(
      ([, value]) =>
        value !== undefined
        && value !== null,
    ),
  )
}

function formatOptions(options) {
  const clean = cleanOptions(options)

  if (!Object.keys(clean).length)
    return ""

  return `, ${JSON.stringify(
    clean,
    null,
    2,
  ).replace(/\n/g, "\n    ")}`
}

function normalizeAccept(accept) {
  if (!accept)
    return undefined

  if (Array.isArray(accept))
    return accept

  return accept
}

function isUploadField(meta) {
  return (
    meta.type === "file"
    || meta.widget === "upload"
    || meta.widget === "image-upload"
  )
}

export function generateFormFields(schema, namespace = null) {
  const fields = schema.fields ?? {}

  return Object.entries(fields)
    .sort(
      ([, a], [, b]) =>
        (
          a.form?.order
          ?? a.order
          ?? 100
        )
        - (
          b.form?.order
          ?? b.order
          ?? 100
        ),
    )
    .filter(
      ([, meta]) => {
        if (meta.form === false)
          return false

        /*
         * `display: true` memaksa field read-only tetap masuk form
         * sebagai nilai tampilan.
         *
         * Aturan bawaannya membuang semua yang read-only — benar untuk
         * kolom audit dan turunan hasil introspeksi, tapi salah untuk
         * nilai yang memang sengaja ditaruh backend di sebuah tab
         * (mis. Department/Email pegawai di dokumen Travel Request).
         * Tanpa penanda ini field itu hilang dari `form.ts` tanpa error
         * — schema-nya benar, tabnya menyebutnya, tapi layarnya kosong.
         *
         * Sengaja kunci tersendiri, bukan `form: true`: `form` diisi
         * otomatis oleh introspeksi backend (`not field.auto_created`)
         * untuk hampir semua kolom model, jadi memakainya sebagai
         * penanda paksa akan menyeret masuk kolom read-only milik module
         * lain yang tidak meminta apa-apa.
         */
        if (meta.display === true)
          return true

        return meta.read_only !== true
      },
    )
    .filter(([name, meta]) => {
      if (
        [
          "id",
          "created_at",
          "updated_at",
          "deleted_at",
        ].includes(name)
      ) {
        return false
      }

      if (
        [
          "created_by",
          "updated_by",
          "deleted_by",
        ].includes(name)
      ) {
        return false
      }

      if (name === "is_deleted")
        return false

      if (
        meta.type === "lookup"
        && !meta.lookup_endpoint
      ) {
        return false
      }

      return true
    })
    .map(([name, meta]) => {
      const label =
        meta.label
        ?? name
          .replace(/_/g, " ")
          .replace(/-/g, " ")
          .replace(
            /\b\w/g,
            char => char.toUpperCase(),
          )

      // Label tetap literal Inggris. Kuncinya dititipkan lewat
      // `labelKey` di objek opsi — `field.*` menyalin seluruh `extra`
      // apa adanya, jadi tidak ada builder yang perlu diubah, dan
      // `MFormBuilder` yang menerjemahkannya saat merender.
      const L = q(label)
      const LK = labelKey(namespace, "fields", name, label)

      const options = {
        ...(LK ? { labelKey: LK } : {}),
        required:
          meta.required === true
            ? true
            : undefined,

        placeholder: meta.placeholder,

        disabled:
          meta.disabled === true
            ? true
            : undefined,

        readonly:
          (
            meta.readonly === true
            || meta.read_only === true
          )
            ? true
            : undefined,

        autofill:
          meta.autofill
          ?? undefined,

        dependsOn:
          meta.depends_on
          ?? meta.dependsOn
          ?? meta.depends,

        lookupParams:
          meta.lookup_params
          ?? meta.lookupParams,

        // Kunci label siap tampil dari API.
        //
        // Dulu dibuang di sini — `display_key` hanya dibaca generator
        // kolom dan workspace — sehingga field lookup di form harus
        // menebak labelnya dari daftar opsi. Lookup yang daftarnya
        // termuat penuh saat halaman dibuka selamat; yang daftarnya
        // dimuat belakangan (mis. daftar pegawai untuk "Reports To")
        // menampilkan **pk mentah** sampai dropdown-nya diklik.
        displayKey:
          meta.display_key
          ?? meta.displayKey,

        /*
         * Syarat tampil dari schema backend.
         *
         * Dulu dibuang di sini, dan akibatnya form tidak pernah bisa
         * context-aware: kolom Contract Start/End milik pegawai tetap
         * tetap ikut tampil, dan tanggal probation muncul untuk orang
         * yang tidak menjalani masa percobaan. Aturannya ditulis di
         * schema — satu tempat, dibaca layar mana pun yang memakai
         * field itu.
         */
        visibleWhen:
          meta.visible_when
          ?? meta.visibleWhen,

        // Terkunci bersyarat — bentuknya sama dengan `visible_when`.
        readonlyWhen:
          meta.readonly_when
          ?? meta.readonlyWhen,

        /*
         * Keterangan di bawah field.
         *
         * Dulu dibuang di sini, jadi `help_text` yang ditulis di schema
         * backend tidak pernah sampai ke layar — dan yang menulisnya
         * tidak punya cara tahu, karena tidak ada error, cuma
         * keterangan yang tidak muncul. `MFieldHint` sudah lama
         * merendernya; yang hilang cuma jalannya ke sana.
         */
        hint:
          meta.help_text
          ?? meta.helpText
          ?? meta.hint,

        hidden:
          meta.hidden === true
            ? true
            : undefined,

        // Layar tempat field ini boleh tampil. Kosong = semua.
        modes:
          Array.isArray(meta.modes)
            ? meta.modes
            : undefined,

        /*
         * Nilai awal di layar create.
         *
         * Dulu dibuang di sini, jadi `default=True` di schema tidak
         * pernah sampai ke mana pun: switch "Auto Generate Employee
         * Number" tampil **mati** padahal schema-nya menyalakannya,
         * dan field yang syarat tampilnya bergantung pada switch itu
         * ikut salah.
         */
        default:
          meta.default !== undefined
            ? meta.default
            : undefined,

        /*
         * Lookup banyak nilai — kolom ManyToMany.
         *
         * Dulu dibuang di sini, jadi `multiple=True` di schema backend
         * tidak pernah sampai ke form: field ManyToMany dirender
         * sebagai lookup satu nilai, dan layar memperlihatkan **id
         * mentah** alih-alih nama pilihannya.
         */
        multiple:
          meta.multiple === true
            ? true
            : undefined,

        rows: meta.rows,
        layout: meta.layout,
        tab: meta.tab ?? "general",

        order:
          meta.form?.order
          ?? meta.order,
      }

      if (
        (
          meta.widget === "textarea"
          || meta.type === "textarea"
        )
        && !options.layout
      ) {
        options.layout = "full"
      }

      if (isUploadField(meta)) {
        const uploadOptions = {
          ...options,

          widget:
            meta.widget
            ?? "upload",

          accept: normalizeAccept(
            meta.accept,
          ),

          maxSizeMb:
            meta.max_size_mb
            ?? meta.maxSizeMb
            ?? meta.max_size
            ?? meta.maxSize,

          multiple:
            meta.multiple === true
              ? true
              : false,

          category:
            meta.category
            ?? "attachment",

          public:
            meta.public === true,

          preview:
            meta.preview !== false,

          download:
            meta.download !== false,

          replace:
            meta.replace !== false,

          delete:
            meta.delete !== false,

          uploadEndpoint:
            meta.upload_endpoint
            ?? meta.uploadEndpoint
            ?? "/api/uploads/",

          uploadMode:
            meta.upload_mode
            ?? meta.uploadMode
            ?? "separate",

          valueMode:
            meta.value_mode
            ?? meta.valueMode
            ?? "id",

          detailField:
            meta.detail_field
            ?? meta.detailField
            ?? `${name}_detail`,
        }

        const uploadArgs = formatOptions(
          uploadOptions,
        )

        return `  field.file(${q(name)}, ${L}${uploadArgs}),`
      }

      const args = formatOptions(options)

      // Peringatan konfigurasi backend — hanya tampilan, lihat
      // `MFieldWarnings`. Dicek sebelum `type`, karena field turunan
      // (`SerializerMethodField`) tidak membawa `type`.
      if (meta.widget === "warnings") {
        return `  field.warnings(${q(name)}, ${L}${args}),`
      }

      if (meta.type === "lookup") {
        return `  field.lookup(${q(name)}, ${L}, ${q(meta.lookup_endpoint)}${args}),`
      }

      if (meta.type === "boolean") {
        return `  field.switch(${q(name)}, ${L}${args}),`
      }

      if (meta.type === "email") {
        return `  field.email(${q(name)}, ${L}${args}),`
      }

      if (
        meta.type === "textarea"
        || meta.widget === "textarea"
      ) {
        return `  field.textarea(${q(name)}, ${L}${args}),`
      }

      if (
        meta.type === "richtext"
        || meta.widget === "richtext"
      ) {
        return `  field.richtext(${q(name)}, ${L}${args}),`
      }

      if (
        meta.type === "number"
        || meta.type === "integer"
        || meta.type === "decimal"
        || meta.type === "currency"
        || meta.type === "percentage"
      ) {
        return `  field.number(${q(name)}, ${L}${args}),`
      }

      if (meta.type === "date") {
        return `  field.date(${q(name)}, ${L}${args}),`
      }

      if (meta.type === "datetime") {
        return `  field.datetime(${q(name)}, ${L}${args}),`
      }

      if (meta.type === "time") {
        return `  field.time(${q(name)}, ${L}${args}),`
      }

      if (meta.type === "url") {
        return `  field.url(${q(name)}, ${L}${args}),`
      }

      if (meta.type === "select") {
        const selectOptions = {
          ...options,
          options: meta.options ?? [],
          multiple: meta.multiple === true,
        }

        return `  field.select(${q(name)}, ${L}${formatOptions(selectOptions)}),`
      }

      return `  field.text(${q(name)}, ${L}${args}),`
    })
    .join("\n\n")
}