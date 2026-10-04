import { createForm, field } from "@framework"

export const helpCategoriesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "administration.help-categories.fields.code",
      "required": true,
      "hint": "Kode tetap. Dipakai seed, tidak tampil ke pembaca.",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "administration.help-categories.fields.name",
      "required": true,
      "hint": "Judul kelompok di sidebar Help Center.",
      "tab": "general",
      "order": 20
    }),

  field.select("module", "Module", {
      "labelKey": "administration.help-categories.fields.module",
      "hint": "Modul yang dijelaskan. Dikosongkan = panduan umum yang tidak menempel ke modul mana pun.",
      "default": "",
      "multiple": false,
      "tab": "general",
      "order": 30,
      "options": [
        {
          "label": "General",
          "value": ""
        },
        {
          "label": "HR",
          "value": "hr"
        },
        {
          "label": "Payroll",
          "value": "payroll"
        },
        {
          "label": "Administration",
          "value": "administration"
        },
        {
          "label": "Workflow",
          "value": "workflow"
        },
        {
          "label": "Finance",
          "value": "finance"
        },
        {
          "label": "Supply Chain",
          "value": "scm"
        }
      ]
    }),

  field.text("icon", "Icon", {
      "labelKey": "administration.help-categories.fields.icon",
      "hint": "Nama ikon Nuxt UI, mis. `i-lucide-rocket`. Nama yang tidak dikenal jatuh ke ikon bawaan tanpa error.",
      "default": "",
      "tab": "general",
      "order": 40
    }),

  field.textarea("description", "Description", {
      "labelKey": "administration.help-categories.fields.description",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 50
    }),

  field.number("sort_order", "Sort Order", {
      "labelKey": "administration.help-categories.fields.sort_order",
      "hint": "Angka kecil tampil lebih dulu.",
      "default": 0,
      "tab": "general",
      "order": 60
    }),

  field.switch("is_published", "Published", {
      "labelKey": "administration.help-categories.fields.is_published",
      "hint": "Dimatikan: kategori beserta seluruh artikelnya hilang dari Help Center, tapi tetap bisa disunting di sini.",
      "default": true,
      "tab": "general",
      "order": 70
    }),

  field.number("article_count", "Articles", {
      "labelKey": "administration.help-categories.fields.article_count",
      "readonly": true,
      "modes": [
        "edit"
      ],
      "tab": "general",
      "order": 80
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "administration.help-categories.fields.is_active",
      "default": true,
      "tab": "general"
    }),
], {
  columns: 2,
})