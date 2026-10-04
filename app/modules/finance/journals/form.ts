import { createForm, field } from "@framework"

export const journalsForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "finance.journals.fields.company",
      "required": true,
      "displayKey": "company_name",
      "readonlyWhen": {
        "field": "$me.data_scope.values.company",
        "op": "is_not_null"
      },
      "default": "$me.placement.company",
      "tab": "general",
      "order": 20
    }),

  field.date("posting_date", "Posting Date", {
      "labelKey": "finance.journals.fields.posting_date",
      "required": true,
      "hint": "Menentukan periode akuntansinya. Periode dan tahun buku diisi sendiri dari tanggal ini.",
      "tab": "general",
      "order": 30
    }),

  field.date("document_date", "Document Date", {
      "labelKey": "finance.journals.fields.document_date",
      "hint": "Tanggal dokumen sumbernya. Kosong = tanggal pembukuan.",
      "tab": "general",
      "order": 40
    }),

  field.select("journal_type", "Journal Type", {
      "labelKey": "finance.journals.fields.journal_type",
      "required": true,
      "displayKey": "journal_type_label",
      "default": "manual",
      "multiple": false,
      "tab": "general",
      "order": 50,
      "options": [
        {
          "label": "Manual",
          "value": "manual"
        },
        {
          "label": "Automatic",
          "value": "automatic"
        },
        {
          "label": "Adjustment",
          "value": "adjustment"
        },
        {
          "label": "Accrual",
          "value": "accrual"
        },
        {
          "label": "Reversal",
          "value": "reversal"
        },
        {
          "label": "Recurring",
          "value": "recurring"
        },
        {
          "label": "Opening",
          "value": "opening"
        },
        {
          "label": "Closing",
          "value": "closing"
        },
        {
          "label": "Intercompany",
          "value": "intercompany"
        },
        {
          "label": "Allocation",
          "value": "allocation"
        }
      ]
    }),

  field.lookup("currency", "Currency", "/api/administration/currency/lookup/currencies/", {
      "labelKey": "finance.journals.fields.currency",
      "displayKey": "currency_code",
      "hint": "Kosong = mata uang buku besar perusahaan.",
      "tab": "general",
      "order": 60
    }),

  field.number("exchange_rate", "Exchange Rate", {
      "labelKey": "finance.journals.fields.exchange_rate",
      "hint": "Terhadap mata uang buku besar. Diabaikan kalau mata uang transaksinya sama.",
      "default": 1,
      "tab": "general",
      "order": 70
    }),

  field.textarea("description", "Description", {
      "labelKey": "finance.journals.fields.description",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 80
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "finance.journals.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.text("source_module", "Source Module", {
      "labelKey": "finance.journals.fields.source_module",
      "disabled": true,
      "default": "",
      "tab": "source",
      "order": 100
    }),

  field.text("metadata", "Metadata", {
      "labelKey": "finance.journals.fields.metadata",
      "tab": "general"
    }),

  field.text("line_items", "Line items", {
      "labelKey": "finance.journals.fields.line_items",
      "tab": "general"
    }),

  field.text("source_type", "Source Type", {
      "labelKey": "finance.journals.fields.source_type",
      "disabled": true,
      "default": "",
      "tab": "source",
      "order": 110
    }),

  field.text("source_id", "Source ID", {
      "labelKey": "finance.journals.fields.source_id",
      "disabled": true,
      "default": "",
      "tab": "source",
      "order": 120
    }),

  field.text("source_reference", "Source Reference", {
      "labelKey": "finance.journals.fields.source_reference",
      "disabled": true,
      "default": "",
      "tab": "source",
      "order": 130
    }),
], {
  columns: 3,
})