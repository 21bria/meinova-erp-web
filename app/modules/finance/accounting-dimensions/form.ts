import { createForm, field } from "@framework"

export const accountingDimensionsForm = createForm([
  field.text("code", "Code", {
      "labelKey": "finance.accounting-dimensions.fields.code",
      "required": true,
      "readonlyWhen": {
        "field": "is_locked",
        "op": "is_true"
      },
      "hint": "Huruf kecil dan garis bawah, mis. `project`. Dipakai kebijakan akuntansi untuk menunjuk dimensi ini.",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "finance.accounting-dimensions.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.select("data_type", "Data Type", {
      "labelKey": "finance.accounting-dimensions.fields.data_type",
      "displayKey": "data_type_label",
      "default": "reference",
      "multiple": false,
      "tab": "general",
      "order": 30,
      "options": [
        {
          "label": "Reference",
          "value": "reference"
        },
        {
          "label": "Text",
          "value": "text"
        }
      ]
    }),

  field.switch("is_required", "Required on Every Line", {
      "labelKey": "finance.accounting-dimensions.fields.is_required",
      "hint": "Diperiksa saat posting, bukan saat menyimpan draf — draf yang datanya belum lengkap harus tetap bisa disimpan.",
      "default": false,
      "tab": "general",
      "order": 40
    }),

  field.text("lookup_endpoint", "Lookup Endpoint", {
      "labelKey": "finance.accounting-dimensions.fields.lookup_endpoint",
      "visibleWhen": {
        "field": "data_type",
        "op": "eq",
        "value": "reference"
      },
      "hint": "Endpoint dropdown pemilih nilainya. Kosong = nilainya diketik.",
      "default": "",
      "tab": "general",
      "order": 50
    }),

  field.text("lookup_display_key", "Lookup Label Key", {
      "labelKey": "finance.accounting-dimensions.fields.lookup_display_key",
      "visibleWhen": {
        "field": "data_type",
        "op": "eq",
        "value": "reference"
      },
      "default": "",
      "tab": "general",
      "order": 60
    }),

  field.number("sort_order", "Sort Order", {
      "labelKey": "finance.accounting-dimensions.fields.sort_order",
      "default": 0,
      "tab": "general",
      "order": 70
    }),

  field.switch("is_active", "Active", {
      "labelKey": "finance.accounting-dimensions.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 80
    }),

  field.textarea("description", "Notes", {
      "labelKey": "finance.accounting-dimensions.fields.description",
      "default": "",
      "layout": "full",
      "tab": "general",
      "order": 90
    }),
], {
  columns: 2,
})