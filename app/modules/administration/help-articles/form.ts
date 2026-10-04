import { createForm, field } from "@framework"

export const helpArticlesForm = createForm([
  field.text("title", "Title", {
      "labelKey": "administration.help-articles.fields.title",
      "required": true,
      "layout": "full",
      "tab": "content",
      "order": 10
    }),

  field.lookup("category", "Category", "/api/helpcenter/lookup/help-categories/", {
      "labelKey": "administration.help-articles.fields.category",
      "required": true,
      "displayKey": "category_name",
      "tab": "content",
      "order": 20
    }),

  field.textarea("summary", "Summary", {
      "labelKey": "administration.help-articles.fields.summary",
      "hint": "Satu kalimat yang tampil di kartu daftar. Ini yang dibaca orang sebelum memutuskan membuka artikelnya.",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "content",
      "order": 30
    }),

  field.richtext("content", "Content", {
      "labelKey": "administration.help-articles.fields.content",
      "hint": "Isi panduan. Tulis langkah demi langkah dan sebut nama tombol persis seperti yang tertulis di layar.",
      "default": "",
      "layout": "full",
      "tab": "content",
      "order": 40
    }),

  field.url("video_url", "Video URL", {
      "labelKey": "administration.help-articles.fields.video_url",
      "hint": "Tautan video tutorial, kalau ada.",
      "default": "",
      "tab": "content",
      "order": 50
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "administration.help-articles.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.select("status", "Status", {
      "labelKey": "administration.help-articles.fields.status",
      "required": true,
      "displayKey": "status_label",
      "hint": "Hanya yang Published yang muncul di Help Center.",
      "default": "draft",
      "multiple": false,
      "tab": "publishing",
      "order": 110,
      "options": [
        {
          "label": "Draft",
          "value": "draft"
        },
        {
          "label": "Published",
          "value": "published"
        }
      ]
    }),

  field.number("sort_order", "Sort Order", {
      "labelKey": "administration.help-articles.fields.sort_order",
      "hint": "Urutan dalam kategorinya. Angka kecil di atas.",
      "default": 0,
      "tab": "publishing",
      "order": 120
    }),

  field.text("route_prefix", "Related Screen", {
      "labelKey": "administration.help-articles.fields.route_prefix",
      "hint": "Rute layar yang dijelaskan, mis. `/hr/leave`. Artikel ini otomatis ditawarkan saat pengguna membuka layar itu. Dikosongkan = tidak menempel ke layar mana pun.",
      "default": "",
      "tab": "publishing",
      "order": 130
    }),

  field.lookup("role", "Visible To Role", "/api/accounts/lookup/roles/", {
      "labelKey": "administration.help-articles.fields.role",
      "displayKey": "role_name",
      "hint": "Dikosongkan = terbaca semua pengguna. Ini penyaring tampilan, bukan penjagaan rahasia — jangan menaruh data sensitif di artikel panduan.",
      "tab": "publishing",
      "order": 140
    }),

  field.text("keywords", "Search Keywords", {
      "labelKey": "administration.help-articles.fields.keywords",
      "hint": "Kata yang dipakai pengguna tapi tidak ada di isi artikel — mis. 'ijin' untuk artikel berjudul 'Cuti'. Dipisah koma.",
      "default": "",
      "tab": "publishing",
      "order": 150
    }),

  field.text("icon", "Icon", {
      "labelKey": "administration.help-articles.fields.icon",
      "hint": "Kosong = ikut ikon kategorinya.",
      "default": "",
      "tab": "publishing",
      "order": 160
    }),

  field.text("slug", "Slug", {
      "labelKey": "administration.help-articles.fields.slug",
      "hint": "Bagian URL artikel. Dikosongkan = diturunkan dari judul. Mengubahnya membuat tautan lama ke artikel ini mati.",
      "tab": "publishing",
      "order": 170
    }),

  field.text("code", "Code", {
      "labelKey": "administration.help-articles.fields.code",
      "hint": "Kode tetap untuk seed. Tidak tampil ke pembaca.",
      "modes": [
        "edit"
      ],
      "tab": "publishing",
      "order": 180
    }),

  field.number("view_count", "Views", {
      "labelKey": "administration.help-articles.fields.view_count",
      "readonly": true,
      "modes": [
        "edit"
      ],
      "default": 0,
      "tab": "stats",
      "order": 210
    }),

  field.number("helpful_count", "Helpful", {
      "labelKey": "administration.help-articles.fields.helpful_count",
      "readonly": true,
      "modes": [
        "edit"
      ],
      "default": 0,
      "tab": "stats",
      "order": 220
    }),

  field.number("not_helpful_count", "Not Helpful", {
      "labelKey": "administration.help-articles.fields.not_helpful_count",
      "readonly": true,
      "modes": [
        "edit"
      ],
      "default": 0,
      "tab": "stats",
      "order": 230
    }),

  field.datetime("published_at", "Published At", {
      "labelKey": "administration.help-articles.fields.published_at",
      "readonly": true,
      "hint": "Diisi otomatis saat status berubah jadi Published.",
      "modes": [
        "edit"
      ],
      "tab": "stats",
      "order": 240
    }),
], {
  columns: 3,
})