import { createForm, field } from "@framework"

export const positionForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "administration.organization.position.fields.company",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
      "labelKey": "administration.organization.position.fields.branch",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "tab": "general",
      "order": 20
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "administration.organization.position.fields.location",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "branch_id": "$branch"
      },
      "tab": "general",
      "order": 30
    }),

  field.lookup("division", "Division", "/api/administration/organization/lookup/divisions/", {
      "labelKey": "administration.organization.position.fields.division",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "branch_id": "$branch",
        "location_id": "$location"
      },
      "tab": "general",
      "order": 40
    }),

  field.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
      "labelKey": "administration.organization.position.fields.department",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "location_id": "$location",
        "division_id": "$division"
      },
      "tab": "general",
      "order": 50
    }),

  field.lookup("section", "Section", "/api/administration/organization/lookup/sections/", {
      "labelKey": "administration.organization.position.fields.section",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "location_id": "$location",
        "division_id": "$division",
        "department_id": "$department"
      },
      "tab": "general",
      "order": 60
    }),

  field.lookup("job_category", "Job Category", "/api/administration/references/hr/lookup/job-categories/", {
      "labelKey": "administration.organization.position.fields.job_category",
      "tab": "general",
      "order": 70
    }),

  field.lookup("job_level", "Job Level", "/api/administration/references/hr/lookup/job-levels/", {
      "labelKey": "administration.organization.position.fields.job_level",
      "tab": "general",
      "order": 80
    }),

  field.text("code", "Position Code", {
      "labelKey": "administration.organization.position.fields.code",
      "required": true,
      "placeholder": "e.g. SUP-MINE",
      "tab": "general",
      "order": 90
    }),

  field.text("name", "Position Name", {
      "labelKey": "administration.organization.position.fields.name",
      "required": true,
      "placeholder": "e.g. Mine Supervisor",
      "tab": "general",
      "order": 100
    }),

  field.number("headcount", "Headcount", {
      "labelKey": "administration.organization.position.fields.headcount",
      "default": 1,
      "tab": "general"
    }),

  field.textarea("description", "Description", {
      "labelKey": "administration.organization.position.fields.description",
      "layout": "full",
      "tab": "general"
    }),

  field.switch("is_manager", "Is manager", {
      "labelKey": "administration.organization.position.fields.is_manager",
      "default": false,
      "tab": "general"
    }),

  field.switch("is_active", "Active", {
      "labelKey": "administration.organization.position.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})