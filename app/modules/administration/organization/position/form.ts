import { createForm, field } from "@framework"

export const positionForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "tab": "general",
      "order": 20
    }),

  field.lookup("site", "Site", "/api/administration/organization/lookup/sites/", {
      "dependsOn": "branch",
      "lookupParams": {
        "branch_id": "$branch"
      },
      "tab": "general",
      "order": 30
    }),

  field.lookup("division", "Division", "/api/administration/organization/lookup/divisions/", {
      "dependsOn": "site",
      "lookupParams": {
        "site_id": "$site"
      },
      "tab": "general",
      "order": 40
    }),

  field.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
      "dependsOn": "division",
      "lookupParams": {
        "division_id": "$division"
      },
      "tab": "general",
      "order": 50
    }),

  field.lookup("section", "Section", "/api/administration/organization/lookup/sections/", {
      "dependsOn": "department",
      "lookupParams": {
        "department_id": "$department"
      },
      "tab": "general",
      "order": 60
    }),

  field.lookup("job_category", "Job Category", "/api/administration/references/hr/lookup/job-categories/", {
      "tab": "general",
      "order": 70
    }),

  field.lookup("job_level", "Job Level", "/api/administration/references/hr/lookup/job-levels/", {
      "tab": "general",
      "order": 80
    }),

  field.text("code", "Position Code", {
      "required": true,
      "placeholder": "e.g. SUP-MINE",
      "tab": "general",
      "order": 90
    }),

  field.text("name", "Position Name", {
      "required": true,
      "placeholder": "e.g. Mine Supervisor",
      "tab": "general",
      "order": 100
    }),

  field.text("headcount", "Headcount", {
      "tab": "general"
    }),

  field.textarea("description", "Description", {
      "layout": "full",
      "tab": "general"
    }),

  field.switch("is_manager", "Is manager", {
      "tab": "general"
    }),

  field.switch("is_active", "Active", {
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})