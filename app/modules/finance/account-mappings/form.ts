import { createForm, field } from "@framework"

export const accountMappingsForm = createForm([
  field.text("code", "Code", {
      "labelKey": "finance.account-mappings.fields.code",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "finance.account-mappings.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.text("mapping_key", "Mapping Key", {
      "labelKey": "finance.account-mappings.fields.mapping_key",
      "required": true,
      "hint": "Peran akuntansi yang dicari kebijakan, mis. SALARY_EXPENSE. Huruf besar; disamakan otomatis.",
      "tab": "general",
      "order": 30
    }),

  field.lookup("account", "Account", "/api/finance/lookup/accounts/", {
      "labelKey": "finance.account-mappings.fields.account",
      "required": true,
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "account_name",
      "tab": "general",
      "order": 40
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "finance.account-mappings.fields.company",
      "displayKey": "company_name",
      "hint": "Kosong = berlaku untuk semua perusahaan.",
      "tab": "scope",
      "order": 50
    }),

  field.text("event_type", "Event Type", {
      "labelKey": "finance.account-mappings.fields.event_type",
      "hint": "Kosong = berlaku untuk semua jenis kejadian.",
      "default": "",
      "tab": "scope",
      "order": 60
    }),

  field.text("selectors", "Conditions", {
      "labelKey": "finance.account-mappings.fields.selectors",
      "hint": "Pasangan kunci–nilai yang harus cocok dengan data kejadian, mis. {\"component_type\": \"BASIC_SALARY\"}. Kosong = tanpa syarat tambahan. Tiap pasangan menaikkan kekhususan baris ini.",
      "tab": "scope",
      "order": 70
    }),

  field.lookup("location", "Site", "/api/administration/organization/lookup/locations/", {
      "labelKey": "finance.account-mappings.fields.location",
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "location_name",
      "tab": "scope",
      "order": 80
    }),

  field.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
      "labelKey": "finance.account-mappings.fields.department",
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "department_name",
      "tab": "scope",
      "order": 90
    }),

  field.lookup("cost_center", "Cost Center", "/api/administration/organization/lookup/cost-centers/", {
      "labelKey": "finance.account-mappings.fields.cost_center",
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "cost_center_name",
      "tab": "scope",
      "order": 100
    }),

  field.date("effective_from", "Effective From", {
      "labelKey": "finance.account-mappings.fields.effective_from",
      "tab": "scope",
      "order": 110
    }),

  field.date("effective_to", "Effective To", {
      "labelKey": "finance.account-mappings.fields.effective_to",
      "tab": "scope",
      "order": 120
    }),

  field.switch("is_active", "Active", {
      "labelKey": "finance.account-mappings.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 130
    }),
], {
  columns: 2,
})