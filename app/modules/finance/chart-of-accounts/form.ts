import { createForm, field } from "@framework"

export const chartOfAccountsForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "finance.chart-of-accounts.fields.company",
      "required": true,
      "displayKey": "company_name",
      "hint": "Bagan akun berdiri sendiri per badan usaha. Kode yang sama boleh dipakai dua perusahaan dengan arti berbeda.",
      "default": "$me.placement.company",
      "tab": "general",
      "order": 10
    }),

  field.text("code", "Account Code", {
      "labelKey": "finance.chart-of-accounts.fields.code",
      "required": true,
      "hint": "Bebas — tidak ada format yang dipaksakan sistem. Panjang dan penomorannya mengikuti kebijakan perusahaan.",
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Account Name", {
      "labelKey": "finance.chart-of-accounts.fields.name",
      "required": true,
      "tab": "general",
      "order": 30
    }),

  field.lookup("parent", "Parent Account", "/api/finance/lookup/account-groups/", {
      "labelKey": "finance.chart-of-accounts.fields.parent",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "parent_name",
      "hint": "Hanya akun grup yang bisa jadi induk. Kosongkan untuk akun tingkat teratas.",
      "tab": "general",
      "order": 40
    }),

  field.select("account_type", "Account Type", {
      "labelKey": "finance.chart-of-accounts.fields.account_type",
      "required": true,
      "displayKey": "account_type_label",
      "hint": "Menentukan saldo normal dan penempatannya di neraca atau laba rugi. Harus sama dengan induknya.",
      "multiple": false,
      "tab": "general",
      "order": 50,
      "options": [
        {
          "label": "Asset",
          "value": "asset"
        },
        {
          "label": "Liability",
          "value": "liability"
        },
        {
          "label": "Equity",
          "value": "equity"
        },
        {
          "label": "Revenue",
          "value": "revenue"
        },
        {
          "label": "Expense",
          "value": "expense"
        }
      ]
    }),

  field.select("account_category", "Category", {
      "labelKey": "finance.chart-of-accounts.fields.account_category",
      "displayKey": "account_category_label",
      "hint": "Baris penyajian di laporan keuangan. Opsional.",
      "default": "",
      "multiple": false,
      "tab": "general",
      "order": 60,
      "options": [
        {
          "label": "Current Asset",
          "value": "current_asset"
        },
        {
          "label": "Non-Current Asset",
          "value": "non_current_asset"
        },
        {
          "label": "Fixed Asset",
          "value": "fixed_asset"
        },
        {
          "label": "Intangible Asset",
          "value": "intangible_asset"
        },
        {
          "label": "Other Asset",
          "value": "other_asset"
        },
        {
          "label": "Current Liability",
          "value": "current_liability"
        },
        {
          "label": "Non-Current Liability",
          "value": "non_current_liability"
        },
        {
          "label": "Other Liability",
          "value": "other_liability"
        },
        {
          "label": "Equity",
          "value": "equity"
        },
        {
          "label": "Operating Revenue",
          "value": "operating_revenue"
        },
        {
          "label": "Other Income",
          "value": "other_revenue"
        },
        {
          "label": "Cost of Sales",
          "value": "cost_of_sales"
        },
        {
          "label": "Operating Expense",
          "value": "operating_expense"
        },
        {
          "label": "Other Expense",
          "value": "other_expense"
        },
        {
          "label": "Tax Expense",
          "value": "tax_expense"
        }
      ]
    }),

  field.select("normal_balance", "Normal Balance", {
      "labelKey": "finance.chart-of-accounts.fields.normal_balance",
      "hint": "Kosongkan untuk mengikuti golongan akun. Diisi hanya untuk akun kontra — akumulasi penyusutan, potongan penjualan.",
      "multiple": false,
      "tab": "general",
      "order": 70,
      "options": [
        {
          "label": "Debit",
          "value": "debit"
        },
        {
          "label": "Credit",
          "value": "credit"
        }
      ]
    }),

  field.switch("posting_allowed", "Posting Allowed", {
      "labelKey": "finance.chart-of-accounts.fields.posting_allowed",
      "hint": "Mati = akun grup/judul yang tidak menerima jurnal. Akun yang punya anak selalu jadi grup.",
      "default": true,
      "tab": "general",
      "order": 80
    }),

  field.switch("control_account", "Control Account", {
      "labelKey": "finance.chart-of-accounts.fields.control_account",
      "hint": "Saldonya dikendalikan buku pembantu (piutang, utang, aset tetap).",
      "default": false,
      "tab": "behaviour",
      "order": 90
    }),

  field.switch("reconciliation_required", "Reconciliation Required", {
      "labelKey": "finance.chart-of-accounts.fields.reconciliation_required",
      "hint": "Mutasinya harus direkonsiliasi — kas, bank, kliring.",
      "default": false,
      "tab": "behaviour",
      "order": 100
    }),

  field.text("metadata", "Metadata", {
      "labelKey": "finance.chart-of-accounts.fields.metadata",
      "tab": "general"
    }),

  field.lookup("default_currency", "Currency Restriction", "/api/administration/currency/lookup/currencies/", {
      "labelKey": "finance.chart-of-accounts.fields.default_currency",
      "displayKey": "default_currency_code",
      "hint": "Kosong = menerima mata uang apa pun. Diisi untuk rekening bank valas.",
      "tab": "behaviour",
      "order": 110
    }),

  field.number("sort_order", "Sort Order", {
      "labelKey": "finance.chart-of-accounts.fields.sort_order",
      "default": 0,
      "tab": "behaviour",
      "order": 120
    }),

  field.switch("is_active", "Active", {
      "labelKey": "finance.chart-of-accounts.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 130
    }),

  field.textarea("description", "Notes", {
      "labelKey": "finance.chart-of-accounts.fields.description",
      "layout": "full",
      "tab": "behaviour",
      "order": 140
    }),
], {
  columns: 2,
})