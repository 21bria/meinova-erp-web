import { createForm, field } from "@framework"

export const recruitmentForm = createForm([
  field.text("code", "Code", {
      "labelKey": "hr.recruitment.fields.code",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("title", "Title", {
      "labelKey": "hr.recruitment.fields.title",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.select("status", "Status", {
      "labelKey": "hr.recruitment.fields.status",
      "required": true,
      "displayKey": "status_label",
      "default": "draft",
      "multiple": false,
      "tab": "general",
      "order": 30,
      "options": [
        {
          "label": "Draft",
          "value": "draft"
        },
        {
          "label": "Open",
          "value": "open"
        },
        {
          "label": "On Hold",
          "value": "on_hold"
        },
        {
          "label": "Filled",
          "value": "filled"
        },
        {
          "label": "Closed",
          "value": "closed"
        },
        {
          "label": "Cancelled",
          "value": "cancelled"
        }
      ]
    }),

  field.number("quota", "Quota", {
      "labelKey": "hr.recruitment.fields.quota",
      "required": true,
      "default": 1,
      "tab": "general",
      "order": 40
    }),

  field.date("open_date", "Open Date", {
      "labelKey": "hr.recruitment.fields.open_date",
      "required": true,
      "tab": "general",
      "order": 50
    }),

  field.date("close_date", "Close Date", {
      "labelKey": "hr.recruitment.fields.close_date",
      "tab": "general",
      "order": 60
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.recruitment.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "hr.recruitment.fields.company",
      "required": true,
      "displayKey": "company_name",
      "tab": "organization",
      "order": 110
    }),

  field.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
      "labelKey": "hr.recruitment.fields.branch",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "branch_name",
      "tab": "organization",
      "order": 120
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "hr.recruitment.fields.location",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "branch_id": "$branch"
      },
      "displayKey": "location_name",
      "tab": "organization",
      "order": 130
    }),

  field.lookup("division", "Division", "/api/administration/organization/lookup/divisions/", {
      "labelKey": "hr.recruitment.fields.division",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "branch_id": "$branch",
        "location_id": "$location"
      },
      "displayKey": "division_name",
      "tab": "organization",
      "order": 140
    }),

  field.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
      "labelKey": "hr.recruitment.fields.department",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "branch_id": "$branch",
        "location_id": "$location",
        "division_id": "$division"
      },
      "displayKey": "department_name",
      "tab": "organization",
      "order": 150
    }),

  field.lookup("position", "Position", "/api/administration/organization/lookup/positions/", {
      "labelKey": "hr.recruitment.fields.position",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "branch_id": "$branch",
        "location_id": "$location",
        "division_id": "$division",
        "department_id": "$department"
      },
      "displayKey": "position_name",
      "tab": "organization",
      "order": 160
    }),

  field.lookup("employment_type", "Employment Type", "/api/administration/references/hr/lookup/employment-types/", {
      "labelKey": "hr.recruitment.fields.employment_type",
      "displayKey": "employment_type_name",
      "tab": "organization",
      "order": 170
    }),

  field.textarea("description", "Description", {
      "labelKey": "hr.recruitment.fields.description",
      "default": "",
      "rows": 5,
      "layout": "full",
      "tab": "detail",
      "order": 210
    }),

  field.textarea("requirements", "Requirements", {
      "labelKey": "hr.recruitment.fields.requirements",
      "default": "",
      "rows": 5,
      "layout": "full",
      "tab": "detail",
      "order": 220
    }),
], {
  columns: 3,
})